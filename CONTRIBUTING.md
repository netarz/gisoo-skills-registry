# مشارکت در رجیستری مهارت‌های گیسو

[English below](#english)

اگر مهارتی می‌شناسید یا نوشته‌اید که به دیگران کمک می‌کند، می‌توانید با یک پول‌ریکوئست آن را به فروشگاه مهارت گیسو اضافه کنید.
اگر وقت نوشتن ندارید، با قالب «پیشنهاد مهارت» یک Issue باز کنید.

## افزودن مهارت در چهار قدم

1. **پوشه را بسازید.** مخزن را فورک کنید و پوشهٔ `skills/<id>/` را بسازید. `<id>` با حروف کوچک انگلیسی، عدد و خط تیره است.
   نمونه‌ها در پوشهٔ `skills/` هستند.
2. **`SKILL.md` را بنویسید.** سرصفحه (Frontmatter) باید `name` (برابر با `<id>`) و `description` داشته باشد؛ بعد از آن متن مهارت به Markdown.
   فیلدهای اختیاری: `title`، `when_to_use`، `tags` و `language`.
3. **`meta.json` را بنویسید.** عنوان و توضیح فارسی و انگلیسی، ناشر، دسته‌ها، برچسب‌ها و نسخه (جدول زیر).
4. **اعتبارسنجی کنید و پول‌ریکوئست بدهید.** `node scripts/validate.mjs` را اجرا کنید؛ به نصب بسته یا اینترنت نیازی ندارد. بعد از ادغام،
   `index.json` خودکار ساخته می‌شود؛ آن را دستی عوض نکنید.

## فیلدهای `meta.json`

| فیلد | توضیح |
|---|---|
| `id` | شناسهٔ یکتا؛ برابر با نام پوشه و `name` در `SKILL.md` |
| `title`، `title_fa` | عنوان انگلیسی و فارسی |
| `description`، `description_fa` | توضیح کوتاه (تا ۲۸۰ نویسه) به انگلیسی و فارسی |
| `publisher` | `name` و `url` (https) ناشر یا نویسنده |
| `categories`، `tags` | دسته‌ها (۱ تا ۵، حروف کوچک انگلیسی) و برچسب‌ها |
| `language` | `fa`، `en` یا `multi` |
| `version` | نسخه به‌صورت `1.0.0`؛ با هر تغییر متن بالا ببرید تا اپ گیسو به‌روزرسانی را نشان بدهد |
| `license` | پروانهٔ مهارت، مثلاً `MIT` |
| `verified` | فقط نگهدارندگان `true` می‌کنند؛ شما `false` بگذارید |
| `added_at` | تاریخ افزودن به‌صورت `YYYY-MM-DD` |

## محدودیت‌ها

- `SKILL.md` تا ۳۲ کیلوبایت؛ هر فایل متنی کمکی تا ۳۲ کیلوبایت؛ مجموع پوشه تا ۱۲۸ کیلوبایت و حداکثر ۱۰ فایل.
- فقط فایل متنی: `.md`، `.txt`، `.csv`، `.json`، `.yaml`، `.yml`. اسکریپت، فایل اجرایی و هر فایل دودویی ردشدنی است.
- هرگز کلید، توکن یا رمز در فایل‌ها ننویسید.
- بررسی ایمنی همان قاعده‌های اپ گیسو را اجرا می‌کند. موارد زیر خطا می‌دهند: عبارت «دستورهای قبلی را نادیده بگیرید» و مانند آن، خواستن کلید، رمز یا دستور سیستمی از مدل، فرستادن داده به یک نشانی اینترنتی، پنهان‌کردن چیزی از کاربر، نویسه‌های نامرئی و رشته‌های بلند رمزگذاری‌شده. نیم‌فاصلهٔ فارسی (ZWNJ) مشکلی ندارد.

## قاعدهٔ بررسی

- مهارت باید یک کار مشخص را خوب انجام بدهد و مراحلش روشن باشد، نه فهرستی از کلی‌گویی.
- متن فارسی روان و محترمانه باشد. توضیح‌ها بدون قیمت، ادعای اغراق‌آمیز یا مقایسه با رقیب باشند.
- مهارت حقوقی، پزشکی یا مالی نباید ادعای مشاورهٔ تخصصی کند؛ باید کاربر را به کارشناس ارجاع بدهد.
- نگهدارندگان ممکن است مهارت را آزمایش کنند و پیش از ادغام تغییر بخواهند.

## چه چیزهایی رد می‌شود

- محتوای بزرگسالان و قمار
- ابزار فیلترشکن و VPN
- مهارت‌هایی که برای دور زدن محدودیت‌های سرویس‌ها ساخته شده‌اند
- هر چیز غیرقانونی
- اسکریپت و هر فایل اجرایی
- دستور به مدل برای فاش‌کردن کلید، رمز یا دستورهای سیستمی، یا پنهان‌کردن کار از کاربر

---

<a id="english"></a>

# Contributing to the Gisoo skills registry

If you know or have written a skill that helps others, add it to Gisoo's skills store with a pull request.
If you do not have time to write it, open an Issue with the «suggest a skill» template.

## Add a skill in four steps

1. **Create the folder.** Fork the repo and create `skills/<id>/`. `<id>` is lowercase letters, digits and hyphens. See the existing skills.
2. **Write `SKILL.md`.** The frontmatter needs `name` (equal to `<id>`) and `description`, followed by the skill text in Markdown.
   Optional fields: `title`, `when_to_use`, `tags`, `language`.
3. **Write `meta.json`.** Persian and English title and description, publisher, categories, tags and version (table below).
4. **Validate and open a pull request.** Run `node scripts/validate.mjs`; it needs no packages and no network. After the merge,
   `index.json` is rebuilt by a workflow; do not edit it by hand.

## `meta.json` fields

| Field | Meaning |
|---|---|
| `id` | Unique id; equals the folder name and the `name` in `SKILL.md` |
| `title`, `title_fa` | English and Persian title |
| `description`, `description_fa` | Short text (up to 280 characters) in English and Persian |
| `publisher` | Publisher or author `name` and `url` (https) |
| `categories`, `tags` | Categories (1 to 5, lowercase English) and tags |
| `language` | `fa`, `en` or `multi` |
| `version` | Entry version as `1.0.0`; bump it on every text change so the Gisoo app can offer the update |
| `license` | Licence of the skill, e.g. `MIT` |
| `verified` | Set by maintainers only; leave it `false` |
| `added_at` | Date added, `YYYY-MM-DD` |

## Limits

- `SKILL.md` up to 32 KB; each extra text file up to 32 KB; the folder up to 128 KB and at most 10 files.
- Text files only: `.md`, `.txt`, `.csv`, `.json`, `.yaml`, `.yml`. Scripts, executables and any binary file are rejected.
- Never put a key, token or password in a file.
- The safety scan runs the same rules as the Gisoo app. These fail: «ignore previous instructions» style phrases, asking the model to reveal keys, passwords or the system prompt,
  sending data to a URL, hiding things from the user, invisible characters and long encoded strings. The Persian half-space (ZWNJ) is fine.

## Review rules

- A skill does one well-defined job and its steps are clear, not a list of generalities.
- Keep text accurate and respectful. No prices, inflated claims or comparisons with competitors.
- Legal, medical and financial skills must not claim to be professional advice; they point the user to a specialist.
- Maintainers may test the skill and ask for changes before merging.

## What gets rejected

- Adult content and gambling
- VPN and proxy tools
- Skills built to get around a service's restrictions
- Anything illegal
- Scripts and any executable file
- Instructions to the model to reveal keys, passwords or system prompts, or to hide work from the user
