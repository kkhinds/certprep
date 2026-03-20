/**
 * CERT PREP — Cloudflare Worker API Proxy
 * ----------------------------------------
 * This Worker sits between your quiz page and the Anthropic API.
 * The API key is stored ONLY in Cloudflare's environment variables —
 * it never touches your HTML, JS, or GitHub repo.
 *
 * How it works:
 *   Browser → POST /  → This Worker → Anthropic API → response back to browser
 *
 * To deploy: copy this entire file into the Cloudflare Worker editor (see guide).
 */

export default {
  async fetch(request, env) {

    /**
     * CORS — Cross-Origin Resource Sharing
     * -------------------------------------
     * Your quiz page (on GitHub Pages) and this Worker are on different domains.
     * Browsers block cross-domain requests by default as a security measure.
     * CORS headers tell the browser "this API allows requests from other origins".
     *
     * Before a POST request, browsers send a "preflight" OPTIONS request to check
     * if the server will allow it. We handle that here first.
     */
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    /* Only allow POST requests — reject anything else */
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    /* -------------------------------------------------------
       Parse the request body sent from your quiz page.
       Expected shape:
       {
         "exam":   "core1",           // which exam (for context)
         "topic":  "RAM types",       // topic to generate a question on
         "prompt": "Generate a ..."   // the full prompt string
       }
    ------------------------------------------------------- */
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: 'Missing "prompt" field in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    /* -------------------------------------------------------
       Forward the request to the Anthropic API.
       env.ANTHROPIC_API_KEY is read from Cloudflare's secret
       store — it is NEVER written into this code file.
    ------------------------------------------------------- */
    let anthropicResponse;
    try {
      anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,   /* Secret — lives only in Cloudflare */
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',   /* Fast and cheap — good for quiz questions */
          max_tokens: 1024,
          messages: [
            { role: 'user', content: body.prompt }
          ],
        }),
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Failed to reach Anthropic API', detail: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    /* Parse and return the Anthropic response to the browser */
    const data = await anthropicResponse.json();

    return new Response(JSON.stringify(data), {
      status: anthropicResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',   /* Allow your GitHub Pages site to read this response */
      },
    });
  },
};
