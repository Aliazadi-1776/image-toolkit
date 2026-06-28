# TODO / Roadmap

<p align="center">
  <strong>Roadmap, release checklist, and future improvements for Image Toolkit.</strong>
</p>

<p align="center">
  <a href="./README.md">English README</a>
  ·
  <a href="./README.fa.md">README فارسی</a>
  ·
  <a href="./docs/TECHNICAL.md">Technical Notes</a>
</p>

---

## ✅ Current Status

* [x] Build core desktop app with Tauri v2
* [x] Build Rust backend
* [x] Build React + TypeScript frontend
* [x] Add Tailwind CSS UI
* [x] Add Zustand state management
* [x] Add native file picker
* [x] Add folder input support
* [x] Add drag & drop support
* [x] Add command preview
* [x] Add ImageMagick integration
* [x] Add cwebp integration
* [x] Add avifenc integration
* [x] Add metadata strip options
* [x] Add metadata write options
* [x] Add resize options
* [x] Add batch queue processing
* [x] Add progress events
* [x] Add run logs
* [x] Add bundled tools status panel
* [x] Bundle Linux tools
* [x] Bundle Windows tools
* [x] Build Linux `.deb`
* [x] Build Linux `.AppImage`
* [x] Build Windows `.exe` installer with NSIS
* [x] Cross-build Windows installer from Linux
* [x] Add English README
* [x] Add Persian README
* [x] Add technical documentation
* [x] Add TODO roadmap

---

## 🚀 v0.1.0 Release Checklist

* [x] Test Linux `.deb` on a clean Ubuntu/Debian machine
* [x] Test Linux `.AppImage` on a clean Linux machine
* [x] Test Windows `.exe` installer on a real Windows machine
* [x] Confirm ImageMagick shows `ready` from bundled resources on Linux
* [x] Confirm cwebp shows `ready` from bundled resources on Linux
* [x] Confirm avifenc shows `ready` from bundled resources on Linux
* [x] Confirm ImageMagick shows `ready` from bundled resources on Windows
* [x] Confirm cwebp shows `ready` from bundled resources on Windows
* [x] Confirm avifenc shows `ready` from bundled resources on Windows
* [x] Test JPG → WebP
* [x] Test JPG → AVIF
* [x] Test JPG → PNG
* [x] Test PNG → WebP
* [x] Test PNG → JPEG
* [x] Test resize + convert together
* [x] Test metadata strip
* [x] Test metadata write
* [x] Test output folder mode
* [x] Test overwrite mode
* [x] Test batch queue with 50+ images
* [x] Test batch queue with 100+ images
* [x] Check command preview accuracy
* [x] Check logs after successful run
* [x] Check logs after failed run
* [x] Add final app icon
* [x] Add screenshots
* [x] Add `LICENSE`
* [x] Complete third-party notices
* [x] Create GitHub repository
* [x] Push source code
* [x] Create first GitHub Release
* [x] Upload Linux `.deb`
* [x] Upload Linux `.AppImage`
* [x] Upload Windows `.exe`
* [x] Add SHA256 checksums
---

## 📦 GitHub Release Assets

Recommended files for the first release:

* [x] `ImageToolkit-Linux-x64.deb`
* [x] `ImageToolkit-Linux-x64.AppImage`
* [x] `ImageToolkit-Windows-x64-Setup.exe`
* [x] `SHA256SUMS.txt`
* [x] `RELEASE_NOTES.md`

Future release assets:

* [ ] `ImageToolkit-Windows-x64-Portable.zip`
* [ ] `ImageToolkit-macOS-AppleSilicon.dmg`
* [ ] `ImageToolkit-macOS-Intel.dmg`

---

## 🧰 Packaging Strategy

* [ ] Decide whether to commit `src-tauri/vendor/` binaries directly
* [ ] Option A: commit vendor binaries directly for simple setup
* [ ] Option B: move heavy binaries to GitHub Releases
* [ ] Option C: use Git LFS for vendor binaries
* [ ] Add `.gitignore`
* [ ] Add `.gitattributes` if Git LFS is used
* [ ] Add `scripts/prepare-vendor-linux.sh`
* [ ] Add `scripts/prepare-vendor-windows.sh`
* [ ] Add `scripts/build-linux.sh`
* [ ] Add `scripts/build-windows-from-linux.sh`
* [ ] Add `scripts/check-vendor-tools.sh`
* [ ] Add release naming convention
* [ ] Add checksum generation script

