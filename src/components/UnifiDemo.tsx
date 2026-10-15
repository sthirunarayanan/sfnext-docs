import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

const SDK_URL = 'https://spdpone.syfpos.com/mpp/UniFi.js';

const SAMPLE_PAYLOAD = {
    processInd: '3',
    transactionToken: '<paste a live Digital POS transactionToken>',
    tokenId: '<paste a live Digital POS transactionToken>',
    syfPartnerId: 'PI20001210',
    storeMid: '5348121090000702',
    clientTransId: 'd6b4851400a9ca64bb6fbe2b8a',
    custAddress1: '950 Forrer Blvd',
    custAddress2: '',
    custCity: 'Dayton',
    custState: 'OH',
    custZipCode: '45420',
    transAmount1: '643.90',
    offerNumber1: '191',
    promoOverRideFlag: 'Y',
    custFirstName: 'ASHLEYCORP',
    custLastName: 'TESTCASE',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    iniPurAmt: '643.90',
    phoneNumber: '466-456-4645',
    emailAddress: 'SThirunarayanan@Ashleyfurniture.com',
};

type ScriptState = 'loading' | 'ready' | 'error';

function LogBlock({ title, lines }: { title: string; lines: string[] }) {
    return (
        <>
            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#f0802a]">{title}</h4>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-[#2a211a] bg-[#14110d] p-4 text-xs text-[#d6cfc3]">
                {lines.join('\n') || '—'}
            </pre>
        </>
    );
}

const SAMPLE_DPOS_REQUEST_BODY = {
    accessToken: 'AQUkW52Wi3sXByTlWbUSkoOHySjJ',
};

const SAMPLE_LOOKUP_TRANSACTION_REQUEST_BODY = {
    accessToken: 'AQUkW52Wi3sXByTlWbUSkoOHySjJ',
    transactionToken: 'PI20001210568391a1406389fe',
};

/**
 * Loads the real Synchrony UniFi.js SDK (non-prod/UAT) and opens the Combined Modal via
 * calldBuyProcess with an editable request JSON payload. postMessage events from the modal
 * (e.g. "Unifi Modal Close") are logged to the shared log below as-is.
 */
