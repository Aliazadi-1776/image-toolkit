<div align="center">

# 🖼️ Image Toolkit

### A fast, local-first desktop app for converting, resizing, compressing, cropping, and cleaning image metadata — without hiding the real tools behind the UI.

<img src="./docs/screenshot/home.png" alt="Image Toolkit Screenshot" width="900"/>

<br/>

[![Made with Tauri](https://img.shields.io/badge/Made%20with-Tauri-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-Backend-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

[فارسی](./README.fa.md) · [TODO](./TODO.md) · [Repository](https://github.com/Aliazadi-1776/image-toolkit)

</div>

---

## ✨ What is Image Toolkit?

**Image Toolkit** is a local-first desktop image utility for people who process many images and still want full control over what happens behind the interface.

It is not an online converter, and it is not a black box.  
It is a clean desktop GUI built on top of real command-line tools like **ImageMagick**, **cwebp**, **avifenc**, and **ExifTool**.

You select images, choose output formats, set quality, resize rules, crop settings, metadata options, and the app handles the processing locally.

> Clean UI on top. Real tools underneath.

---

## ⚡ Why it exists

Most image converters are either too heavy, too online, or too hidden.

Image Toolkit was built to be:

- local-first
- transparent
- batch-friendly
- practical for real image workflows
- usable as a desktop app on Linux and Windows
- powered by trusted CLI tools

---

## 🧰 Features

- Batch image conversion
- Per-image output settings
- Per-image crop
- Resize controls
- Compression controls
- WebP output
- AVIF output
- PNG, JPEG, TIFF, BMP, GIF, and ICO support
- Metadata cleanup
- Basic metadata writing
- Queue-based processing
- Per-file progress
- Processing logs
- Command preview
- Bundled tool status check
- Linux and Windows builds
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

## 🧪 Tools behind the app

| Tool | Used for |
|---|---|
| **ImageMagick** | general conversion, resize, crop, format handling |
| **cwebp** | WebP encoding |
| **avifenc** | AVIF encoding |
| **ExifTool** | metadata writing and cleanup |

The app tries to find tools in this order:

1. Bundled Tauri resources
2. Local development `src-tauri/vendor` folder
3. System `PATH`

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
