const { onRequest } = require('firebase-functions/v2/https');

// Production backend for the Ashley Synchrony Unifi demo (src/components/UnifiDemo.tsx).
// Mirrors the dev-only Vite middleware in vite.config.ts, but runs as real Cloud Functions behind
// Firebase Hosting rewrites (see firebase.json), so these also work on the deployed site, not just
// `pnpm dev`. Runs server-side only — never bundled into client JS — so the SLAS private-client
// secret stays safe here the same way it does in vite.config.ts.
const UNIFI_API_BASE =
    'https://6u3h1blt.api.commercecloud.salesforce.com/custom/ashley-synchrony/v1/organizations/f_ecom_bbvd_030';

const SCAPI_TOKEN_URL =
    'https://6u3h1blt.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_bbvd_030/oauth2/token';

const SCAPI_CLIENT_ID = 'a967db67-2c26-41b3-bdd9-04e0368ec08c';
const SCAPI_CLIENT_SECRET = 'we9nK10zyCP7fWDleUlVivlRsV3z2WJrCZYWupBQF9I';

/** Forwards req to a custom Ashley Synchrony Unifi endpoint, passing through the Authorization header. */
async function proxyToUnifi(req, res, path) {
    try {
        const hasBody = !['GET', 'HEAD'].includes(req.method);
        const upstream = await fetch(`${UNIFI_API_BASE}${path}?siteId=Ashley-US`, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
            },
            body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
        });
        const text = await upstream.text();
        res.status(upstream.status)
            .set('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
            .send(text);
    } catch (err) {
        res.status(502).json({ error: err instanceof Error ? err.message : String(err) });
    }
}

/** SLAS private-client client_credentials token exchange — see /api/scapi-token in UnifiDemo.tsx. */
exports.scapiToken = onRequest(async (req, res) => {
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
        res.status(upstream.status)
            .set('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
            .send(text);
    } catch (err) {
        res.status(502).json({ error: err instanceof Error ? err.message : String(err) });
    }
});

exports.unifiToken = onRequest((req, res) => proxyToUnifi(req, res, '/unifi-token'));
exports.unifiDposToken = onRequest((req, res) => proxyToUnifi(req, res, '/unifi-dpos-token'));
exports.unifiLookupTransaction = onRequest((req, res) => proxyToUnifi(req, res, '/unifi-lookup-transaction'));
exports.unifiTransact = onRequest((req, res) => proxyToUnifi(req, res, '/unifi-transact'));

