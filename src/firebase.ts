import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

// Public Firebase web app config — safe to ship in client JS (not a secret), identical in
// shape/intent to the config Firebase console generates for "Add Firebase to your web app".
const firebaseConfig = {
    apiKey: 'AIzaSyDHZz_0WYSr0tgREkg87aag00xybSlqS1o',
    authDomain: 'sfnext-docs.firebaseapp.com',
    projectId: 'sfnext-docs',
    storageBucket: 'sfnext-docs.firebasestorage.app',
    messagingSenderId: '990762432474',
    appId: '1:990762432474:web:aa26591734487732d2b2e3',
    measurementId: 'G-YR4WTBE2J8',
};

export const firebaseApp = initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Lazily initializes Firebase Analytics, guarded by isSupported() since Analytics relies on
 * browser APIs (e.g. IndexedDB, cookies) that aren't available in every environment (SSR,
 * some privacy-hardened browsers). Call this once the app has mounted; safe to call multiple
 * times — the underlying initialization only runs once.
 */
export function initAnalytics(): Promise<Analytics | null> {
    if (!analyticsPromise) {
        analyticsPromise = isSupported().then((supported) => (supported ? getAnalytics(firebaseApp) : null));
    }
    return analyticsPromise;
}

