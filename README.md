<div align="center">

<a href="https://gisoo.pro/gisoo-ai?utm_source=github&utm_medium=referral&utm_campaign=gisoo-skills-registry"><img src="assets/gisoo-banner.png" alt="گیسو: رجیستری مهارت‌ها" width="100%"></a>

# رجیستری مهارت‌های گیسو (Gisoo Skills Registry)

**فهرست باز و عمومی مهارت‌ها برای فروشگاه مهارت در اپ گیسو.**

An open, public list of skills that powers the skills store in the Gisoo AI app.

[هوش مصنوعی گیسو](https://gisoo.pro/gisoo-ai?utm_source=github&utm_medium=referral&utm_campaign=gisoo-skills-registry) · [English](#english) · [مشارکت](CONTRIBUTING.md) · [`index.json`](index.json)

</div>

## این مخزن چیست

مهارت (Skill) یک فایل متنی به نام `SKILL.md` است که به دستیار هوشمند یاد می‌دهد یک کار مشخص را قدم‌به‌قدم و با کیفیت انجام بدهد: نوشتن نامهٔ اداری، خلاصهٔ سند بلند، برنامهٔ مطالعه و مانند این‌ها.
هر مهارت یک پوشه در `skills/` است و هر کسی می‌تواند با پول‌ریکوئست مهارت تازه پیشنهاد بدهد.

## اپ گیسو چطور از آن استفاده می‌کند

در بخش «فروشگاه مهارت» اپ [گیسو](https://gisoo.pro/gisoo-ai?utm_source=github&utm_medium=referral&utm_campaign=gisoo-skills-registry) همین فهرست را می‌بینید: دسته‌ها، جست‌وجو و صفحهٔ هر مهارت با پیش‌نمایش متن و نتیجهٔ بررسی ایمنی.
با یک ضربه مهارت را اضافه می‌کنید؛ پیش از ذخیره دوباره بررسی ایمنی می‌شود و فقط اگر پاک باشد فعال می‌شود. برچسب «تأییدشده» یعنی نگهدارندگان متن را خوانده‌اند.

اپ فهرست را از `https://gisoo.pro/api/v1/app/skills-registry` می‌گیرد؛ آن نشانی هر ساعت نسخهٔ `index.json` همین مخزن را می‌خواند و اگر گیت‌هاب در دسترس نباشد آخرین نسخهٔ سالم را نگه می‌دارد.

## ساختار

| مسیر | کاربرد |
|---|---|
| `skills/<id>/SKILL.md` | متن مهارت با سرصفحهٔ `name` و `description` |
| `skills/<id>/meta.json` | اطلاعات فهرست: عنوان و توضیح فارسی و انگلیسی، ناشر، دسته، برچسب، نسخه |
| `schema/meta.schema.json` | طرح JSON Schema فایل `meta.json` |
| `scripts/validate.mjs` | اعتبارسنجی بدون اینترنت: سرصفحه، طرح، اندازه، نوع فایل، کلید و رمز، بررسی ایمنی (همان قاعده‌های اپ) |
| `scripts/build-index.mjs` | ساخت `index.json` و `index.min.json` با هش SHA-256 هر `SKILL.md` |
| `index.json`، `index.min.json` | فهرست ساخته‌شده؛ با هر ادغام خودکار به‌روز می‌شود |

```bash
node scripts/validate.mjs
node scripts/build-index.mjs
```

برای افزودن مهارت، [CONTRIBUTING.md](CONTRIBUTING.md) را بخوانید. مجوز: MIT.

<a id="english"></a>

## English

**What it is.** A skill is a plain-text `SKILL.md` file that teaches the AI assistant how to do one task well, step by step: a formal letter,
a long-document summary, a study plan. This repository is a public list of skills. Each skill is a folder in `skills/`, and anyone can propose a new one
with a pull request.

**How Gisoo uses it.** The «skills store» in the [Gisoo app](https://gisoo.pro/gisoo-ai?utm_source=github&utm_medium=referral&utm_campaign=gisoo-skills-registry)
shows this list with categories, search and a page per skill (a rendered preview and the safety-scan result). One tap adds a skill; it is scanned again
before it is stored and is enabled only if clean. The «verified» badge means the maintainers read the text.

**Mirror.** The app reads `https://gisoo.pro/api/v1/app/skills-registry`, which fetches this repository's `index.json` hourly and keeps the last
good copy if GitHub is unreachable. You can also read `index.json` or `index.min.json` straight from this repo.

**Contribute.** Create `skills/<id>/SKILL.md` and `skills/<id>/meta.json` ([schema](schema/meta.schema.json)), run `node scripts/validate.mjs`, open a pull request.
Rules and rejected categories are in [CONTRIBUTING.md](CONTRIBUTING.md). A workflow validates every pull request and rebuilds the index after a merge.

Gisoo is run by [NetArz](https://netarz.ir). Security reports: `dev@netarz.ir`. MIT licensed.
