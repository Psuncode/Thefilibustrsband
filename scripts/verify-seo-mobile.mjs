import { mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import process from "node:process";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");
const outputDir = join(repoRoot, "tmp", "verify-seo");
const viewport = { width: 375, height: 812 };
const host = "127.0.0.1";
const port = 4323;
const baseUrl = `http://${host}:${port}`;
const showDataPath = join(repoRoot, "src", "data", "shows.ts");
const serverStartupTimeoutMs = 30_000;
const pageTimeoutMs = 15_000;
const requestTypesToTrack = new Set(["document", "image", "stylesheet"]);
const requiredSeoSelectors = [
  'link[rel="canonical"][href]',
  'meta[name="description"][content]',
  'meta[property="og:title"][content]',
  'meta[property="og:description"][content]',
  'meta[property="og:image"][content]'
];

const readDynamicShowRoute = async () => {
  const source = await readFile(showDataPath, "utf8");
  const match = source.match(/slug:\s*"([^"]+)"/);

  if (!match) {
    throw new Error(`Unable to derive a show slug from ${showDataPath}`);
  }

  return `/shows/${match[1]}`;
};

const wait = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const sanitizeRouteForFilename = (route) => {
  if (route === "/") return "home";

  return route.replace(/^\/+/, "").replaceAll("/", "-");
};

const collectEventJsonLd = async (page) => {
  return page.$$eval('script[type="application/ld+json"]', (nodes) => {
    const extractItems = (value) => {
      if (!value || typeof value !== "object") return [];
      if (Array.isArray(value)) return value.flatMap(extractItems);
      if (Array.isArray(value["@graph"])) return value["@graph"].flatMap(extractItems);
      return [value];
    };

    return nodes.flatMap((node) => {
      try {
        return extractItems(JSON.parse(node.textContent || ""));
      } catch {
        return [];
      }
    });
  });
};

const waitForServerReady = async () => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < serverStartupTimeoutMs) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      // Ignore connection failures while the dev server is starting.
    }

    await wait(500);
  }

  throw new Error(`Timed out waiting for ${baseUrl} to become reachable`);
};

const startLocalServer = () => {
  const recentLogs = [];
  let shutdownRequested = false;
  const server = spawn(
    "npm",
    ["run", "dev", "--", "--host", host, "--port", String(port), "--strictPort"],
    {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"]
    }
  );

  const recordLogChunk = (chunk) => {
    const text = chunk.toString().trim();
    if (!text) return;

    recentLogs.push(...text.split("\n"));
    if (recentLogs.length > 30) {
      recentLogs.splice(0, recentLogs.length - 30);
    }
  };

  server.stdout.on("data", recordLogChunk);
  server.stderr.on("data", recordLogChunk);

  let cleanedUp = false;

  const cleanup = async () => {
    if (cleanedUp) return;
    cleanedUp = true;

    if (server.exitCode === null && !server.killed) {
      shutdownRequested = true;
      server.kill("SIGTERM");
      await Promise.race([
        new Promise((resolvePromise) => server.once("exit", resolvePromise)),
        wait(5_000)
      ]);
    }
  };

  return {
    cleanup,
    recentLogs,
    server,
    wasShutdownRequested: () => shutdownRequested
  };
};

const checkPage = async ({ browser, route, requireEventJsonLd }) => {
  const page = await browser.newPage({ viewport });
  const failures = [];
  const requestFailures = [];
  const seenFailedRequests = new Set();

  const recordRequestFailure = (kind, url, detail) => {
    const entry = `${kind.toUpperCase()} ${url} (${detail})`;
    if (seenFailedRequests.has(entry)) return;
    seenFailedRequests.add(entry);
    requestFailures.push(entry);
  };

  page.on("requestfailed", (request) => {
    if (!requestTypesToTrack.has(request.resourceType())) return;
    recordRequestFailure(request.resourceType(), request.url(), request.failure()?.errorText || "request failed");
  });

  page.on("response", (response) => {
    const request = response.request();
    if (!requestTypesToTrack.has(request.resourceType())) return;
    if (response.status() < 400) return;
    recordRequestFailure(request.resourceType(), response.url(), `HTTP ${response.status()}`);
  });

  const url = new URL(route, baseUrl).href;

  try {
    const response = await page.goto(url, {
      timeout: pageTimeoutMs,
      waitUntil: "networkidle"
    });

    if (!response || !response.ok()) {
      failures.push(`document request did not complete successfully for ${route}`);
    }

    const seoChecks = await Promise.all(
      requiredSeoSelectors.map((selector) =>
        page.locator(selector).count().then((count) => ({ count, selector }))
      )
    );

    for (const check of seoChecks) {
      if (check.count === 0) {
        failures.push(`missing required SEO tag "${check.selector}" on ${route}`);
      }
    }

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));

    if (overflow.scrollWidth > overflow.clientWidth) {
      failures.push(
        `horizontal overflow on ${route}: scrollWidth ${overflow.scrollWidth} exceeds clientWidth ${overflow.clientWidth}`
      );
    }

    if (requireEventJsonLd) {
      const structuredData = await collectEventJsonLd(page);
      const hasEvent = structuredData.some((item) => item?.["@type"] === "Event");

      if (!hasEvent) {
        failures.push(`missing Event JSON-LD on ${route}`);
      }
    }
  } finally {
    const screenshotPath = join(outputDir, `${sanitizeRouteForFilename(route)}.png`);
    await page.screenshot({ fullPage: true, path: screenshotPath });
    await page.close();

    if (requestFailures.length > 0) {
      failures.push(...requestFailures.map((entry) => `failed request on ${route}: ${entry}`));
    }

    return {
      failures,
      route,
      screenshotPath
    };
  }
};

const main = async () => {
  const dynamicShowRoute = await readDynamicShowRoute();
  const routes = [
    { route: "/", requireEventJsonLd: false },
    { route: "/shows", requireEventJsonLd: false },
    { route: dynamicShowRoute, requireEventJsonLd: true }
  ];

  await mkdir(outputDir, { recursive: true });

  const { cleanup, recentLogs, server, wasShutdownRequested } = startLocalServer();
  const handleSignal = async () => {
    await cleanup();
    process.exit(1);
  };

  process.once("SIGINT", handleSignal);
  process.once("SIGTERM", handleSignal);

  try {
    server.once("exit", (code) => {
      if (wasShutdownRequested()) return;
      if (code !== null && code !== 0) {
        console.error(`Local Astro server exited early with code ${code}`);
      }
    });

    await waitForServerReady();

    const browser = await chromium.launch({ headless: true });

    try {
      const results = [];
      for (const route of routes) {
        results.push(await checkPage({ browser, ...route }));
      }

      const hardFailures = results.flatMap((result) =>
        result.failures.map((failure) => ({ failure, route: result.route }))
      );

      console.log(`Checked ${results.length} routes at ${baseUrl} with viewport ${viewport.width}x${viewport.height}`);
      for (const result of results) {
        console.log(`ROUTE ${result.route}`);
        console.log(`SCREENSHOT ${result.screenshotPath}`);
      }

      if (hardFailures.length > 0) {
        for (const item of hardFailures) {
          console.error(`FAIL ${item.route}: ${item.failure}`);
        }

        process.exitCode = 1;
        return;
      }

      console.log("SEO mobile verification passed.");
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));

    if (recentLogs.length > 0) {
      console.error("Recent server logs:");
      for (const line of recentLogs) {
        console.error(line);
      }
    }

    process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", handleSignal);
    process.removeListener("SIGTERM", handleSignal);
    await cleanup();
  }
};

await main();
