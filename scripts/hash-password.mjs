#!/usr/bin/env node
/**
 * Prints the SHA-256 hex digest of a password, to paste into VITE_DOCS_PASSWORD_HASH
 * in .env (local) or your hosting provider's environment variable settings (production).
 *
 * Usage:
 *   node scripts/hash-password.mjs "my-secret-password"
 */
import { createHash } from 'node:crypto';

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-password.mjs "<password>"');
    process.exit(1);
}

const hash = createHash('sha256').update(password, 'utf8').digest('hex');
console.log(hash);

