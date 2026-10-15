import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const UNIFI_API_BASE =
    'https://6u3h1blt.api.commercecloud.salesforce.com/custom/ashley-synchrony/v1/organizations/f_ecom_bbvd_030';

const SCAPI_TOKEN_URL =
    'https://6u3h1blt.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_bbvd_030/oauth2/token';

// Fixed SLAS private-client credentials for the SCAPI token demo. Deliberately kept only in this
// Node-only Vite config (never bundled into client JS, unlike anything in src/) so the secret is
// never shipped to the browser — see proxyScapiToken below.
const SCAPI_CLIENT_ID = 'a967db67-2c26-41b3-bdd9-04e0368ec08c';
const SCAPI_CLIENT_SECRET = 'we9nK10zyCP7fWDleUlVivlRsV3z2WJrCZYWupBQF9I';

/**
 * Dev-only server-to-server proxy for the Ashley Synchrony Unifi custom SCAPI endpoints.
 * The browser can't call these directly (CORS + we don't want to assume any particular
 * bearer-token storage strategy), so the UnifiDemo UI posts to these local /api routes and
 * this plugin forwards the request to Commerce Cloud from the Vite dev server, passing through
 * whatever Authorization header the demo UI sent. Only active under `pnpm dev` — there is no
 * equivalent in the static GitHub Pages production build.
 */
function unifiProxyPlugin(): Plugin {
    async function proxy(req: IncomingMessage, res: ServerResponse, url: string) {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = Buffer.concat(chunks);

        try {
            const upstream = await fetch(url, {
                method: req.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
                },
                body: body.length > 0 ? body : undefined,
            });
            const text = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json');
            res.end(text);
        } catch (err) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        }
    }

    /**
     * Dev-only proxy for the SCAPI SLAS private-client token endpoint (shopper/auth), used to
     * obtain the Bearer access token the other Unifi proxy routes require. Always authenticates
     * with the fixed SCAPI_CLIENT_ID/SCAPI_CLIENT_SECRET above via HTTP Basic, as required for
     * private (confidential) SLAS clients — the demo UI does not (and cannot) supply these.
     */
    async function proxyScapiToken(req: IncomingMessage, res: ServerResponse) {
        // Drain any request body (none expected) so the connection doesn't hang.
        for await (const _chunk of req) {
            // no-op
        }

        try {
            const basicAuth = Buffer.from(`${SCAPI_CLIENT_ID}:${SCAPI_CLIENT_SECRET}`).toString('base64');
            const form = new URLSearchParams({ grant_type: 'client_credentials', channel_id: 'Ashley-US' });

            const upstream = await fetch(SCAPI_TOKEN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${basicAuth}`,
                },
                body: form.toString(),
            });
            const text = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json');
            res.end(text);
        } catch (err) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        }
    }

    return {
        name: 'unifi-proxy',
        configureServer(server) {
            server.middlewares.use('/api/unifi-token', (req, res) => {
                void proxy(req, res, `${UNIFI_API_BASE}/unifi-token?siteId=Ashley-US`);
            });
            server.middlewares.use('/api/unifi-dpos-token', (req, res) => {
                void proxy(req, res, `${UNIFI_API_BASE}/unifi-dpos-token?siteId=Ashley-US`);
            });
            server.middlewares.use('/api/unifi-lookup-transaction', (req, res) => {
                void proxy(req, res, `${UNIFI_API_BASE}/unifi-lookup-transaction?siteId=Ashley-US`);
            });
            server.middlewares.use('/api/unifi-transact', (req, res) => {
                void proxy(req, res, `${UNIFI_API_BASE}/unifi-transact?siteId=Ashley-US`);
            });
            server.middlewares.use('/api/scapi-token', (req, res) => {
                void proxyScapiToken(req, res);
            });
        },
    };
}

/** @see {@link https://vite.dev/config/} */
export default defineConfig({
    base: '/sfnext-docs/',
    plugins: [react(), tailwindcss(), unifiProxyPlugin()],
    server: {
        port: 5174,
    },
});

