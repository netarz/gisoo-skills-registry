#!/usr/bin/env node
// Builds index.json (readable) and index.min.json from skills/*/. Run validate.mjs first.
import { writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, RAW_BASE, readJson, skillIds, skillFiles, sha256 } from './lib.mjs';

const skills = skillIds().map((id) => {
  const base = join(ROOT, 'skills', id);
  const meta = readJson(join(base, 'meta.json'));
  const files = skillFiles(id).map((path) => {
    const buf = readFileSync(join(base, path));
    return { path, sha256: sha256(buf), size: buf.length };
  });
  const main = files.find((f) => f.path === 'SKILL.md');
  return {
    id: meta.id, title: meta.title, title_fa: meta.title_fa,
    description: meta.description, description_fa: meta.description_fa,
    publisher: meta.publisher, categories: meta.categories, tags: meta.tags ?? [],
    language: meta.language, version: meta.version, license: meta.license, verified: meta.verified, added_at: meta.added_at,
    sha256: main.sha256,
    url: `${RAW_BASE}/${id}/SKILL.md`,
    files,
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const cats = new Map();
for (const s of skills) for (const c of s.categories) cats.set(c, (cats.get(c) ?? 0) + 1);
const categories = [...cats].sort(([a], [b]) => a.localeCompare(b)).map(([id, count]) => ({ id, count }));

// generated_at only moves when the content does, so the index workflow does not commit noise.
const content = { schema_version: 1, count: skills.length, categories, skills };
let generated_at = new Date().toISOString();
try {
  const { generated_at: g, ...rest } = readJson(join(ROOT, 'index.json'));
  if (JSON.stringify(rest) === JSON.stringify(content)) generated_at = g;
} catch { /* first build */ }

const index = { schema_version: 1, generated_at, count: skills.length, categories, skills };
writeFileSync(join(ROOT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
writeFileSync(join(ROOT, 'index.min.json'), JSON.stringify(index));
console.log(`Built index with ${skills.length} skill(s), ${categories.length} categorie(s).`);
