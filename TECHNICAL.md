# Technical Notes / مستندات فنی

<p align="center">
  <strong>Image Toolkit internal architecture, build strategy, bundled tools, and release notes.</strong>
</p>

<p align="center">
  <a href="../README.md">English README</a>
  ·
  <a href="../README.fa.md">README فارسی</a>
</p>

---

## 1. Product Philosophy

Image Toolkit is a transparent desktop wrapper around trusted image-processing command-line tools.

It intentionally avoids hiding the processing pipeline. The generated command is visible to the user, and every GUI option should map to a real CLI argument.

### فارسی

Image Toolkit یک رابط دسکتاپ شفاف برای ابزارهای خط فرمان پردازش تصویر است.

هدف این پروژه این نیست که یک موتور ناشناخته و مخفی برای پردازش تصویر بسازد. هر گزینه‌ای که کاربر در UI انتخاب می‌کند، باید به یک آرگومان واقعی در command line تبدیل شود و دستور نهایی قابل مشاهده باشد.

---

## 2. Architecture Overview

```text
React UI
  ↓
Zustand Store
  ↓
Tauri Commands
  ↓
Rust Queue Runner
  ↓
Tool Resolver
  ↓
ImageMagick / cwebp / avifenc
```

### Main parts

| Part | Responsibility |
|---|---|
| React UI | User interface |
| Zustand | Operation state, queue state, logs |
| Tauri Commands | Bridge between frontend and Rust |
| Rust Backend | Command generation, queue execution, event emission |
| Tool Resolver | Finds bundled or system CLI tools |
| CLI Tools | Actual image processing |

### فارسی

معماری پروژه به این شکل است:

```text
رابط React
  ↓
Store با Zustand
  ↓
Commandهای Tauri
  ↓
اجرای صف در Rust
  ↓
Tool Resolver
  ↓
ImageMagick / cwebp / avifenc
```

| بخش | مسئولیت |
|---|---|
| React UI | رابط کاربری |
| Zustand | وضعیت عملیات، صف، لاگ‌ها |
| Tauri Commands | ارتباط فرانت و بک‌اند Rust |
| Rust Backend | ساخت دستور، اجرای صف، ارسال event |
| Tool Resolver | پیدا کردن ابزار داخلی یا سیستمی |
| CLI Tools | پردازش واقعی تصویر |

---

## 3. Frontend Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Tauri JS APIs
- Tauri Dialog Plugin

### فارسی

استک فرانت‌اند:

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- APIهای Tauri
- پلاگین Dialog تائوری

---

## 4. Backend Stack

- Rust
- Tauri v2
- Native process execution through `std::process::Command`
- Queue execution in a background thread
- Tauri event emission for progress updates

### فارسی

استک بک‌اند:

- Rust
- Tauri v2
- اجرای پردازش‌ها با `std::process::Command`
- اجرای صف در thread جدا
- ارسال event به فرانت برای نمایش progress

---

## 5. Important Rust Files

```text
src-tauri/src/
├── commands.rs
├── models.rs
├── tools.rs
├── tool_status.rs
├── settings.rs
├── error.rs
└── cli/
    ├── mod.rs
    └── magick.rs
```

| File | Purpose |
|---|---|
| `commands.rs` | Tauri command handlers |
| `models.rs` | Shared request/response models |
| `tools.rs` | Tool resolution and runtime environment setup |
| `tool_status.rs` | Bundled tool health checks |
| `cli/magick.rs` | Command generation for ImageMagick |
| `error.rs` | App error type |

### فارسی

| فایل | کاربرد |
|---|---|
| `commands.rs` | هندلرهای Tauri command |
| `models.rs` | مدل‌های مشترک request و response |
| `tools.rs` | پیدا کردن ابزارها و تنظیم environment |
| `tool_status.rs` | بررسی وضعیت ابزارهای داخلی |
| `cli/magick.rs` | ساخت دستورهای ImageMagick |
| `error.rs` | نوع خطای برنامه |

---

## 6. Tool Resolution Strategy

The application tries to resolve each tool in this order:

1. Development vendor folder
2. Bundled resource folder
3. System PATH fallback

### Linux candidates

