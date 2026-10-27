import { sha256Hex } from './sha256';

export const UNIFI_DOCS_SESSION_KEY = 'sfnext-docs-unifi-docs-unlocked';

const configuredHash = import.meta.env.VITE_UNIFI_DOCS_PASSWORD_HASH as string | undefined;

/** Whether a separate Unifi Documentation page password has been configured via VITE_UNIFI_DOCS_PASSWORD_HASH. */
export function isUnifiDocsPasswordConfigured(): boolean {
    return Boolean(configuredHash);
}

export function isUnifiDocsUnlocked(): boolean {
    return sessionStorage.getItem(UNIFI_DOCS_SESSION_KEY) === 'true';
}

/** Hashes `password` and compares it to VITE_UNIFI_DOCS_PASSWORD_HASH. Marks the session unlocked on match. */
export async function tryUnlockUnifiDocs(password: string): Promise<boolean> {
    const hash = await sha256Hex(password);
    if (hash === configuredHash) {
        sessionStorage.setItem(UNIFI_DOCS_SESSION_KEY, 'true');
        return true;
    }
    return false;
}