export function UnifiDemo() {
    const [scriptState, setScriptState] = useState<ScriptState>('loading');
    const [payloadText, setPayloadText] = useState(() => JSON.stringify(SAMPLE_PAYLOAD, null, 2));
    const loggedRef = useRef(false);

    const [accessToken, setAccessToken] = useState('');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [scapiTokenLog, setScapiTokenLog] = useState<string[]>([]);
    const [fetchingScapiToken, setFetchingScapiToken] = useState(false);
    const [dposRequestBodyText, setDposRequestBodyText] = useState(() =>
        JSON.stringify(SAMPLE_DPOS_REQUEST_BODY, null, 2)
    );
    const [lookupTransactionRequestBodyText, setLookupTransactionRequestBodyText] = useState(() =>
        JSON.stringify(SAMPLE_LOOKUP_TRANSACTION_REQUEST_BODY, null, 2)
    );

    const [combinedModalLog, setCombinedModalLog] = useState<string[]>([]);
    const [unifiTokenLog, setUnifiTokenLog] = useState<string[]>([]);
    const [dposTokenLog, setDposTokenLog] = useState<string[]>([]);
    const [lookupTransactionLog, setLookupTransactionLog] = useState<string[]>([]);

    function appendTo(setter: Dispatch<SetStateAction<string[]>>, line: string) {
        setter((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${line}`]);
    }

    async function fetchScapiAccessToken() {
        if (!clientId.trim() || !clientSecret.trim()) {
            appendTo(setScapiTokenLog, 'Client ID and Client Secret are both required.');
            return;
        }
        setFetchingScapiToken(true);
        appendTo(setScapiTokenLog, 'POST /api/scapi-token (proxied to SCAPI SLAS oauth2/token)');
        try {
            const res = await fetch('/api/scapi-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: clientId.trim(),
                    clientSecret: clientSecret.trim(),
                }),
            });
            const text = await res.text();
            appendTo(setScapiTokenLog, `Response ${res.status}: ${text}`);
            if (res.ok) {
                try {
                    const json = JSON.parse(text) as { access_token?: string };
                    if (json.access_token) {
                        setAccessToken(json.access_token);
                        appendTo(setScapiTokenLog, 'Access Token field above has been filled in automatically.');
                    }
                } catch {
                    // Response wasn't JSON (or had no access_token) — nothing to auto-fill.
                }
            }
        } catch (err) {
            appendTo(setScapiTokenLog, `Request failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setFetchingScapiToken(false);
        }
    }

    async function fetchUnifiToken() {
        if (!accessToken.trim()) {
            appendTo(setUnifiTokenLog, 'Enter an access token first.');
            return;
        }
        appendTo(setUnifiTokenLog, 'POST /api/unifi-token (proxied to Commerce Cloud)');
        try {
            const res = await fetch('/api/unifi-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken.trim()}`,
                },
            });
            const text = await res.text();
            appendTo(setUnifiTokenLog, `Response ${res.status}: ${text}`);
        } catch (err) {
            appendTo(setUnifiTokenLog, `Request failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    async function fetchDposToken() {
        if (!accessToken.trim()) {
            appendTo(setDposTokenLog, 'Enter an access token first.');
            return;
        }
        let body: unknown;
        try {
            body = JSON.parse(dposRequestBodyText);
        } catch (err) {
            appendTo(setDposTokenLog, `Invalid request body JSON: ${err instanceof Error ? err.message : String(err)}`);
            return;
        }
        appendTo(
            setDposTokenLog,
            `POST /api/unifi-dpos-token (proxied to Commerce Cloud) with body: ${JSON.stringify(body)}`
        );
        try {
            const res = await fetch('/api/unifi-dpos-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken.trim()}`,
                },
                body: JSON.stringify(body),
            });
            const text = await res.text();
            appendTo(setDposTokenLog, `Response ${res.status}: ${text}`);
        } catch (err) {
            appendTo(setDposTokenLog, `Request failed: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    async function fetchLookupTransaction() {
        if (!accessToken.trim()) {
            appendTo(setLookupTransactionLog, 'Enter an access token first.');
            return;
        }
        let body: unknown;
        try {
            body = JSON.parse(lookupTransactionRequestBodyText);
        } catch (err) {
            appendTo(
                setLookupTransactionLog,
                `Invalid request body JSON: ${err instanceof Error ? err.message : String(err)}`
            );
            return;
        }
        appendTo(
            setLookupTransactionLog,
            `POST /api/unifi-lookup-transaction (proxied to Commerce Cloud) with body: ${JSON.stringify(body)}`
        );
        try {
            const res = await fetch('/api/unifi-lookup-transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken.trim()}`,
                },
                body: JSON.stringify(body),
            });
            const text = await res.text();
            appendTo(setLookupTransactionLog, `Response ${res.status}: ${text}`);
        } catch (err) {
            appendTo(
                setLookupTransactionLog,
                `Request failed: ${err instanceof Error ? err.message : String(err)}`
            );
        }
    }

    useEffect(() => {
        if (window.syfMPP) {
            setScriptState('ready');
            return;
        }
        const script = document.createElement('script');
        script.id = 'syfMPPScript';
        script.src = SDK_URL;
        script.async = true;
        script.setAttribute('widget', 'disabled');
        script.onload = () => {
            setScriptState('ready');
            if (!loggedRef.current) {
                appendTo(setCombinedModalLog, `UniFi SDK loaded from ${SDK_URL}`);
                loggedRef.current = true;
            }
        };
        script.onerror = () => {
            setScriptState('error');
            appendTo(setCombinedModalLog, 'Failed to load the UniFi SDK script.');
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            appendTo(setCombinedModalLog, `postMessage received: ${JSON.stringify(event.data)} (origin: ${event.origin})`);
        };
        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    function openCombinedModal() {
        if (!window.syfMPP) {
            appendTo(setCombinedModalLog, 'UniFi SDK is not ready yet.');
            return;
        }
        let payload: Record<string, unknown>;
        try {
            payload = JSON.parse(payloadText);
        } catch (err) {
            appendTo(setCombinedModalLog, `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
            return;
        }
        appendTo(setCombinedModalLog, `Calling calldBuyProcess with payload: ${JSON.stringify(payload)}`);
        window.syfMPP.calldBuyProcess(null, payload);
    }

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                Server-to-Server Token Calls
            </h3>
            <p className="mb-4 mt-2 text-xs text-[#a89f90]">
                Calls Ashley's custom SCAPI endpoints via a local dev-only proxy (see{' '}
                <code>unifi-proxy</code> in <code>vite.config.ts</code>) so the browser never has to deal
                with CORS or a hardcoded auth strategy. Only works under <code>pnpm dev</code> — there is
                no backend in the static GitHub Pages build.
            </p>

            <h4 className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#f0802a]">
                Get a SCAPI Access Token
            </h4>
            <p className="mb-2 mt-1 text-xs text-[#a89f90]">
                Calls the SLAS <code>shopper/auth</code> client_credentials grant (Basic auth with
                Client ID/Secret) via a local proxy (<code>/api/scapi-token</code>) against{' '}
                <code>6u3h1blt.api.commercecloud.salesforce.com</code>, org <code>f_ecom_bbvd_030</code>,
                and fills in the Access Token field below on success.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-[#f5f1e8]" htmlFor="scapi-client-id">
                        Client ID
                    </label>
                    <input
                        id="scapi-client-id"
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="PUBLIC__app__commerce__api__clientId"
                        spellCheck={false}
                        className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-2 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-[#f5f1e8]" htmlFor="scapi-client-secret">
                        Client Secret
                    </label>
                    <input
                        id="scapi-client-secret"
                        type="password"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        placeholder="Client Secret"
                        spellCheck={false}
                        className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-2 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
                    />
                </div>
            </div>
            <button
                type="button"
                onClick={fetchScapiAccessToken}
                disabled={fetchingScapiToken}
                className="mt-3 rounded-md border border-[#f0802a] bg-[#f0802a] px-4 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#f0802a]/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {fetchingScapiToken ? 'Requesting…' : 'POST /api/scapi-token'}
            </button>
            <LogBlock title="SCAPI Token Log" lines={scapiTokenLog} />

            <label className="mb-2 mt-6 block text-sm font-semibold text-[#f5f1e8]" htmlFor="unifi-access-token">
                Access Token (Bearer)
            </label>
            <input
                id="unifi-access-token"
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste a SCAPI access token"
                spellCheck={false}
                className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-3 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
            />

            <button
                type="button"
                onClick={fetchUnifiToken}
                className="mt-4 rounded-md border border-[#f0802a] bg-[#f0802a] px-4 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#f0802a]/90"
            >
                POST /unifi-token
            </button>
            <LogBlock title="Unifi Token Log" lines={unifiTokenLog} />

            <label
                className="mb-2 mt-6 block text-sm font-semibold text-[#f5f1e8]"
                htmlFor="unifi-dpos-request-body"
            >
                /unifi-dpos-token request body
            </label>
            <textarea
                id="unifi-dpos-request-body"
                value={dposRequestBodyText}
                onChange={(e) => setDposRequestBodyText(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-4 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
            />

            <button
                type="button"
                onClick={fetchDposToken}
                className="mt-4 rounded-md border border-[#f0802a] bg-[#f0802a] px-4 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#f0802a]/90"
            >
                POST /unifi-dpos-token
            </button>
            <LogBlock title="DPOS Token Log" lines={dposTokenLog} />

            <label
                className="mb-2 mt-6 block text-sm font-semibold text-[#f5f1e8]"
                htmlFor="unifi-lookup-transaction-request-body"
            >
                /unifi-lookup-transaction request body
            </label>
            <textarea
                id="unifi-lookup-transaction-request-body"
                value={lookupTransactionRequestBodyText}
                onChange={(e) => setLookupTransactionRequestBodyText(e.target.value)}
                rows={6}
                spellCheck={false}
                className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-4 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
            />

            <button
                type="button"
                onClick={fetchLookupTransaction}
                className="mt-4 rounded-md border border-[#f0802a] bg-[#f0802a] px-4 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#f0802a]/90"
            >
                POST /unifi-lookup-transaction
            </button>
            <LogBlock title="Lookup Transaction Log" lines={lookupTransactionLog} />

            <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">Combined Modal</h3>
            <p className="mb-4 mt-2 text-xs font-semibold uppercase tracking-wide text-[#a89f90]">
                SDK status: <span className="text-[#f0802a]">{scriptState}</span>
            </p>

            <label className="mb-2 block text-sm font-semibold text-[#f5f1e8]" htmlFor="unifi-payload">
                calldBuyProcess request JSON
            </label>
            <textarea
                id="unifi-payload"
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                rows={16}
                spellCheck={false}
                className="w-full rounded-lg border border-[#2a211a] bg-[#14110d] p-4 font-mono text-xs text-[#f5f1e8] focus:border-[#f0802a] focus:outline-none"
            />

            <button
                type="button"
                onClick={openCombinedModal}
                disabled={scriptState !== 'ready'}
                className="mt-4 rounded-md border border-[#f0802a] bg-[#f0802a] px-4 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#f0802a]/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Open Combined Modal (calldBuyProcess)
            </button>
            <LogBlock title="Combined Modal Log" lines={combinedModalLog} />
        </div>
    );
}

