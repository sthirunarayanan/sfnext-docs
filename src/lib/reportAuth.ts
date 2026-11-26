import { sha256Hex } from './sha256';

export const REPORT_SESSION_KEY = 'sfnext-docs-report-unlocked';

const configuredHash = import.meta.env.VITE_REPORT_PASSWORD_HASH as string | undefined;

/** Whether a separate Daily Report password has been configured via VITE_REPORT_PASSWORD_HASH. */
export function isReportPasswordConfigured(): boolean {
    return Boolean(configuredHash);
}

export function isReportUnlocked(): boolean {
    return sessionStorage.getItem(REPORT_SESSION_KEY) === 'true';
}

/** Hashes `password` and compares it to VITE_REPORT_PASSWORD_HASH. Marks the session unlocked on match. */
export async function tryUnlockReport(password: string): Promise<boolean> {
    const hash = await sha256Hex(password);
    if (hash === configuredHash) {
        sessionStorage.setItem(REPORT_SESSION_KEY, 'true');
        return true;
    }
    return false;
}
