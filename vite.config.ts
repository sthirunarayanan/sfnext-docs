import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const UNIFI_API_BASE =
    'https://6u3h1blt.api.commercecloud.salesforce.com/custom/ashley-synchrony/v1/organizations/f_ecom_bbvd_030';

const SCAPI_TOKEN_URL =
    'https://6u3h1blt.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_bbvd_030/oauth2/token';

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
     * obtain the Bearer access token the other Unifi proxy routes require. Forwards the
     * client_id/client_secret the demo UI posts as JSON and converts it into the client_credentials
     * grant SLAS expects, authenticated with HTTP Basic (client_id:client_secret) as required for
     * private (confidential) SLAS clients.
     */
    async function proxyScapiToken(req: IncomingMessage, res: ServerResponse) {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = Buffer.concat(chunks);

        try {
            const { clientId, clientSecret } = JSON.parse(body.toString('utf8') || '{}');
            if (!clientId || !clientSecret) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'clientId and clientSecret are required.' }));
                return;
            }

            const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
            const form = new URLSearchParams({ grant_type: 'client_credentials' });

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