---

## 🖥 Platform Support

* [x] Linux `.deb`
* [x] Linux `.AppImage`
* [x] Windows NSIS `.exe` installer
* [ ] Windows portable ZIP
* [ ] macOS Apple Silicon build
* [ ] macOS Intel build
* [ ] macOS `.dmg`
* [ ] macOS code signing
* [ ] macOS notarization
* [ ] GitHub Actions build matrix for Linux
* [ ] GitHub Actions build matrix for Windows
* [ ] GitHub Actions build matrix for macOS

---

## 🍎 macOS Roadmap

* [ ] Add `vendor/macos-arm64`
* [ ] Add `vendor/macos-x64`
* [ ] Add ImageMagick binary for macOS Apple Silicon
* [ ] Add ImageMagick binary for macOS Intel
* [ ] Add cwebp binary for macOS
* [ ] Add avifenc binary for macOS
* [ ] Update tool resolver for macOS paths
* [ ] Test `DYLD_LIBRARY_PATH`
* [ ] Build macOS app on real macOS or GitHub Actions
* [ ] Create `.dmg`
* [ ] Add signing and notarization later

---

## 🧪 Testing

* [ ] Add sample test images
* [ ] Add small JPG sample
* [ ] Add large JPG sample
* [ ] Add transparent PNG sample
* [ ] Add animated GIF sample
* [ ] Add Rust tests for command generation
* [ ] Add Rust tests for output path generation
* [ ] Add Rust tests for tool resolver
* [ ] Add frontend smoke tests
* [ ] Add queue stress test
* [ ] Add missing-tool test
* [ ] Add invalid-path test
* [ ] Add Unicode filename test
* [ ] Add Persian filename test
* [ ] Add Windows path test
* [ ] Add Linux path test

---

## 🖼 Image Processing Features

* [ ] Add dedicated WebP advanced panel
* [ ] Add dedicated AVIF advanced panel
* [ ] Add PNG optimization options
* [ ] Add JPEG progressive option
* [ ] Add DPI controls
* [ ] Add color profile conversion
* [ ] Add ICC profile preserve/remove toggle
* [ ] Add lossless WebP mode
* [ ] Add AVIF speed/preset controls
* [ ] Add output file size estimate
* [ ] Add before/after file size comparison
* [ ] Add total saved size summary
* [ ] Add compression percentage summary
* [ ] Add resize mode: fit
* [ ] Add resize mode: fill
* [ ] Add resize mode: stretch
* [ ] Add resize mode: long edge
* [ ] Add resize mode: short edge
* [ ] Add crop options
* [ ] Add rotate options
* [ ] Add flip options
* [ ] Add watermark support
* [ ] Add background color for transparent images
* [ ] Add SVG optimization support
* [ ] Add EXIF viewer

---

## 🧩 Presets

* [ ] Add preset manager
* [ ] Add save preset
* [ ] Add edit preset
* [ ] Add delete preset
* [ ] Add import/export presets
* [ ] Add default preset setting
* [ ] Add quick preset: Website WebP
* [ ] Add quick preset: Website AVIF
* [ ] Add quick preset: WooCommerce Product Image
* [ ] Add quick preset: Blog Featured Image
* [ ] Add quick preset: Instagram Post
* [ ] Add quick preset: Transparent PNG Cleanup
* [ ] Add quick preset: High Quality Archive
* [ ] Add quick preset: Smallest File Size

---

## 🎨 UI / UX

* [ ] Add final app icon
* [ ] Add splash screen
* [ ] Add better landing/empty state
* [ ] Add file thumbnails
* [ ] Add file size column
* [ ] Add output path preview
* [ ] Add output preview panel
* [ ] Add success toast
* [ ] Add error toast
* [ ] Add clearer failed-item cards
* [ ] Add light theme
* [ ] Add system theme mode
* [ ] Add compact mode
* [ ] Add advanced mode toggle
* [ ] Improve responsive layout
* [ ] Add drag-over visual feedback
* [ ] Add better progress animation
* [ ] Add final result summary card

---

## 🌐 Language Support

