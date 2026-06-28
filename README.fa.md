<div align="center" dir="rtl">

# 🖼️ Image Toolkit

### یک اپ دسکتاپ سریع و لوکال برای تبدیل، تغییر سایز، فشرده‌سازی و تمیز کردن تصاویر؛ بدون اینکه پشت پرده چیزی قایم شود.

<img src="./docs/screenshot/home.png" alt="اسکرین‌شات Image Toolkit" width="900"/>

<br/>

[![Made with Tauri](https://img.shields.io/badge/Made%20with-Tauri-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-Backend-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

[English](./README.md) · [مستندات فنی](./TECHNICAL.md) · [TODO](./TODO.md) · [ریپازیتوری](https://github.com/Aliazadi-1776/image-toolkit)

</div>

---

## ✨ Image Toolkit چیه؟

Image Toolkit یه ابزار دسکتاپ برای پردازش تصویرهاست؛ مخصوصاً وقتی چندتا یا چندصدتا عکس داری و نمی‌خوای تک‌تک با ابزارهای مختلف درگیر بشی.

ایده‌اش ساده‌ست:

> یه رابط کاربری تمیز بالا، ابزارهای واقعی و قدرتمند پایین.

این برنامه خودش یه موتور عجیب و غریب مخفی نمی‌سازه. به‌جاش از ابزارهای شناخته‌شده مثل **ImageMagick**، **cwebp** و **avifenc** استفاده می‌کنه و حتی دستور نهایی رو هم بهت نشون می‌ده.

---

## ⚡ چرا ساخته شد؟

خیلی از ابزارهای تبدیل عکس یا آنلاینن، یا زیادی سنگینن، یا معلوم نیست دقیقاً پشت صحنه چه کاری انجام می‌دن.

من یه چیزی می‌خواستم که لوکال کار کنه، فایل‌ها رو آپلود نکنه، batch processing واقعی داشته باشه، دستور نهایی رو نشون بده و روی لینوکس و ویندوز خروجی قابل نصب بده.

---

## 🧰 امکانات

- تبدیل دسته‌ای تصاویر
- تغییر سایز و فشرده‌سازی
- حذف metadata
- نوشتن metadata ساده
- پیش‌نمایش دستور نهایی
- اجرای صف پردازش
- نمایش progress و log
- بررسی آماده بودن ابزارهای داخلی
- کار کاملاً لوکال روی سیستم خودت

---

## 🖼️ فرمت‌های پشتیبانی‌شده

| فرمت | وضعیت |
|---|---|
| WebP | ✅ |
| AVIF | ✅ |
| PNG | ✅ |
| JPEG / JPG | ✅ |
| TIFF | ✅ |
| BMP | ✅ |
| GIF | ✅ |
| ICO | ✅ |

---

## 🧪 پشت صحنه از چی استفاده می‌کنه؟

| ابزار | کاربرد |
|---|---|
| **ImageMagick** | تبدیل، resize، metadata و پردازش عمومی تصویر |
| **cwebp** | ساخت خروجی WebP |
| **avifenc** | ساخت خروجی AVIF |

برنامه اول ابزارهای bundle شده داخل خودش رو چک می‌کنه، بعد فولدر `vendor` در حالت توسعه، و در نهایت ابزارهای نصب‌شده روی سیستم رو به عنوان fallback استفاده می‌کنه.

---

## 🖥️ پلتفرم‌ها

| سیستم‌عامل | خروجی |
|---|---|
| Linux | `.deb` |
| Linux | `.AppImage` |
| Windows | installer با فرمت `.exe` |
| macOS | در برنامه آینده |

---

## 📸 اسکرین‌شات

<div align="center">

<img src="./docs/screenshot/home.png" alt="نمای اصلی Image Toolkit" width="900"/>

</div>

---

## 🚀 اجرای پروژه از روی سورس

```bash
git clone https://github.com/Aliazadi-1776/image-toolkit.git
cd image-toolkit
npm install
```

برای اجرای نسخه توسعه:

```bash
npm run tauri dev
```

فقط `npm run dev` کافی نیست؛ چون در اون حالت فقط فرانت بالا میاد و بک‌اند Rust، دیالوگ native، اجرای ابزارها و queue درست کار نمی‌کنن.

---

## 🏗️ ساخت خروجی

### لینوکس

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

### ویندوز روی خود ویندوز

```powershell
npm install
npm run tauri build -- --bundles nsis
```

### ساخت نسخه ویندوز از روی لینوکس

```bash
sudo apt update
sudo apt install -y nsis lld llvm clang

rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin

npm run tauri build -- \
  --runner cargo-xwin \
  --target x86_64-pc-windows-msvc \
  --bundles nsis
```

---

## 📦 ساختار ابزارهای داخلی

### لینوکس

```text
src-tauri/vendor/linux-x64/
├── cwebp
├── avifenc
├── lib/
└── imagemagick/
    ├── AppRun
    └── usr/
```

### ویندوز

```text
src-tauri/vendor/windows-x64/
├── cwebp.exe
├── avifenc.exe
└── imagemagick/
    ├── magick.exe
    ├── delegates.xml
    ├── policy.xml
    └── ...
```

اگر نمی‌خوای ریپو خیلی سنگین بشه، بهتره این فایل‌های باینری رو داخل GitHub Releases بذاری و مستقیم داخل repo commit نکنی.

---

## 🗺️ مسیر آینده

- [ ] نسخه Portable برای ویندوز
- [ ] خروجی macOS
- [ ] مدیریت presetها
- [ ] نمایش حجم قبل و بعد
- [ ] تنظیمات حرفه‌ای‌تر WebP
- [ ] تنظیمات حرفه‌ای‌تر AVIF
- [ ] سوییچ زبان فارسی / انگلیسی داخل برنامه
- [ ] GitHub Actions برای ساخت release
- [ ] Auto Update

جزئیات بیشتر توی [TODO.md](./TODO.md) هست.

---

## 🔒 حریم خصوصی

Image Toolkit لوکال‌فرست طراحی شده: آپلود ابری نداره، حساب کاربری نمی‌خواد، telemetry پیش‌فرض نداره و فایل‌ها روی سیستم خودت پردازش می‌شن.

---

## 🧑‍💻 سازنده

ساخته‌شده با قهوه زیاد و کمی آشوب توسط **wrench** 🔧

تلگرام: [@im_wrench](https://t.me/im_wrench)

---

## 📄 لایسنس

MIT License — فایل [LICENSE](./LICENSE) رو ببین.

---

<div align="center" dir="rtl">

### اگر به کارت اومد، یه Star کوچیک خیلی خوشحالم می‌کنه ⭐

</div>