```text
vendor/linux-x64/imagemagick/AppRun
vendor/linux-x64/imagemagick/usr/bin/magick
vendor/linux-x64/imagemagick/bin/magick
vendor/linux-x64/imagemagick/magick

vendor/linux-x64/cwebp
vendor/linux-x64/avifenc
```

### Windows candidates

```text
vendor/windows-x64/imagemagick/magick.exe
vendor/windows-x64/imagemagick/bin/magick.exe

vendor/windows-x64/cwebp.exe
vendor/windows-x64/avifenc.exe
```

### فارسی

برنامه ابزارها را به ترتیب زیر پیدا می‌کند:

1. فولدر vendor در حالت development
2. فولدر resource داخل نسخه نصب‌شده
3. fallback از PATH سیستم

مسیرهای مهم لینوکس:

```text
vendor/linux-x64/imagemagick/AppRun
vendor/linux-x64/imagemagick/usr/bin/magick
vendor/linux-x64/cwebp
vendor/linux-x64/avifenc
```

مسیرهای مهم ویندوز:

```text
vendor/windows-x64/imagemagick/magick.exe
vendor/windows-x64/cwebp.exe
vendor/windows-x64/avifenc.exe
```

---

## 7. Bundled Tool Layout

### Linux

```text
src-tauri/vendor/linux-x64/
├── cwebp
├── avifenc
├── lib/
│   ├── libavif.so.*
│   ├── libaom.so.*
│   ├── libdav1d.so.*
│   └── ...
└── imagemagick/
    ├── AppRun
    ├── usr/
    │   ├── bin/
    │   ├── lib/
    │   └── share/
    └── ...
```

### Windows

```text
src-tauri/vendor/windows-x64/
├── cwebp.exe
├── avifenc.exe
└── imagemagick/
    ├── magick.exe
    ├── identify.exe
    ├── mogrify.exe
    ├── delegates.xml
    ├── policy.xml
    ├── colors.xml
    └── ...
```

### فارسی

چینش ابزارهای داخلی باید دقیق باشد، چون resolver بر اساس همین مسیرها ابزارها را پیدا می‌کند.

در لینوکس، ImageMagick از نسخه extract شده AppImage استفاده می‌کند و `avifenc` ممکن است به libraryهای داخل `vendor/linux-x64/lib` نیاز داشته باشد.

در ویندوز، ImageMagick portable در فولدر `imagemagick` قرار می‌گیرد و `cwebp.exe` و `avifenc.exe` مستقیم در `windows-x64` قرار می‌گیرند.

---

## 8. Runtime Environment

For Linux, the app prepares:

```text
PATH
LD_LIBRARY_PATH
MAGICK_HOME
APPDIR
MAGICK_CONFIGURE_PATH
MAGICK_CODER_MODULE_PATH
```

For Windows, the app prepares:

```text
PATH
MAGICK_HOME
```

### فارسی

در لینوکس، برای اینکه ابزارهای bundle شده بدون نصب سیستمی اجرا شوند، برنامه مسیرهای لازم مثل `LD_LIBRARY_PATH` و مسیرهای config مربوط به ImageMagick را تنظیم می‌کند.

در ویندوز، معمولاً کافی است مسیر فولدر ابزارها به `PATH` اضافه شود و `MAGICK_HOME` تنظیم شود.

---

## 9. Tauri Resources

The project bundles vendor folders through `tauri.conf.json`:

```json
"resources": {
  "vendor/linux-x64/": "vendor/linux-x64",
  "vendor/windows-x64/": "vendor/windows-x64",
  "vendor/THIRD_PARTY_NOTICES/": "vendor/THIRD_PARTY_NOTICES"
}
```

### فارسی

برای اینکه ابزارها داخل خروجی نصب‌شده قرار بگیرند، فولدرهای vendor در بخش `resources` فایل `tauri.conf.json` تعریف شده‌اند.

---

## 10. Development Commands

```bash
npm install
npm run tauri dev
```

Do not use only `npm run dev` for full app testing.

### فارسی

برای تست کامل برنامه:

```bash
npm install
npm run tauri dev
```

اجرای تنها `npm run dev` فقط فرانت را بالا می‌آورد و برای تست ابزارها کافی نیست.

---

## 11. Linux Build

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

Expected output:

