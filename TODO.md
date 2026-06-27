# TODO / Roadmap

<p align="center">
  <strong>Planned improvements, release checklist, and future ideas for Image Toolkit.</strong>
</p>

<p align="center">
  <a href="./README.md">English README</a>
  ·
  <a href="./README.fa.md">README فارسی</a>
  ·
  <a href="./docs/TECHNICAL.md">Technical Notes</a>
</p>

---

## ✅ Completed

- [x] Create Tauri v2 + React + TypeScript project structure
- [x] Add Rust backend commands
- [x] Add ImageMagick command preview
- [x] Add input file selection
- [x] Add folder input support
- [x] Add drag & drop support
- [x] Add basic conversion options
- [x] Add resize options
- [x] Add metadata strip options
- [x] Add metadata write options
- [x] Add queue-based processing
- [x] Add progress events
- [x] Add run logs
- [x] Add bundled tool status panel
- [x] Add Linux vendor tool support
- [x] Add Windows vendor tool support
- [x] Build Linux `.deb`
- [x] Build Linux `.AppImage`
- [x] Build Windows NSIS `.exe` installer from Linux
- [x] Add English README
- [x] Add Persian README
- [x] Add technical documentation

---

## 🚀 Release Checklist

- [ ] Test Linux `.deb` on a clean Ubuntu/Debian machine
- [ ] Test Linux `.AppImage` on a clean Linux machine
- [ ] Test Windows `.exe` installer on a real Windows machine
- [ ] Confirm ImageMagick is `ready` from bundled resources
- [ ] Confirm `cwebp` is `ready` from bundled resources
- [ ] Confirm `avifenc` is `ready` from bundled resources
- [ ] Test JPG → WebP
- [ ] Test JPG → AVIF
- [ ] Test PNG → JPEG
- [ ] Test PNG → WebP
- [ ] Test resize + convert together
- [ ] Test metadata strip
- [ ] Test metadata write
- [ ] Test batch queue with 50+ images
- [ ] Test output folder mode
- [ ] Test overwrite mode
- [ ] Test command preview accuracy
- [ ] Add final screenshots
- [ ] Add project license
- [ ] Add complete third-party notices
- [ ] Create first GitHub Release

---

## 📦 Packaging & Distribution

- [ ] Decide whether to commit `vendor/` binaries directly
- [ ] Alternative: move heavy binaries to GitHub Releases
- [ ] Alternative: use Git LFS for large binaries
- [ ] Add `scripts/prepare-vendor-linux.sh`
- [ ] Add `scripts/prepare-vendor-windows.sh`
- [ ] Add release artifact naming convention
- [ ] Add checksums for release files
- [ ] Add release notes template
- [ ] Add portable ZIP build for Windows
- [ ] Add `.deb` install instructions
- [ ] Add `.AppImage` run instructions
- [ ] Add Windows SmartScreen note
- [ ] Add WebView2 troubleshooting note

---

## 🧪 Testing

- [ ] Add Rust unit tests for command generation
- [ ] Add Rust tests for tool resolver paths
- [ ] Add frontend component smoke tests
- [ ] Add sample images for testing
- [ ] Add snapshot tests for generated commands
- [ ] Add queue stress test
- [ ] Add failure test for missing tools
- [ ] Add invalid file input test
- [ ] Add large batch test
- [ ] Add cross-platform path tests

---

## 🖼 Image Processing Features

- [ ] Add dedicated WebP advanced options
- [ ] Add dedicated AVIF advanced options
- [ ] Add PNG optimization options
- [ ] Add JPEG progressive option
- [ ] Add DPI controls
- [ ] Add color profile conversion
- [ ] Add ICC profile preserve/remove toggle
- [ ] Add output size estimation
- [ ] Add before/after file size comparison
- [ ] Add lossless WebP mode
- [ ] Add AVIF speed/preset controls
- [ ] Add resize mode presets:
  - [ ] Fit
  - [ ] Fill
  - [ ] Stretch
  - [ ] Long edge
  - [ ] Short edge
- [ ] Add crop options
- [ ] Add rotate/flip options
- [ ] Add watermark support
- [ ] Add background color for transparent images
- [ ] Add PDF/image extraction support later

---

## 🧰 Presets & Workflow

- [ ] Add preset manager
- [ ] Add save preset
- [ ] Add import/export presets
- [ ] Add default preset setting
- [ ] Add quick presets:
  - [ ] Website WebP
  - [ ] Website AVIF
  - [ ] WooCommerce Product Image
  - [ ] Instagram Post
  - [ ] Blog Featured Image
  - [ ] Transparent PNG Cleanup
- [ ] Add recent output folders
- [ ] Add recent input folders
- [ ] Add command copy button
- [ ] Add dry-run mode
- [ ] Add pause/resume queue
- [ ] Add cancel queue
- [ ] Add retry failed items

---

## 🎨 UI / UX

