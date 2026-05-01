#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'));

const declared = pkg.packageManager;
if (!declared) {
  console.error('packageManager field is missing from apps/web/package.json');
  process.exit(1);
}

const match = declared.match(/^pnpm@(\d+)\./);
if (!match) {
  console.error(`packageManager must be pnpm@<version>, got: ${declared}`);
  process.exit(1);
}
const declaredMajor = match[1];

const runtimeAgent = process.env.npm_config_user_agent || '';
const runtimeMatch = runtimeAgent.match(/pnpm\/(\d+)\./);
if (!runtimeMatch) {
  console.error(`Runtime is not pnpm. user_agent: ${runtimeAgent || '(empty)'}`);
  process.exit(1);
}
const runtimeMajor = runtimeMatch[1];

if (declaredMajor !== runtimeMajor) {
  console.error(
    `pnpm major mismatch: declared ${declared}, running pnpm ${runtimeMajor}.x`,
  );
  process.exit(1);
}

console.log(`OK: pnpm ${runtimeMajor}.x matches declared ${declared}`);
