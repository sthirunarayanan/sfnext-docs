#!/usr/bin/env node
/**
 * Hashes the given password and writes VITE_DOCS_PASSWORD_HASH directly to .env —
 * avoids manually copy/pasting a 64-char hex hash (error-prone, as seen when a
 * trailing character got dropped/altered by hand).
 *
 * Usage:
 *   node scripts/set-env-password.mjs "my-secret-password"
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/set-env-password.mjs "<password>"');
    process.exit(1);
}

const hash = createHash('sha256').update(password, 'utf8').digest('hex');
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

writeFileSync(envPath, `VITE_DOCS_PASSWORD_HASH=${hash}\n`, 'utf8');

console.log(`Wrote ${envPath}`);
console.log(`Hash length: ${hash.length} (must be 64)`);

