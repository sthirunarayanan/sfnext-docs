/**
 * Unifi Combined Modal implementation walkthrough, based on
 * ashley-sfcc-storefront/src/components/unifi-modal/index.tsx and
 * src/lib/payment/synchrony-unifi-transact.server.ts.
 *
 * Test data below is for local/sandbox testing only (Synchrony UAT test card).
 */

export interface UnifiTestField {
    field: string;
    value: string;
}

export const unifiCombinedModalIntro =
    'Walkthrough of how the Synchrony Unifi Combined Modal SDK is wired into checkout in ' +
    'ashley-sfcc-storefront — from shopper-info collection through calldBuyProcess, transaction ' +
    'lookup polling, and the deferred server-side Transact call after order creation.';

export const unifiTestPersonalInfo: UnifiTestField[] = [
    { field: 'First Name', value: 'Testcase' },
    { field: 'Last Name', value: 'Ashleycorp' },
];

export const unifiTestAddress: UnifiTestField[] = [
    { field: 'Address 1', value: '950 Forrer Blvd' },
    { field: 'Address 2', value: 'null' },
    { field: 'City', value: 'Dayton' },
    { field: 'State', value: 'OH' },
    { field: 'Postal Code', value: '45420' },
];

export const unifiTestCard: UnifiTestField[] = [
    { field: 'Card Number', value: '6019193623801353' },
    { field: 'CVV', value: '781' },
];

// WERT (analytics) integration. The UnifiModal component itself
// (src/components/unifi-modal/index.tsx) does NOT dispatch any WERT events —
// onApproved/onDeclined/onError are plain callbacks. WERT events must be fired by the
// call site (e.g. payment.tsx) when those callbacks resolve, tagged with the Optimizely
// experiment bucket from src/lib/unifi/feature-flag.ts so dashboards can segment
// variation vs. control vs. not-in-test conversion.
export const unifiWertIntro =
    'The Combined Modal has no built-in analytics — WERT events must be fired explicitly where ' +
    'onApproved/onDeclined/onError are handled, and tagged with the Optimizely enable_unifi_sfn_checkout ' +
    'experiment bucket so the Gather dashboard can segment conversion by variation vs. control vs. ' +
    'not-in-test shoppers.';

export const unifiWertChart = `flowchart TD
    A["Checkout loads<br/>featureDecisions from root loader"] --> B{"isUnifiFeatureEnabledFromDecisions()<br/>enable_unifi_sfn_checkout"}
    B -->|"false (control / not in test)"| C["Unifi trigger hidden<br/>no WERT events fired"]
    B -->|"true (variation)"| D["Show Unifi financing entry point"]

    D --> E["getUnifiExperimentBucket()<br/>'variation' | 'control' | null"]
    E --> F["Shopper opens UnifiModal<br/>calldBuyProcess()"]

    F --> G{"Modal result"}
    G -->|"onApproved(result)"| H["emitWertBillingInfoSubmitted<br/>paymentMethodType='financing'<br/>experimentBucket tagged"]
    G -->|"onDeclined()"| I["emitWertCheckoutError<br/>errorType='financing_declined'<br/>experimentBucket tagged"]
    G -->|"onError(message)"| J["emitWertPaymentFailure<br/>errorCode='UNIFI_MODAL_ERROR'<br/>experimentBucket tagged"]

    H --> K["Gather dashboard<br/>segments conversion by<br/>variation vs control vs not-in-test"]
    I --> K
    J --> K

    style B fill:#ffe0b2,stroke:#e65100,color:#111
    style E fill:#ffe0b2,stroke:#e65100,color:#111
    style H fill:#c8f7c5,stroke:#2e7d32,color:#111
    style I fill:#f7c5c5,stroke:#b71c1c,color:#111
    style J fill:#f7c5c5,stroke:#b71c1c,color:#111
    style K fill:#bbdefb,stroke:#1565c0,color:#111`;

export const unifiCombinedModalChart = `flowchart TD
    A["Checkout Page<br/>Shopper selects Unifi/Synchrony financing"] --> B["UnifiModal mounts<br/>src/components/unifi-modal/index.tsx"]

    B --> C["Mint session tokens<br/>POST /action/unifi-token (OAuth)<br/>POST /action/unifi-dpos-token (Digital POS token)"]
    C --> C1["Tokens valid 30 min<br/>auto-refreshed every 29 min"]

    C1 --> D["Shopper opens modal<br/>open(termCode?) called"]
    D --> E["Build buyProcessPayload<br/>custFirstName/custLastName<br/>custAddress1/custAddress2<br/>custCity/custState/custZipCode<br/>transAmount1, offerNumber1"]
    E --> F["window.syfMPP.calldBuyProcess(null, payload)"]

    F --> G["Synchrony-hosted modal UI<br/>shopper enters/reviews personal, address & card info"]
    G --> H{"Modal closed?"}
    H -->|"postMessage 'Unifi Modal Close'"| I["Begin transaction lookup"]
    H -->|"no response after 60s"| TIMEOUT["Stuck modal safety timeout"]
    TIMEOUT --> I

    I --> J["Poll POST /action/unifi-lookup-transaction<br/>every 2s, up to 30s"]
    J --> K{"transactionCode?"}
    K -->|"'033'"| APPROVED["onApproved(result)<br/>session tokens cached for later Transact"]
    K -->|"anything else"| DECLINED["onDeclined()"]

    APPROVED --> L["Shopper completes rest of checkout<br/>Place Order"]
    L --> M["Order created (SCAPI createOrder)"]
    M --> N["Kount fraud evaluation"]
    N --> O{"Kount verdict allows payment?"}
    O -->|"yes"| P["runUnifiTransact()<br/>src/lib/payment/synchrony-unifi-transact.server.ts"]
    O -->|"DECLINED"| Q["Order FAILED<br/>Transact never runs"]

    P --> R["POST .../custom/ashley-synchrony/v1/organizations/{orgId}/unifi-transact<br/>orderNo, accessToken, transactionToken, amount, addressInfo"]
    R --> S{"outcome"}
    S -->|"approved"| T["Order confirmed with Unifi financing"]
    S -->|"declined / unavailable"| U["Fallback / order flagged for manual follow-up"]

    style F fill:#ffe0b2,stroke:#e65100,color:#111
    style G fill:#ffe0b2,stroke:#e65100,color:#111
    style APPROVED fill:#c8f7c5,stroke:#2e7d32,color:#111
    style DECLINED fill:#f7c5c5,stroke:#b71c1c,color:#111
    style P fill:#bbdefb,stroke:#1565c0,color:#111
    style T fill:#c8f7c5,stroke:#2e7d32,color:#111
    style U fill:#f7c5c5,stroke:#b71c1c,color:#111`;

