/**
 * SEO verification via agent-browser (https://github.com/vercel-labs/agent-browser).
 *
 * A native-CLI alternative to the deprecated Playwright `verify:seo` script.
 * It boots the dev server, drives the bundled Chrome through the `agent-browser`
 * CLI, and asserts both generic SEO tags and the Provo geo / brand-keyword
 * coverage that the Search Console optimization added.
 *
 * Run with: npm run verify:seo:agent-browser
 * Requires a one-time `agent-browser install` to fetch the browser binary.
 */

import { spawn, execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, "..");

const host = "127.0.0.1";
const port = 4323;
const baseUrl = `http://${host}:${port}`;
const session = `verify-seo-${process.pid}`;
const serverStartupTimeoutMs = 30_000;
const commandTimeoutMs = 25_000;
const serverShutdownTimeoutMs = 5_000;

const wait = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const isMissingProcessError = (error) =>
  Boolean(error && typeof error === "object" && "code" in error && error.code === "ESRCH");

/**
 * Run an agent-browser command with --json and the shared session.
 * Returns the parsed { success, data, error } envelope.
 */
const agentBrowser = (args) =>
  new Promise((resolvePromise, reject) => {
    execFile(
      "agent-browser",
      [...args, "--session", session, "--json"],
      { cwd: repoRoot, timeout: commandTimeoutMs, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error && !stdout) {
          reject(new Error(`agent-browser ${args[0]} failed: ${stderr || error.message}`));
          return;
        }

        try {
          resolvePromise(JSON.parse(stdout));
        } catch {
          reject(new Error(`agent-browser ${args[0]} returned non-JSON output: ${stdout}`));
        }
      }
    );
  });

const open = (route) => agentBrowser(["open", new URL(route, baseUrl).href]);

/**
 * Evaluate a JS expression in the page and return its value.
 * The expression should return a JSON-serializable value; it is wrapped in
 * JSON.stringify so structured results survive the CLI boundary.
 */
const evaluate = async (expression) => {
  const envelope = await agentBrowser(["eval", `JSON.stringify((() => (${expression}))())`]);
  if (!envelope.success) {
    throw new Error(`eval failed: ${envelope.error}`);
  }
  return JSON.parse(envelope.data.result);
};

const requiredSeoExpression = `(() => {
  const selectors = [
    'link[rel="canonical"][href]',
    'meta[name="description"][content]',
    'meta[property="og:title"][content]',
    'meta[property="og:description"][content]',
    'meta[property="og:image"][content]'
  ];
  return selectors.filter((selector) => !document.querySelector(selector));
})()`;

const musicGroupExpression = `(() => {
  const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')];
  const flatten = (value) => {
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (Array.isArray(value['@graph'])) return value['@graph'].flatMap(flatten);
    return [value];
  };
  const items = nodes.flatMap((node) => {
    try { return flatten(JSON.parse(node.textContent || '')); } catch { return []; }
  });
  const group = items.find((item) => item['@type'] === 'MusicGroup');
  return group
    ? { alternateName: group.alternateName || [], keywords: group.keywords || [] }
    : null;
})()`;

const bodyTextExpression = `document.body.innerText`;

const checks = [];
const recordFailures = (route, failures) => {
  for (const failure of failures) {
    checks.push({ route, failure });
  }
};

const verifyRequiredSeoTags = async (route) => {
  await open(route);
  const missing = await evaluate(requiredSeoExpression);
  recordFailures(
    route,
    missing.map((selector) => `missing required SEO tag "${selector}"`)
  );
};

const verifyBrandAndGeoKeywords = async () => {
  await open("/");
  const group = await evaluate(musicGroupExpression);

  if (!group) {
    recordFailures("/", ["MusicGroup JSON-LD not found on homepage"]);
    return;
  }

  const haystack = [...group.alternateName, ...group.keywords].map((value) =>
    value.toLowerCase()
  );
  const contains = (needle) => haystack.some((value) => value.includes(needle.toLowerCase()));

  const requiredTerms = [
    "filibuster band", // singular brand variant — 47 impressions / ~2% CTR in GSC
    "bands from provo utah",
    "utah bands",
    "live music in provo"
  ];

  recordFailures(
    "/",
    requiredTerms
      .filter((term) => !contains(term))
      .map((term) => `MusicGroup schema missing brand/geo term "${term}"`)
  );
};

const verifyGeoLandingPage = async () => {
  const route = "/provo-alt-rock-band";
  await open(route);
  const body = (await evaluate(bodyTextExpression)).toLowerCase();

  const requiredPhrases = [
    "bands from provo, utah",
    "velour live music gallery",
    "utah arts festival"
  ];

  recordFailures(
    route,
    requiredPhrases
      .filter((phrase) => !body.includes(phrase))
      .map((phrase) => `geo landing page missing phrase "${phrase}"`)
  );
};

const waitForServerReady = async () => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < serverStartupTimeoutMs) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok || response.status === 404) return;
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
    { cwd: repoRoot, detached: true, stdio: ["ignore", "pipe", "pipe"] }
  );

  const recordLogChunk = (chunk) => {
    const text = chunk.toString().trim();
    if (!text) return;
    recentLogs.push(...text.split("\n"));
    if (recentLogs.length > 30) recentLogs.splice(0, recentLogs.length - 30);
  };

  server.stdout.on("data", recordLogChunk);
  server.stderr.on("data", recordLogChunk);

  let cleanedUp = false;
  const cleanup = async () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (server.exitCode !== null || !server.pid) return;
    shutdownRequested = true;

    const waitForExit = () =>
      Promise.race([
        new Promise((resolvePromise) => server.once("exit", resolvePromise)),
        wait(serverShutdownTimeoutMs)
      ]);

    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      return;
    }
    await waitForExit();

    if (server.exitCode === null) {
      try {
        process.kill(-server.pid, "SIGKILL");
      } catch (error) {
        if (!isMissingProcessError(error)) throw error;
      }
      await waitForExit();
    }
  };

  return { cleanup, recentLogs, server, wasShutdownRequested: () => shutdownRequested };
};

const main = async () => {
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

    try {
      const routes = ["/", "/shows", "/provo-alt-rock-band", "/press/ai"];
      for (const route of routes) {
        await verifyRequiredSeoTags(route);
      }
      await verifyBrandAndGeoKeywords();
      await verifyGeoLandingPage();

      console.log(`Checked ${routes.length} routes at ${baseUrl} via agent-browser.`);

      if (checks.length > 0) {
        for (const { route, failure } of checks) {
          console.error(`FAIL ${route}: ${failure}`);
        }
        process.exitCode = 1;
        return;
      }

      console.log("SEO + Provo geo/keyword verification passed.");
    } finally {
      await agentBrowser(["close"]).catch(() => {});
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    if (recentLogs.length > 0) {
      console.error("Recent server logs:");
      for (const line of recentLogs) console.error(line);
    }
    process.exitCode = 1;
  } finally {
    process.removeListener("SIGINT", handleSignal);
    process.removeListener("SIGTERM", handleSignal);
    await cleanup();
  }
};

await main();
