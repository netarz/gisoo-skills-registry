// Shared helpers: a small JSON Schema (2020-12 subset) validator, SKILL.md parsing and the safety scanner.
// No npm install is needed anywhere in this repo.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const RAW_BASE = 'https://raw.githubusercontent.com/netarz/gisoo-skills-registry/main/skills';
export const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
export const skillIds = () => readdirSync(join(ROOT, 'skills')).filter((f) => statSync(join(ROOT, 'skills', f)).isDirectory()).sort();

/** Every file under skills/<id>/ except meta.json, as relative paths (SKILL.md first). */
export function skillFiles(id) {
  const base = join(ROOT, 'skills', id);
  const out = [];
  const walk = (dir, prefix) => {
    for (const f of readdirSync(dir).sort()) {
      const full = join(dir, f);
      if (statSync(full).isDirectory()) walk(full, `${prefix}${f}/`);
      else if (`${prefix}${f}` !== 'meta.json') out.push(`${prefix}${f}`);
    }
  };
  walk(base, '');
  return out.sort((a, b) => (a === 'SKILL.md' ? -1 : b === 'SKILL.md' ? 1 : a.localeCompare(b)));
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const typeOk = (t, v) => ({ object: isObj(v), array: Array.isArray(v), string: typeof v === 'string', boolean: typeof v === 'boolean', number: typeof v === 'number', integer: Number.isInteger(v) })[t];
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function check(schema, v, path = '$') {
  const errs = [];
  if (schema.type && !typeOk(schema.type, v)) return [`${path}: expected ${schema.type}`];
  if (schema.enum && !schema.enum.some((e) => eq(e, v))) errs.push(`${path}: must be one of ${schema.enum.join(', ')}`);
  if ('const' in schema && !eq(schema.const, v)) errs.push(`${path}: must be ${schema.const}`);
  if (typeof v === 'string') {
    if (schema.minLength !== undefined && [...v].length < schema.minLength) errs.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && [...v].length > schema.maxLength) errs.push(`${path}: longer than ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(v)) errs.push(`${path}: does not match ${schema.pattern}`);
  }
  if (Array.isArray(v)) {
    if (schema.minItems !== undefined && v.length < schema.minItems) errs.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.maxItems !== undefined && v.length > schema.maxItems) errs.push(`${path}: more than ${schema.maxItems} items`);
    if (schema.items) v.forEach((x, i) => errs.push(...check(schema.items, x, `${path}[${i}]`)));
  }
  if (isObj(v)) {
    for (const r of schema.required ?? []) if (!(r in v)) errs.push(`${path}: missing "${r}"`);
    const props = schema.properties ?? {};
    for (const [k, x] of Object.entries(v)) {
      if (props[k]) errs.push(...check(props[k], x, `${path}.${k}`));
      else if (schema.additionalProperties === false) errs.push(`${path}: unknown field "${k}"`);
    }
  }
  return errs;
}

/** Parses the frontmatter subset the Gisoo app reads: `key: value` lines and `tags: [a, b]`. */
export function parseSkillMd(text) {
  const src = text.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(src);
  if (!m) return { error: 'SKILL.md must start with a --- frontmatter block' };
  const fields = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let val = kv[2].trim();
    if (/^\[.*\]$/.test(val)) val = val.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    else val = val.replace(/^(["'])(.*)\1$/, '$2');
    fields[kv[1]] = val;
  }
  return { fields, body: m[2] };
}

// ---- Safety scanner: a port of the app's SkillScanner.kt (pro.gisoo.core.skills). ----
// Blocked: prompt injection, secret/system-prompt disclosure, sending data to a URL, exfiltration hosts, bidi/tag characters.
// Warn: zero-width characters, long base64 runs, hiding things from the user. The registry rejects both levels.
// ZWNJ (U+200C) and ZWJ (U+200D) are normal in Persian and never flagged.
const R = (src, flags = 'i') => new RegExp(src, flags);
const NL = '[^\\n]';
const RULES = [
  ['blocked', R('(ignore|disregard|forget|override)\\s+(all\\s+|any\\s+)?(of\\s+)?(the\\s+|your\\s+)?(previous|prior|above|earlier|system|original)\\s+(instructions|prompts?|rules|messages)'), 'prompt-injection phrase (ignore previous instructions)'],
  ['blocked', R('(دستور|دستورات|دستورها|دستورالعمل|قوانین|قواعد)[\\u200c\\s]*(های)?\\s*(قبلی|پیشین|بالا|سیستم|سیستمی)\\s*(را|رو)?\\s*(نادیده|فراموش|کنار)'), 'prompt-injection phrase (Persian)'],
  ['blocked', R('(reveal|print|show|output|repeat|leak|send|share|dump|exfiltrate|disclose)\\b.{0,60}\\b(api[\\s_-]?keys?|secret\\s+keys?|passwords?|access\\s+tokens?|credentials|system\\s+prompt|hidden\\s+instructions)'), 'asks the model to reveal keys, passwords or the system prompt'],
  ['blocked', R(`(کلید|رمز|توکن|پسورد|پرامپت\\s*سیستم|دستور\\s*سیستمی)${NL}{0,40}(را|رو)?\\s*(فاش|نمایش|بفرست|ارسال|لو\\s*بده|بنویس|چاپ)`), 'asks the model to reveal keys, passwords or the system prompt (Persian)'],
  ['blocked', R('(send|post|upload|forward|transmit|exfiltrate|beacon)\\b.{0,80}(https?://|webhook)'), 'asks the model to send data to a URL'],
  ['blocked', R(`(بفرست|ارسال\\s*کن|آپلود\\s*کن|پست\\s*کن)${NL}{0,60}https?://`), 'asks the model to send data to a URL (Persian)'],
  ['blocked', R('https?://[^\\s)]*(webhook\\.site|requestbin|pipedream\\.net|ngrok|burpcollaborator|interact\\.sh|oast\\.|canarytokens|pastebin\\.com)'), 'points at a data-exfiltration service'],
  ['blocked', R('!\\[[^\\]]*]\\(https?://[^)\\s]*\\?[^)\\s]*(\\{|%7b|\\$|data=|q=|secret|token|key=)'), 'image URL with a query string that can leak data'],
  ['warn', R("(do\\s+not|don't|never)\\s+(tell|inform|show|let)\\s+(the\\s+)?user"), 'asks the model to hide something from the user'],
  ['warn', R('(به\\s*کاربر\\s*(نگو|اطلاع\\s*نده|نشان\\s*نده)|از\\s*کاربر\\s*پنهان)'), 'asks the model to hide something from the user (Persian)'],
  ['warn', R('(ignore|disobey)\\s+(the\\s+)?user'), 'asks the model to ignore the user'],
  ['warn', R('(به\\s*(حرف|درخواست|خواسته)\\s*(ی\\s*)?کاربر\\s*توجه\\s*نکن|کاربر\\s*را\\s*نادیده\\s*بگیر)'), 'asks the model to ignore the user (Persian)'],
  ['warn', R('[A-Za-z0-9+/]{200,}={0,2}', ''), 'very long base64-like string'],
];

function hiddenChars(t) {
  let bidi = false, tag = false, zero = false;
  for (let i = 0; i < t.length; i++) {
    const c = t.charCodeAt(i);
    if ((c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069)) bidi = true;
    else if (c === 0x200b || c === 0x2060 || c === 0x180e || (c === 0xfeff && i > 0) || (c >= 0x2061 && c <= 0x2064)) zero = true;
    else if (c === 0xdb40 && i + 1 < t.length && t.charCodeAt(i + 1) >= 0xdc00 && t.charCodeAt(i + 1) <= 0xdc7f) tag = true;
  }
  if (tag || bidi) return ['blocked', 'hidden or bidi control characters'];
  if (zero) return ['warn', 'invisible zero-width characters'];
  return null;
}

/** Returns [{level, note}] for a list of texts (empty array = clean). */
export function scanTexts(texts) {
  const found = new Map();
  for (const t of texts) {
    const h = hiddenChars(t);
    if (h) found.set(h[1], h[0]);
    for (const [level, re, note] of RULES) if (re.test(t)) found.set(note, level);
  }
  return [...found].map(([note, level]) => ({ level, note }));
}
