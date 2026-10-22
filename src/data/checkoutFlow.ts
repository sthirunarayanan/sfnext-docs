/**
 * Cart → Checkout → Order Placement flow: Kount fraud screening, Payment
 * Gateway authorization, and RTN shopper notifications — plus the
 * root-cause diagram for orders recorded in Kount but missing from SFCC
 * Business Manager.
 *
 * Source: Ashcomm-Clones/docs/sfnext-cart-checkout-kount-payment-rtn-flow.md
 */

export const checkoutFlowIntro =
    'How the Storefront Next cart/checkout/order-placement pipeline sequences Kount fraud screening, ' +
    'Payment Gateway authorization (Elavon / PayPal / Acima), and RTN shopper notifications — and the ' +
    'known root cause for orders that appear in Kount but are missing from SFCC Business Manager.';

export const checkoutFlowKey = [
    { label: '🟡 Kount', description: 'Fraud screening — device fingerprinting + order risk evaluation.' },
    { label: '🟢 Payment Gateway', description: 'Elavon / PayPal / Acima authorization.' },
    { label: '🔵 RTN', description: 'Real-Time Notification — shopper confirmation / decline emails.' },
];

export const checkoutFlowRule =
    'Payment Gateway authorization runs for every Kount verdict EXCEPT `DECLINED`. `HOLD` (manual review), ' +
    '`APPROVED`, `SKIPPED`, and `RETRY`/service-error all proceed to payment authorization — only `DECLINED` ' +
    'short-circuits the order to `FAILED` before auth runs.';

export const checkoutFlowChart = `flowchart TD
    A["Cart Page<br/>src/routes/_app.cart.tsx"] --> B["Checkout Page<br/>src/routes/_checkout.checkout.tsx"]

    B --> B1["Checkout loads<br/>KountDataCollector mounts"]
    B1 -->|"POST /action/kount-session"| KD["KOUNT: Device Fingerprinting (DDC)<br/>Session + sessionId to basket.custom.kountSessionId"]

    B --> B2["Submit Contact Info / Shipping / Payment"]
    B2 --> C["Click Place Order<br/>src/routes/action.place-order.ts"]
    C --> C1["Recalc & validate basket"]
    C1 --> C2["SCAPI createOrder<br/>POST /orders"]
    C2 --> H1["beforePOST hooks<br/>ATP, AvaTax, OHDS, delivery method"]
    H1 --> ORD["Order created<br/>status = CREATED"]

    ORD --> ORCH["afterPOST: OrderPlacementOrchestrator<br/>runAfterCreateOrder()"]
    ORCH --> S1["Step 1/1b/1c: OHDS persistence,<br/>APG enrichment, early ATP stamp"]

    S1 --> KOUNT["STEP 2 - KOUNT FRAUD EVALUATION<br/>KountRiskService.evaluateOrder()"]

    KOUNT --> VERDICT{"Kount verdict?"}

    VERDICT -->|"DECLINED"| KDEC["RTN: Declination notification<br/>handleOrderDeclined(order,'Kount')"]
    KDEC --> FAIL["Order CREATED to FAILED<br/>Reopen basket, cleanup queue<br/>SHORT-CIRCUIT: Payment Gateway NOT called"]
    FAIL --> RESP

    VERDICT -->|"HOLD (manual review)"| PAY
    VERDICT -->|"APPROVED"| PAY
    VERDICT -->|"SKIPPED / RETRY / service error"| PAY

    PAY["STEP 3 - PAYMENT GATEWAY AUTHORIZATION<br/>PaymentAuthorizationHelper.authorizeOrder()"]

    PAY --> PAY1["Elavon LightBox CC<br/>prepareDeferredAuth()"]
    PAY --> PAY2["PayPal<br/>PayPalAuthorizationHelper.authorize()"]
    PAY --> PAY3["Acima<br/>AcimaOrderAuthorizationHandler.authorize()"]

    PAY1 --> ERR{"Auth ERROR?"}
    PAY2 --> ERR
    PAY3 --> ERR
    ERR -->|"yes"| FAIL2["Order CREATED to FAILED<br/>Reopen basket"]
    FAIL2 --> RESP

    ERR -->|"no"| PLACE["Step 4 - Placement<br/>status CREATED to NEW<br/>HOLD keeps exportStatus NOT_EXPORTED"]

    PLACE --> RTN["STEP 4b - RTN NOTIFICATION<br/>handleOrderPlaced()<br/>HOLD gives PRECONFIRMATION, else CONFIRMATION"]

    RTN --> S57["Steps 5-7: AvaTax commit,<br/>order-export attribution"]
    S57 --> RESP["modifyPOSTResponse hooks<br/>Kount: stamp fault on DECLINED<br/>RTN: strip PII audit fields"]

    RESP --> DEF{"Deferred payment method?"}
    DEF -->|"Elavon LightBox CC"| D1["authorize-segment then finalize<br/>Place order + dispatch RTN"]
    DEF -->|"Synchrony"| D2["ashley-synchrony authorize<br/>Place order + dispatch RTN"]
    DEF -->|"no"| CONF
    D1 --> CONF
    D2 --> CONF

    CONF["Destroy basket cookie<br/>Redirect to order-confirmation"] --> PAGE["Order Confirmation Page"]

    style KD fill:#fff3b0,stroke:#b8860b,color:#111
    style KOUNT fill:#fff3b0,stroke:#b8860b,color:#111
    style KDEC fill:#fff3b0,stroke:#b8860b,color:#111
    style VERDICT fill:#ffe0b2,stroke:#e65100,color:#111
    style PAY fill:#c8f7c5,stroke:#2e7d32,color:#111
    style PAY1 fill:#c8f7c5,stroke:#2e7d32,color:#111
    style PAY2 fill:#c8f7c5,stroke:#2e7d32,color:#111
    style PAY3 fill:#c8f7c5,stroke:#2e7d32,color:#111
    style RTN fill:#bbdefb,stroke:#1565c0,color:#111
    style D1 fill:#bbdefb,stroke:#1565c0,color:#111
    style D2 fill:#bbdefb,stroke:#1565c0,color:#111`;

