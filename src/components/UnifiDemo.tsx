import { useEffect, useRef, useState } from 'react';

const SDK_URL = 'https://spdpone.syfpos.com/mpp/UniFi.js';

const SAMPLE_PAYLOAD = {
    processInd: '3',
    transactionToken: '<paste a live Digital POS transactionToken>',
    tokenId: '<paste a live Digital POS transactionToken>',
    syfPartnerId: 'PI20001210',
    clientTransId: `DEMO${Date.now().toString(36)}`,
    custAddress1: '123 Main St',
    custAddress2: '',
    custCity: 'Arcadia',
    custState: 'WI',
    custZipCode: '54612',
    transAmount1: '500.00',
    offerNumber1: '0112',
    promoOverRideFlag: 'Y',
    custFirstName: 'Test',
    custLastName: 'Shopper',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    iniPurAmt: '500.00',
    phoneNumber: '',
    emailAddress: '',
};

type ScriptState = 'loading' | 'ready' | 'error';

/**
 * Loads the real Synchrony UniFi.js SDK (non-prod/UAT) and opens the Combined Modal via
 * calldBuyProcess with an editable request JSON payload. postMessage events from the modal
 * (e.g. "Unifi Modal Close") are logged to the shared log below as-is.
 */
export function UnifiDemo() {
    const [scriptState, setScriptState] = useState<ScriptState>('loading');
    const [payloadText, setPayloadText] = useState(() => JSON.stringify(SAMPLE_PAYLOAD, null, 2));
    const [log, setLog] = useState<string[]>([]);
    const loggedRef = useRef(false);

    function appendLog(line: string) {
        setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${line}`]);
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
                appendLog(`UniFi SDK loaded from ${SDK_URL}`);
                loggedRef.current = true;
            }
        };
        script.onerror = () => {
            setScriptState('error');
            appendLog('Failed to load the UniFi SDK script.');
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const listener = (event: MessageEvent) => {
            appendLog(`postMessage received: ${JSON.stringify(event.data)} (origin: ${event.origin})`);
        };
        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    function openCombinedModal() {
        if (!window.syfMPP) {
            appendLog('UniFi SDK is not ready yet.');
            return;
        }
        let payload: Record<string, unknown>;
        try {
            payload = JSON.parse(payloadText);
        } catch (err) {
            appendLog(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
            return;
        }
        appendLog(`[Combined Modal] Calling calldBuyProcess with payload: ${JSON.stringify(payload)}`);
        window.syfMPP.calldBuyProcess(null, payload);
    }

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">Combined Modal</h3>
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

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">Log</h3>
            <pre className="mt-2 max-h-60 overflow-auto rounded-lg border border-[#2a211a] bg-[#14110d] p-4 text-xs text-[#d6cfc3]">
                {log.join('\n') || '—'}
            </pre>
        </div>
    );
}