- [ ] Add app icon
- [ ] Add splash/loading screen
- [ ] Improve responsive layout
- [ ] Add light theme
- [ ] Add system theme mode
- [ ] Add Persian UI language
- [ ] Add English/Persian language switcher
- [ ] Add better empty states
- [ ] Add toast notifications
- [ ] Add clearer error cards
- [ ] Add drag-over visual feedback
- [ ] Add compact mode
- [ ] Add advanced mode toggle
- [ ] Add file thumbnails
- [ ] Add output preview panel
- [ ] Add file size column
- [ ] Add estimated output path preview

---

## ⚙️ Settings

- [ ] Add settings screen
- [ ] Save settings to JSON
- [ ] Add custom tool path fields
- [ ] Add reset settings button
- [ ] Add default output folder
- [ ] Add default quality
- [ ] Add default format
- [ ] Add concurrency setting
- [ ] Add logging level setting
- [ ] Add auto-check bundled tools on startup
- [ ] Add export logs button

---

## 🖥 Platform Support

- [x] Linux `.deb`
- [x] Linux `.AppImage`
- [x] Windows `.exe` installer
- [ ] Windows portable ZIP
- [ ] macOS Intel build
- [ ] macOS Apple Silicon build
- [ ] macOS code signing
- [ ] macOS notarization
- [ ] GitHub Actions build matrix

---

## 🔐 Security & Trust

- [ ] Add project license
- [ ] Add third-party license files
- [ ] Add security policy
- [ ] Add checksum generation
- [ ] Add release signing later
- [ ] Add Windows code signing later
- [ ] Add SBOM later
- [ ] Add dependency audit workflow

---

## 🤖 Automation

- [ ] Add GitHub Actions for lint/build
- [ ] Add GitHub Actions for Linux releases
- [ ] Add GitHub Actions for Windows releases
- [ ] Add GitHub Actions for checksums
- [ ] Add automatic draft release creation
- [ ] Add version bump script
- [ ] Add changelog generator
- [ ] Add Dependabot config

---

## 📚 Documentation

- [x] Add English README
- [x] Add Persian README
- [x] Add technical notes
- [ ] Add installation guide
- [ ] Add build guide
- [ ] Add troubleshooting guide
- [ ] Add screenshots
- [ ] Add GIF demo
- [ ] Add contribution guide
- [ ] Add issue templates
- [ ] Add pull request template
- [ ] Add release checklist document

---

## 🌍 Future Ideas

- [ ] Multi-language interface
- [ ] Plugin system for new CLI tools
- [ ] Custom command templates
- [ ] Watch folder automation
- [ ] Context menu integration
- [ ] Auto-update support
- [ ] Image comparison view
- [ ] Batch rename module
- [ ] EXIF viewer
- [ ] Color palette extractor
- [ ] SVG optimization support
- [ ] Video thumbnail extraction
- [ ] Simple image editor tools

---

## فارسی — لیست کارهای بعدی

### انجام شده

- [x] ساخت پروژه با Tauri v2، React و TypeScript
- [x] ساخت بک‌اند Rust
- [x] پیش‌نمایش دستور ImageMagick
- [x] انتخاب فایل و فولدر
- [x] Drag & Drop
- [x] تنظیمات پایه تبدیل تصویر
- [x] تغییر سایز
- [x] حذف و نوشتن متادیتا
- [x] پردازش صفی
- [x] نمایش progress
- [x] نمایش لاگ
- [x] پنل وضعیت ابزارهای داخلی
- [x] آماده‌سازی ابزارهای لینوکس
- [x] آماده‌سازی ابزارهای ویندوز
- [x] خروجی `.deb`
- [x] خروجی `.AppImage`
- [x] خروجی `.exe` ویندوز
- [x] README انگلیسی
- [x] README فارسی
- [x] مستندات فنی

### قبل از انتشار عمومی

- [ ] تست نسخه لینوکس روی سیستم تمیز
- [ ] تست نسخه ویندوز روی ویندوز واقعی
- [ ] بررسی ready بودن ImageMagick
- [ ] بررسی ready بودن cwebp
- [ ] بررسی ready بودن avifenc
- [ ] تست تبدیل JPG به WebP
- [ ] تست تبدیل JPG به AVIF
- [ ] تست تبدیل PNG به JPEG
- [ ] تست پردازش دسته‌ای ۵۰ تصویر یا بیشتر
- [ ] اضافه کردن اسکرین‌شات
- [ ] اضافه کردن license
- [ ] تکمیل third-party notices
- [ ] ساخت اولین GitHub Release

### توسعه‌های پیشنهادی

- [ ] مدیریت preset
- [ ] تنظیمات پیشرفته WebP
- [ ] تنظیمات پیشرفته AVIF
- [ ] حالت light theme
- [ ] رابط فارسی
- [ ] خروجی macOS
- [ ] GitHub Actions
- [ ] Auto-update
- [ ] Windows portable ZIP
- [ ] تست خودکار
- [ ] مستندات نصب و troubleshooting

---

## Notes

This file is intentionally practical.  
Completed items should stay checked, and new ideas should be added under the right section.

### فارسی

این فایل برای مدیریت مسیر توسعه پروژه است.  
کارهای انجام‌شده را تیک بزن و ایده‌های جدید را زیر بخش مناسب اضافه کن.
