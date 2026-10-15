import { sha256Hex } from './sha256';

export const UNIFI_SESSION_KEY = 'sfnext-docs-unifi-unlocked';

const configuredHash = import.meta.env.VITE_UNIFI_DEMO_PASSWORD_HASH as string | undefined;

/** Whether a separate Unifi Demo password has been configured via VITE_UNIFI_DEMO_PASSWORD_HASH. */
export function isUnifiPasswordConfigured(): boolean {
    return Boolean(configuredHash);
}

export function isUnifiUnlocked(): boolean {
    return sessionStorage.getItem(UNIFI_SESSION_KEY) === 'true';
}

/** Hashes `password` and compares it to VITE_UNIFI_DEMO_PASSWORD_HASH. Marks the session unlocked on match. */
export async function tryUnlockUnifi(password: string): Promise<boolean> {
    const hash = await sha256Hex(password);
    if (hash === configuredHash) {
        sessionStorage.setItem(UNIFI_SESSION_KEY, 'true');
        return true;
    }
    return false;
}