```text
src-tauri/target/release/bundle/deb/
src-tauri/target/release/bundle/appimage/
```

### فارسی

ساخت نسخه لینوکس:

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

خروجی‌ها در مسیر زیر ساخته می‌شوند:

```text
src-tauri/target/release/bundle/
```

---

## 12. Windows Build from Linux

Install tools:

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

Expected output:

```text
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

### فارسی

برای ساخت نسخه ویندوز از روی لینوکس:

```bash
sudo apt update
sudo apt install -y nsis lld llvm clang

rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
```

سپس:

```bash
npm run tauri build -- \
  --runner cargo-xwin \
  --target x86_64-pc-windows-msvc \
  --bundles nsis
```

خروجی در این مسیر قرار می‌گیرد:

```text
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

---

## 13. WebView2 on Windows

Tauri apps on Windows use Microsoft Edge WebView2.

For public releases, recommended modes:

| Mode | Notes |
|---|---|
| `downloadBootstrapper` | Smaller installer, downloads WebView2 if needed |
| `embedBootstrapper` | Includes bootstrapper, may still need internet |
| `offlineInstaller` | Larger installer |
| `fixedRuntime` | Fully bundled runtime, largest option |

### فارسی

اپ‌های Tauri در ویندوز از WebView2 استفاده می‌کنند.

برای انتشار عمومی، اگر حجم کم مهم باشد، `downloadBootstrapper` مناسب است.  
اگر نصب بدون اینترنت مهم باشد، باید سراغ گزینه‌های سنگین‌تر مثل `offlineInstaller` یا `fixedRuntime` رفت.

---

## 14. Release Checklist

Before publishing a GitHub Release:

- [x] Build Linux `.deb`
- [ ] Build Linux `.AppImage`
- [x] Build Windows `.exe`
- [x] Test bundled tools on a clean Linux system
- [x] Test installer on a real Windows machine
- [x] Check WebView2 behavior on Windows
- [x] Test JPG to WebP
- [x] Test JPG to AVIF
- [x] Test PNG to JPEG
- [x] Check command preview
- [x] Check queue progress
- [x] Add screenshots
- [x] Add license
- [x] Add third-party notices
- [x] Create release notes

### فارسی

قبل از انتشار GitHub Release:

- [x] ساخت `.deb`
- [ ] ساخت `.AppImage`
- [x] ساخت `.exe` ویندوز
- [x] تست ابزارهای داخلی روی لینوکس تمیز
- [x] تست installer روی ویندوز واقعی
- [x] بررسی WebView2
- [x] تست JPG به WebP
- [x] تست JPG به AVIF
- [x] تست PNG به JPEG
- [x] بررسی command preview
- [x] بررسی queue progress
- [x] افزودن اسکرین‌شات‌ها
- [x] افزودن license
- [x] افزودن third-party notices
- [x] نوشتن release notes

---

## 15. Troubleshooting

### Tools show as missing

Check whether the file exists inside the installed resource directory.

Linux:

```bash
find /usr/lib/image-toolkit/vendor -type f | grep -Ei "magick|cwebp|avifenc"
```

Windows:

```powershell
Get-ChildItem -Recurse "C:\Program Files\Image Toolkit" | Select-String "magick|cwebp|avifenc"
```

### Linux shared library issue

Run:

```bash
ldd src-tauri/vendor/linux-x64/avifenc
```

If anything shows `not found`, copy the missing libraries into:

```text
src-tauri/vendor/linux-x64/lib/
```

### ImageMagick Linux issue

Prefer the extracted ImageMagick AppImage layout:

```text
src-tauri/vendor/linux-x64/imagemagick/AppRun
src-tauri/vendor/linux-x64/imagemagick/usr/
```

### فارسی

اگر ابزارها missing شدند، اول مطمئن شو فایل‌ها واقعاً داخل resource نصب شده وجود دارند.

در لینوکس:

```bash
find /usr/lib/image-toolkit/vendor -type f | grep -Ei "magick|cwebp|avifenc"
```

اگر library کم بود، با `ldd` بررسی کن و libraryهای لازم را داخل `vendor/linux-x64/lib` قرار بده.

برای ImageMagick لینوکس، ساختار extract شده AppImage مطمئن‌تر است.
