// Synchrony UniFi.js global, loaded dynamically by UnifiDemo from the non-prod SDK URL.
// Mirrors the declaration in ashley-sfcc-storefront's src/components/unifi-modal/index.tsx.
export {};

declare global {
    interface Window {
        syfMPP?: {
            calldBuyProcess: (form: HTMLFormElement | null, json: Record<string, unknown> | null) => void;
        };
    }
}

