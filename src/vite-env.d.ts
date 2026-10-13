/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** SHA-256 hex digest of the access password. Generate with scripts/hash-password.mjs. */
    readonly VITE_DOCS_PASSWORD_HASH?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

