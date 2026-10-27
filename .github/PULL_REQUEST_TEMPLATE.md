## چه چیزی اضافه یا عوض می‌شود؟ / What changes?

- [ ] مهارت تازه (`skills/<id>/`) / New skill
- [ ] ویرایش مهارت موجود (`version` را بالا ببرید) / Update to an existing skill

**نام مهارت / Skill:**
**این مهارت چه کاری را برای کاربر راحت می‌کند؟ / What does it help with?**

## فهرست بررسی / Checklist

- [ ] `node scripts/validate.mjs` بدون خطا اجرا می‌شود / passes locally
- [ ] نام پوشه، `name` در `SKILL.md` و `id` در `meta.json` یکی است / folder, frontmatter `name` and `meta.json` id are equal
- [ ] `SKILL.md` فقط متن است؛ اسکریپت، فایل اجرایی و فایل دودویی ندارد / text only: no scripts, executables or binaries
- [ ] هیچ کلید، توکن یا رمزی در فایل‌ها نیست و از مدل نمی‌خواهد کلید یا دستور سیستمی را نشان بدهد / no secrets, and it never asks the model to reveal keys or the system prompt
- [ ] متن فارسی و انگلیسی `meta.json` هر دو نوشته شده است / both Persian and English meta text are filled in
- [ ] `verified` را `false` گذاشته‌ام (فقط نگهدارندگان آن را `true` می‌کنند) / `verified` is `false` (maintainers set it)
- [ ] مهارت در دستهٔ ردشدنی‌های [CONTRIBUTING](../CONTRIBUTING.md) نیست / not in the rejected categories
