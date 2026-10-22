/**
 * Root cause: orders recorded in Kount but missing from SFCC Business Manager.
 * Source: Ashcomm-Clones/docs/sfnext-cart-checkout-kount-payment-rtn-flow.md
 */

export const rootCauseSummary =
    'Symptom: Kount shows the order (fraud evaluation ran, external API call succeeded), but the order ' +
    'does not exist in SFCC Business Manager at all - not even as a FAILED order.';

export const rootCauseExplanation =
    'This is a structural defect in PaymentAuthorizationHelper.authorizeOrder() (Step 3, which runs AFTER ' +
    'Kount) - it "stops and returns the FIRST error Status" from ANY of the three dispatchers (Elavon, ' +
    'PayPal, Acima), per its own doc comment. It is NOT specific to one payment method:\n\n' +
    '- PayPal - authorizePayPal() returns Status.ERROR(\'PAYPAL_AUTHORIZATION_FAILED\') on a missing ' +
    'paypalOrderID, a PayPal API timeout, or a response with no authorizationId.\n' +
    '- Acima - AcimaOrderAuthorizationHandler.authorize() returns its own Status.ERROR (e.g. ' +
    'ACIMA_MISSING_LEASE_DATA, ACIMA_DEPENDENCY_LOAD_FAILED, ACIMA_PAYMENT_ATTRIBUTE_PERSISTENCE_FAILED, or ' +
    'a plain business decline when the Acima APG response status is not APPROVED).\n' +
    '- Elavon - authorizeElavon() / ElavonAuthorizationHelper.prepareDeferredAuth() can likewise return ' +
    'Status.ERROR on a prepare failure.\n\n' +
    'Whichever dispatcher fails first, authorizeOrder() returns that Status.ERROR unchanged, and the ' +
    'dw.ocapi.shop.order.js afterPOST wrapper only catches THROWN exceptions - it does NOT intercept a ' +
    'RETURNED Status.ERROR - so that Status propagates straight back to SCAPI regardless of which gateway ' +
    'caused it.\n\n' +
    'A Status.ERROR returned by ANY hook on the order.afterPOST chain rolls back the ENTIRE SCAPI-request ' +
    'transaction, including the createOrder write itself. Kount\'s HTTP call, however, is an external side ' +
    'effect outside that transaction and CANNOT be rolled back. The result: Kount has a permanent record of ' +
    'the order, while SFCC reverts to having no order at all.';

export const rootCauseParity =
    'Why this is the same class of bug Kount already had to fix: the Kount-decline path used to return ' +
    'Status.ERROR too, which caused the exact same symptom - fixed by making runKountEvaluation() always ' +
    'return undefined and instead fail the order in-transaction via ' +
    'OrderPlacementHelper.failOrderRestoreBasket(). Payment authorization (runPaymentAuthorization, Step 3) ' +
    'was never given the same treatment.';

export const rootCauseFixOptions = [
    'Apply the same pattern used for Kount: on ANY payment-auth dispatcher failure, call ' +
        'OrderPlacementHelper.failOrderRestoreBasket(order) in-transaction and return undefined instead of ' +
        'Status.ERROR, so the order persists as FAILED and is traceable in BM - regardless of which gateway ' +
        'declined/errored.',
    'At minimum, have the dw.ocapi.shop.order.js afterPOST wrapper treat a returned Status.ERROR the same ' +
        'as a thrown exception (log + soft-fail) if losing the order on auth failure is never the desired ' +
        'behavior.',
];

export const rootCauseChart = `flowchart TD
    ORD["Order created<br/>status = CREATED<br/>(inside SCAPI-request transaction)"] --> ORCH["afterPOST: OrderPlacementOrchestrator.runAfterCreateOrder()"]

    ORCH --> KOUNT["KOUNT fraud evaluation<br/>KountRiskService.evaluateOrder()<br/>Kount API call fires - OUTSIDE the SFCC transaction,<br/>cannot be undone once sent"]

    KOUNT -->|"not DECLINED"| PAY["PAYMENT GATEWAY authorization<br/>PaymentAuthorizationHelper.authorizeOrder()<br/>dispatch order: Elavon then PayPal then Acima,<br/>stops at FIRST error Status from ANY of the three"]

    PAY --> ELV["Elavon prepareDeferredAuth()"]
    PAY --> PP["PayPal authorize()"]
    PAY --> ACM["Acima authorize()"]

    ELV -->|"prepare failure"| ELVFAIL["Status.ERROR (Elavon prepare code)"]
    PP -->|"missing paypalOrderID,<br/>timeout, or malformed response"| PPFAIL["Status.ERROR ('PAYPAL_AUTHORIZATION_FAILED')"]
    ACM -->|"missing lease data, dependency load failure,<br/>attribute-stamp failure, or APG status != APPROVED"| ACMFAIL["Status.ERROR (ACIMA_MISSING_LEASE_DATA /<br/>ACIMA_DEPENDENCY_LOAD_FAILED / business decline)"]

    ELVFAIL --> STATUSERR
    PPFAIL --> STATUSERR
    ACMFAIL --> STATUSERR

    STATUSERR["ROOT CAUSE<br/>ANY dispatcher's Status.ERROR is equally fatal -<br/>not specific to one payment method"]

    STATUSERR --> PROP["authorizeOrder() halts dispatch,<br/>returns the FIRST ERROR Status"]
    PROP --> ORCHRET["runAfterCreateOrder() returns authStatus<br/>(the ERROR Status) - NOT swallowed"]

    ORCHRET --> HOOKWRAP["dw.ocapi.shop.order.js afterPOST<br/>try/catch only catches THROWN exceptions -<br/>a RETURNED Status.ERROR passes straight through"]

    HOOKWRAP --> ROLLBACK["SCAPI rolls back the ENTIRE createOrder transaction<br/>Order document deleted<br/>c_kount_* attributes deleted<br/>Every Transaction.wrap in this request undone"]

    ROLLBACK --> GHOST["Result:<br/>Kount has a permanent record of the order (external call, not transactional)<br/>SFCC Business Manager has NO order at all"]

    style KOUNT fill:#fff3b0,stroke:#b8860b,color:#111
    style PAY fill:#c8f7c5,stroke:#2e7d32,color:#111
    style ELV fill:#c8f7c5,stroke:#2e7d32,color:#111
    style PP fill:#c8f7c5,stroke:#2e7d32,color:#111
    style ACM fill:#c8f7c5,stroke:#2e7d32,color:#111
    style ELVFAIL fill:#ffcdd2,stroke:#c62828,color:#111
    style PPFAIL fill:#ffcdd2,stroke:#c62828,color:#111
    style ACMFAIL fill:#ffcdd2,stroke:#c62828,color:#111
    style STATUSERR fill:#ff5252,stroke:#b71c1c,color:#fff
    style PROP fill:#ffcdd2,stroke:#c62828,color:#111
    style ORCHRET fill:#ffcdd2,stroke:#c62828,color:#111
    style HOOKWRAP fill:#ff5252,stroke:#b71c1c,color:#fff
    style ROLLBACK fill:#ff5252,stroke:#b71c1c,color:#fff
    style GHOST fill:#fff3b0,stroke:#b8860b,color:#111`;

