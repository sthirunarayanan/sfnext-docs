#!/usr/bin/env node
/**
 * Hashes the given password and writes it to the given key in .env — avoids manually
 * copy/pasting a 64-char hex hash (error-prone, as seen when a trailing character got
 * dropped/altered by hand). Preserves any other keys already in .env.
 *
 * Usage:
 *   node scripts/set-env-password.mjs "my-secret-password"                      # VITE_DOCS_PASSWORD_HASH
 *   node scripts/set-env-password.mjs "my-secret-password" VITE_UNIFI_DEMO_PASSWORD_HASH
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const password = process.argv[2];
const key = process.argv[3] || 'VITE_DOCS_PASSWORD_HASH';

if (!password) {
    console.error('Usage: node scripts/set-env-password.mjs "<password>" [ENV_KEY]');
    process.exit(1);
}

const hash = createHash('sha256').update(password, 'utf8').digest('hex');
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env');

const existingLines = existsSync(envPath)
    ? readFileSync(envPath, 'utf8').split('\n').filter((line) => line.trim().length > 0)
    : [];
const otherLines = existingLines.filter((line) => !line.startsWith(`${key}=`));
otherLines.push(`${key}=${hash}`);

writeFileSync(envPath, `${otherLines.join('\n')}\n`, 'utf8');

console.log(`Wrote ${key} to ${envPath}`);
console.log(`Hash length: ${hash.length} (must be 64)`);

