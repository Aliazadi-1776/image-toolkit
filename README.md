<div align="center">

# 🖼️ Image Toolkit

### A fast, local-first desktop app for converting, resizing, compressing, and cleaning up images — without hiding the real command behind the UI.

<img src="./docs/screenshot/home.png" alt="Image Toolkit Screenshot" width="900"/>

<br/>

[![Made with Tauri](https://img.shields.io/badge/Made%20with-Tauri-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-Backend-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

[فارسی](./README.fa.md) · [Technical Notes](./TECHNICAL.md) · [TODO](./TODO.md) · [Repository](https://github.com/Aliazadi-1776/image-toolkit)

</div>

---

## ✨ What is Image Toolkit?

Image Toolkit is a desktop image utility built for people who process a lot of images and still want to know exactly what is happening.

It is not a mystery black box. It is a clean GUI that talks to proven command-line tools like **ImageMagick**, **cwebp**, and **avifenc**.

You choose the files, pick the output format, set quality or resize rules, and the app shows the command it is going to run.

> simple UI on top, real tools underneath.

---

## ⚡ Why I built it

Most image converters either feel too heavy, too online, or too hidden.

I wanted something that works locally, does not upload files anywhere, can process a real batch queue, shows the final command, and ships as a real desktop app for Linux and Windows.

---

## 🧰 What it can do

- Batch image conversion
- Resize and compress images
- Strip metadata
- Write basic metadata
- Preview generated commands
- Queue-based processing
- Per-file progress and logs
- Bundled tool status check
- Local-only workflow

---

## 🖼️ Supported formats

| Format | Status |
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

## 🧪 The tools behind it

| Tool | Used for |
|---|---|
| **ImageMagick** | conversion, resize, metadata, general processing |
| **cwebp** | WebP encoding |
| **avifenc** | AVIF encoding |

The app tries to find tools from bundled resources first, then the local development `vendor` folder, and finally the system PATH.

---

## 🖥️ Platforms

| OS | Package |
|---|---|
| Linux | `.deb` |
| Linux | `.AppImage` |
| Windows | NSIS `.exe` installer |
| macOS | planned |

---

## 📸 Screenshot

<div align="center">

<img src="./docs/screenshot/home.png" alt="Image Toolkit Home" width="900"/>

</div>

---

## 🚀 Getting started from source

```bash
git clone https://github.com/Aliazadi-1776/image-toolkit.git
cd image-toolkit
npm install
```

Run the desktop app:

```bash
npm run tauri dev
```

Do not use only `npm run dev` if you want to test the full app. The frontend may open, but native dialogs, backend commands, queue events, and bundled tools need the Tauri runtime.

---

## 🏗️ Build

### Linux

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

### Windows from Windows

```powershell
npm install
npm run tauri build -- --bundles nsis
```

### Windows from Linux

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

## 📦 Vendor layout

### Linux

```text
src-tauri/vendor/linux-x64/
├── cwebp
├── avifenc
├── lib/
└── imagemagick/
    ├── AppRun
    └── usr/
```

### Windows

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

If you want a lighter repository, keep large binaries out of Git and attach them to GitHub Releases instead.

---

## 🗺️ Roadmap

- [ ] Windows portable ZIP
- [ ] macOS build
- [ ] Preset manager
- [ ] before/after file size report
- [ ] better WebP controls
- [ ] better AVIF controls
- [ ] Persian / English UI switcher
- [ ] GitHub Actions release pipeline
- [ ] auto-update support

More details are in [TODO.md](./TODO.md).

---

## 🔒 Privacy

Image Toolkit is local-first: no cloud upload, no account, no telemetry by default, and files stay on your machine.

---

## 🧑‍💻 Creator

Built with a lot of coffee and a little bit of chaos by **wrench** 🔧

Telegram: [@im_wrench](https://t.me/im_wrench)

---

## 📄 License

MIT License. See [LICENSE](./LICENSE).

---

<div align="center">

### If this tool helped you, a star would make my day ⭐

</div>
