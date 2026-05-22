// POST /api/subscribe
//
// Server-side endpoint that subscribes an email to a Kit (formerly ConvertKit)
// form. Email-only — no interests, no tags. One main audience. See
// docs/superpowers/specs/2026-03-31-next-phase-roadmap.md > "Email List".
//
// Required environment variables (set in Vercel project Settings → Environment
// Variables, also add to a local `.env` file for `astro dev`):
//   KIT_API_KEY   — Kit account API key (Settings → Advanced → API in Kit).
//                   This is a server-only secret; do NOT prefix with PUBLIC_.
//   KIT_FORM_ID   — Numeric ID of the Kit form that backs the signup. Found in
//                   the URL when editing a form in Kit, e.g. /forms/1234567 →
//                   KIT_FORM_ID=1234567.
//
// If either env var is missing the endpoint returns 500 with a clear message
// rather than crashing — this lets the site build and serve even before the
// values are wired up in Vercel.
//
// Request body:  { email: string }     (JSON or form-encoded)
// Responses:
//   200 { ok: true }                   — Kit accepted the subscription
//   400 { ok: false, error: string }   — invalid/missing email
//   500 { ok: false, error: string }   — server misconfig or Kit error

import type { APIRoute } from "astro";

// This route must run on-demand (Vercel serverless), not prerendered.
export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });

export const POST: APIRoute = async ({ request }) => {
  // Parse body — accept both JSON and form-encoded for robustness.
  let email = "";
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { email?: unknown };
      if (typeof body?.email === "string") email = body.email;
    } else {
      const form = await request.formData();
      const value = form.get("email");
      if (typeof value === "string") email = value;
    }
  } catch {
    return json(400, { ok: false, error: "Could not read request body." });
  }

  email = email.trim();
  if (!email || !EMAIL_RE.test(email)) {
    return json(400, { ok: false, error: "Please enter a valid email address." });
  }

  const apiKey = import.meta.env.KIT_API_KEY ?? process.env.KIT_API_KEY;
  const formId = import.meta.env.KIT_FORM_ID ?? process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    return json(500, {
      ok: false,
      error:
        "Signup is temporarily unavailable. (Server is missing KIT_API_KEY or KIT_FORM_ID — set them in Vercel.)"
    });
  }

  // Kit v3 subscribe endpoint — simplest form subscribe, still supported.
  // Reference: https://developers.kit.com/v3#add-subscriber-to-a-form
  const kitUrl = `https://api.kit.com/v3/forms/${encodeURIComponent(
    String(formId)
  )}/subscribe`;

  try {
    const kitRes = await fetch(kitUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, email })
    });

    if (!kitRes.ok) {
      // Kit returns JSON with `message` on error; surface a generic message
      // to the client and log the detail server-side.
      let detail = "";
      try {
        const body = await kitRes.json();
        detail = typeof body?.message === "string" ? body.message : "";
      } catch {
        // ignore
      }
      console.error("[/api/subscribe] Kit error", kitRes.status, detail);
      return json(502, {
        ok: false,
        error: "Signup service returned an error. Please try again shortly."
      });
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("[/api/subscribe] Network error", err);
    return json(500, {
      ok: false,
      error: "Could not reach the signup service. Please try again shortly."
    });
  }
};

// Reject everything else cleanly.
export const GET: APIRoute = () =>
  json(405, { ok: false, error: "Method not allowed." });
