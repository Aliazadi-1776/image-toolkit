# ایمیج تولکیت | Image Toolkit

<p align="center">
  <strong>یک نرم‌افزار دسکتاپ شفاف، سریع و حرفه‌ای برای تبدیل، فشرده‌سازی و پردازش دسته‌ای تصاویر.</strong>
</p>

<p align="center">
  ساخته‌شده با <strong>Tauri v2</strong>، <strong>Rust</strong>، <strong>React</strong>، <strong>TypeScript</strong>، <strong>Vite</strong>، <strong>Tailwind CSS</strong> و ابزارهای قدرتمندی مثل <strong>ImageMagick</strong>، <strong>cwebp</strong> و <strong>avifenc</strong>.
</p>

<p align="center">
  <a href="./README.md">English</a>
  ·
  <a href="./docs/TECHNICAL.md">مستندات فنی</a>
  ·
  <a href="#ساخت-از-روی-سورس">ساخت از روی سورس</a>
  ·
  <a href="#خروجیهای-نهایی">خروجی‌های نهایی</a>
</p>

---

## Image Toolkit چیست؟

Image Toolkit یک رابط گرافیکی دسکتاپ برای پردازش تصاویر است؛ اما با یک تفاوت مهم:

این برنامه موتور پردازش تصویر اختصاصی خودش را از صفر نمی‌سازد.  
به‌جای آن، ابزارهای قدرتمند و امتحان‌پس‌داده‌ی خط فرمان را مدیریت می‌کند و دقیقاً نشان می‌دهد چه دستوری قرار است اجرا شود.

یعنی:

- پردازش مخفی وجود ندارد
- فایل‌ها به سرور آپلود نمی‌شوند
- هر گزینه در رابط کاربری به یک آرگومان واقعی CLI تبدیل می‌شود
- کاربر می‌تواند دستور نهایی را قبل از اجرا ببیند
- برنامه قابل بررسی، قابل توسعه و قابل اعتماد است

---

## امکانات اصلی

- تبدیل دسته‌ای تصاویر
- پشتیبانی از فایل تکی، چند فایل، فولدر و Drag & Drop
- انتخاب خروجی در همان فولدر، فولدر دلخواه یا overwrite
- تبدیل فرمت‌ها:
  - WebP
  - AVIF
  - PNG
  - JPEG
  - TIFF
  - BMP
  - GIF
  - ICO
- تغییر سایز تصویر
- کنترل کیفیت خروجی
- پشتیبانی از مسیرهای lossy و lossless
- حذف متادیتا
- نوشتن متادیتا
- پیش‌نمایش دستور نهایی
- صف پردازش
- نمایش پیشرفت پردازش
- لاگ اجرای هر فایل
- پنل وضعیت ابزارهای داخلی
- خروجی قابل نصب:
  - Linux `.deb`
  - Linux `.AppImage`
  - Windows `.exe` installer

---

## اسکرین‌شات‌ها



![Image Toolkit Home](docs/screenshot/home.png)


---

## با چه چیزهایی ساخته شده؟

| بخش | تکنولوژی |
|---|---|
| پوسته دسکتاپ | Tauri v2 |
| بک‌اند | Rust |
| فرانت‌اند | React |
| زبان فرانت | TypeScript |
| ابزار Build | Vite |
| استایل | Tailwind CSS |
| مدیریت State | Zustand |
| دیالوگ‌های native | Tauri Dialog Plugin |
| ابزار پردازش تصویر | ImageMagick، cwebp، avifenc |

---

## ابزارهای داخلی

Image Toolkit از ابزارهای خط فرمان زیر استفاده می‌کند:

| ابزار | کاربرد |
|---|---|
| ImageMagick `magick` | تبدیل، resize، metadata و پردازش عمومی تصاویر |
| WebP `cwebp` | فشرده‌سازی و خروجی WebP |
| libavif `avifenc` | ساخت خروجی AVIF |

برنامه ابزارها را از این مسیرها پیدا می‌کند:

1. ابزارهای bundle شده داخل برنامه
2. فولدر vendor در حالت توسعه
3. مسیر سیستم یا PATH به‌عنوان fallback