* [ ] Add English UI
* [ ] Add Persian UI
* [ ] Add language switcher
* [ ] Add RTL layout support
* [ ] Add saved language preference
* [ ] Translate buttons
* [ ] Translate errors
* [ ] Translate tooltips
* [ ] Translate logs where possible

---

## ⚙️ Settings

* [ ] Add settings screen
* [ ] Save settings as JSON
* [ ] Add custom ImageMagick path
* [ ] Add custom cwebp path
* [ ] Add custom avifenc path
* [ ] Add reset settings button
* [ ] Add default output folder
* [ ] Add default output format
* [ ] Add default quality
* [ ] Add default resize settings
* [ ] Add concurrency setting
* [ ] Add log level setting
* [ ] Add auto-check tools on startup
* [ ] Add export logs button

---

## 🔁 Queue Improvements

* [ ] Add pause queue
* [ ] Add resume queue
* [ ] Add cancel queue
* [ ] Add retry failed items
* [ ] Add skip current file
* [ ] Add concurrent processing option
* [ ] Add estimated time remaining
* [ ] Add completed/failed filter
* [ ] Add open output folder button
* [ ] Add clear completed button

---

## 🔐 Security & Trust

* [ ] Add project license
* [ ] Add third-party license files
* [ ] Add security policy
* [ ] Add checksums for release artifacts
* [ ] Add Windows code signing later
* [ ] Add macOS signing later
* [ ] Add SBOM later
* [ ] Add dependency audit workflow
* [ ] Add GitHub security alerts
* [ ] Add Dependabot config

---

## 🤖 Automation

* [ ] Add GitHub Actions for frontend build
* [ ] Add GitHub Actions for Rust build
* [ ] Add GitHub Actions for Linux release
* [ ] Add GitHub Actions for Windows release
* [ ] Add GitHub Actions for macOS release
* [ ] Add automatic checksum generation
* [ ] Add draft release workflow
* [ ] Add version bump script
* [ ] Add changelog generator
* [ ] Add release notes template

---

## 📚 Documentation

* [x] Add `README.md`
* [x] Add `README.fa.md`
* [x] Add `docs/TECHNICAL.md`
* [x] Add `TODO.md`
* [ ] Add `LICENSE`
* [ ] Add `CONTRIBUTING.md`
* [ ] Add `SECURITY.md`
* [ ] Add `CHANGELOG.md`
* [ ] Add `docs/INSTALL.md`
* [ ] Add `docs/BUILD.md`
* [ ] Add `docs/TROUBLESHOOTING.md`
* [ ] Add `docs/RELEASE.md`
* [ ] Add screenshots
* [ ] Add GIF demo
* [ ] Add issue templates
* [ ] Add pull request template

---

## فارسی — چک‌لیست خلاصه

### وضعیت فعلی

* [x] نسخه لینوکس ساخته شده
* [x] نسخه ویندوز ساخته شده
* [x] ابزارهای داخلی اضافه شده
* [x] README انگلیسی آماده شده
* [x] README فارسی آماده شده
* [x] مستندات فنی آماده شده
* [x] TODO آماده شده

### قبل از انتشار

* [ ] تست روی لینوکس تمیز
* [ ] تست روی ویندوز واقعی
* [ ] بررسی ready بودن هر سه ابزار
* [ ] تست تبدیل WebP
* [ ] تست تبدیل AVIF
* [ ] تست تبدیل PNG/JPEG
* [ ] اضافه کردن آیکن نهایی
* [ ] اضافه کردن اسکرین‌شات‌ها
* [ ] اضافه کردن License
* [ ] ساخت GitHub Release

### توسعه بعدی

* [ ] نسخه Portable ویندوز
* [ ] نسخه macOS
* [ ] Preset Manager
* [ ] نمایش حجم قبل و بعد
* [ ] نمایش درصد کاهش حجم
* [ ] رابط فارسی/انگلیسی
* [ ] GitHub Actions
* [ ] Auto Update
* [ ] Code Signing
* [ ] تنظیمات پیشرفته WebP و AVIF

---

## Priority Order

Recommended next steps:

1. Test Windows installer on real Windows
2. Test Linux builds on clean Linux
3. Add icon and screenshots
4. Add license
5. Push to GitHub
6. Create release `v0.1.0`
7. Add Windows portable ZIP
8. Add before/after file size summary
9. Add preset manager
10. Start macOS support
