#!/usr/bin/env node
// Validates every skills/<id>/ folder. Offline: never touches the network.
import { readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ROOT, readJson, skillIds, skillFiles, check, parseSkillMd, scanTexts } from './lib.mjs';

const schema = readJson(join(ROOT, 'schema', 'meta.schema.json'));
const SECRET = [/\bsk-[A-Za-z0-9_-]{8,}/, /\bghp_[A-Za-z0-9]{8,}/, /\bgithub_pat_[A-Za-z0-9_]{8,}/, /AIza[0-9A-Za-z_-]{10,}/, /\bBearer\s+[A-Za-z0-9._~+/-]{12,}/i, /\bxox[bap]-[A-Za-z0-9-]{8,}/, /\bAKIA[0-9A-Z]{12,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/];
const BANNED = [/\bporn|\bxxx\b|\badult\b|\bnsfw\b|\bcasino\b|\bgambling\b|\bbetting\b|\bvpn\b/i, /فیلترشکن|کازینو|قمار|شرط‌بندی|پورن|دور\s*زدن\s*(تحریم|فیلتر|محدودیت)/];
const TEXT_EXT = new Set(['.md', '.txt', '.csv', '.json', '.yaml', '.yml']);
const LIMITS = { skillMd: 32 * 1024, file: 32 * 1024, total: 128 * 1024, files: 10, meta: 4 * 1024 };
const fa = /[؀-ۿ]/;
const errors = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);

for (const id of skillIds()) {
  const base = join(ROOT, 'skills', id);
  const files = skillFiles(id);
  if (!files.includes('SKILL.md')) { fail(id, 'SKILL.md is missing'); continue; }
  if (files.length > LIMITS.files) fail(id, `more than ${LIMITS.files} files`);
  let total = 0;
  const texts = [];
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (!TEXT_EXT.has(ext)) fail(id, `${f}: file type "${ext || '(none)'}" is not allowed (text files only: ${[...TEXT_EXT].join(' ')}; no scripts or binaries)`);
    const buf = readFileSync(join(base, f));
    total += buf.length;
    if (buf.length > (f === 'SKILL.md' ? LIMITS.skillMd : LIMITS.file)) fail(id, `${f}: larger than the size limit`);
    if (buf.includes(0)) fail(id, `${f}: contains binary data`);
    const text = buf.toString('utf8');
    if (/^#!/.test(text)) fail(id, `${f}: starts with a shebang (scripts are not allowed)`);
    texts.push(text);
    for (const re of SECRET) if (re.test(text)) fail(id, `${f}: looks like it contains a secret or token`);
  }
  if (total > LIMITS.total) fail(id, `skill folder larger than ${LIMITS.total} bytes`);

  let meta;
  try {
    if (statSync(join(base, 'meta.json')).size > LIMITS.meta) fail(id, 'meta.json is too large');
    meta = JSON.parse(readFileSync(join(base, 'meta.json'), 'utf8'));
  } catch (e) { fail(id, `meta.json missing or invalid (${e.message})`); }
  if (meta) {
    for (const e of check(schema, meta)) fail(id, `meta.json ${e}`);
    if (meta.id !== id) fail(id, `meta.json id "${meta.id}" must equal the folder name`);
    const pu = meta.publisher?.url;
    if (pu) { try { if (new URL(pu).protocol !== 'https:') fail(id, `not https: ${pu}`); } catch { fail(id, `bad URL: ${pu}`); } }
    if (typeof meta.title_fa === 'string' && !fa.test(meta.title_fa)) fail(id, 'title_fa must contain Persian text');
    if (typeof meta.description_fa === 'string' && !fa.test(meta.description_fa)) fail(id, 'description_fa must contain Persian text');
    if (typeof meta.description === 'string' && !/[A-Za-z]/.test(meta.description)) fail(id, 'description must be English text');
    texts.push(JSON.stringify(meta));
  }

  const md = parseSkillMd(readFileSync(join(base, 'SKILL.md'), 'utf8'));
  if (md.error) fail(id, md.error);
  else {
    const { fields, body } = md;
    if (typeof fields.name !== 'string' || !fields.name) fail(id, 'frontmatter "name" is required');
    else if (fields.name !== id) fail(id, `frontmatter name "${fields.name}" must equal the folder name`);
    if (typeof fields.description !== 'string' || !fields.description) fail(id, 'frontmatter "description" is required');
    else if ([...fields.description].length > 1024) fail(id, 'frontmatter description is longer than 1024 characters');
    if (!body.trim()) fail(id, 'SKILL.md has no body');
  }

  for (const n of scanTexts(texts)) fail(id, `safety scan (${n.level}): ${n.note}`);
  if (BANNED.some((re) => re.test(texts.join('\n')))) fail(id, 'content outside the registry rules (see CONTRIBUTING.md)');
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`OK: ${skillIds().length} skill(s) valid.`);