---

## ساختار پروژه

```text
image-toolkit/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   └── types/
├── src-tauri/
│   ├── src/
│   │   ├── cli/
│   │   ├── commands.rs
│   │   ├── models.rs
│   │   ├── tools.rs
│   │   └── tool_status.rs
│   ├── vendor/
│   │   ├── linux-x64/
│   │   ├── windows-x64/
│   │   └── THIRD_PARTY_NOTICES/
│   └── tauri.conf.json
├── docs/
│   └── TECHNICAL.md
├── README.md
└── README.fa.md
```

---

## دریافت سورس

```bash
git clone https://github.com/Aliazadi-1776/image-toolkit.git
cd image-toolkit
npm install
```


---

## اجرای توسعه

```bash
npm run tauri dev
```

فقط اجرای زیر کافی نیست:

```bash
npm run dev
```

چون در این حالت فقط فرانت‌اند بالا می‌آید و امکاناتی مثل backend تائوری، دیالوگ native، پردازش صف و اجرای ابزارها درست کار نمی‌کنند.

---

## ساخت از روی سورس

### لینوکس

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

خروجی:

```text
src-tauri/target/release/bundle/
```

### ویندوز روی خود ویندوز

```powershell
npm install
npm run tauri build -- --bundles nsis
```

خروجی:

```text
src-tauri\target\release\bundle\nsis\
```

### ساخت نسخه ویندوز از روی لینوکس

برای ساخت installer ویندوز از لینوکس:

```bash
sudo apt update
sudo apt install -y nsis lld llvm clang

rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
```

Build:

```bash
npm run tauri build -- \
  --runner cargo-xwin \
  --target x86_64-pc-windows-msvc \
  --bundles nsis
```

خروجی:

```text
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

---

## ابزارهای Vendor

چینش پیشنهادی ابزارهای لینوکس:

```text
src-tauri/vendor/linux-x64/
├── avifenc
├── cwebp
├── lib/
└── imagemagick/
    ├── AppRun
    └── usr/
```

چینش پیشنهادی ابزارهای ویندوز:

```text
src-tauri/vendor/windows-x64/
├── avifenc.exe
├── cwebp.exe
└── imagemagick/
    ├── magick.exe
    ├── delegates.xml
    ├── policy.xml
    └── ...
```

برای انتشار سورس روی GitHub بهتر است فایل‌های سنگین third-party را مستقیم داخل repo نگذاری، مگر اینکه تصمیم بگیری پروژه را همراه ابزارها منتشر کنی.

روش حرفه‌ای‌تر:

- سورس داخل GitHub
- فایل‌های نصبی داخل GitHub Releases
- ابزارهای سنگین داخل Release Assets یا Git LFS
- اسکریپت آماده‌سازی vendor در آینده

توضیحات کامل‌تر در [مستندات فنی](./docs/TECHNICAL.md).

---

## خروجی‌های نهایی

```text
Linux:
- image-toolkit_0.1.0_amd64.deb
- Image Toolkit_0.1.0_amd64.AppImage

Windows:
- Image Toolkit_0.1.0_x64-setup.exe
```

---

## حریم خصوصی

Image Toolkit کاملاً local-first است.

- آپلود ابری ندارد
- حساب کاربری نمی‌خواهد
- telemetry پیش‌فرض ندارد
- فایل‌ها روی سیستم خود کاربر پردازش می‌شوند

---


## Credits

ساخته‌شده توسط **ViraPeak**.

وب‌سایت: [virapeak.ir](https://virapeak.ir)

ساخته‌شده توسط **wrench**.
تلگرام : [im_wrench](https://t.me/im_wrench)
---

## نقشه راه

- مدیریت presetها
- کنترل‌های تخصصی‌تر AVIF
- پنل اختصاصی WebP
- انتخاب فولدر خروجی با Drag & Drop
- templateهای پیشرفته نام‌گذاری خروجی
- رابط چندزبانه
- Auto-update
- خروجی macOS
- GitHub Actions برای Release خودکار

