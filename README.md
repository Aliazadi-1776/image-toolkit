# Image Toolkit

<p align="center">
  <strong>A transparent desktop GUI for professional image conversion and batch optimization.</strong>
</p>

<p align="center">
  Built with <strong>Tauri v2</strong>, <strong>Rust</strong>, <strong>React</strong>, <strong>TypeScript</strong>, <strong>Vite</strong>, <strong>Tailwind CSS</strong>, and powered by trusted CLI tools like <strong>ImageMagick</strong>, <strong>cwebp</strong>, and <strong>avifenc</strong>.
</p>

<p align="center">
  <a href="./README.fa.md">فارسی</a>
  ·
  <a href="./docs/TECHNICAL.md">Technical Notes</a>
  ·
  <a href="#build-from-source">Build from Source</a>
  ·
  <a href="#release-builds">Release Builds</a>
</p>

---

## Why Image Toolkit?

Image Toolkit is designed for people who need a clean desktop interface for image processing without hiding what happens under the hood.

It does **not** invent a custom image engine.  
It orchestrates mature command-line tools and shows the exact command that will run.

That means:

- No hidden processing
- No vendor lock-in
- No cloud upload
- No mystery conversion pipeline
- Every GUI option maps to real CLI arguments

---

## Highlights

- Batch image conversion
- Single file, multiple files, folder input, and drag & drop
- Output to same folder, custom folder, or overwrite mode
- Format conversion:
  - WebP
  - AVIF
  - PNG
  - JPEG
  - TIFF
  - BMP
  - GIF
  - ICO
- Resize options
- Quality control
- Lossy and lossless workflow support
- Metadata stripping
- Metadata writing
- Command preview
- Queue-based processing
- Per-file progress
- Run logs
- Bundled tool status panel
- Cross-platform packaging:
  - Linux `.deb`
  - Linux `.AppImage`
  - Windows `.exe` installer through NSIS

---

## Screenshots

> Add screenshots after publishing the first release.

```text
docs/screenshots/
├── home.png
├── command-preview.png
├── queue-progress.png
└── bundled-tools.png
```

Example Markdown:

```md
![Image Toolkit Home](docs/screenshots/home.png)
```

---

## Built With

| Layer | Technology |
|---|---|
| Desktop Shell | Tauri v2 |
| Backend | Rust |
| Frontend | React |
| Language | TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Native Dialogs | Tauri Dialog Plugin |
| Image Engine | ImageMagick, cwebp, avifenc |

---

## CLI Tools

Image Toolkit uses external CLI tools internally.

| Tool | Purpose |
|---|---|
| ImageMagick `magick` | Main conversion, resizing, metadata, format handling |
| WebP `cwebp` | WebP encoding workflow |
| libavif `avifenc` | AVIF encoding workflow |

The application can resolve tools from:

1. Bundled resources
2. Development vendor folder
3. System PATH fallback

---

## Project Structure

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

## Clone the Source

```bash
git clone https://github.com/YOUR_USERNAME/image-toolkit.git
cd image-toolkit
npm install
```

Replace `YOUR_USERNAME` with your GitHub username or organization.

---

## Development

Run the app in development mode:

```bash
npm run tauri dev
```

Do not run only:

```bash
npm run dev
```

The frontend may load, but the Tauri backend, native dialogs, queue events, and tool execution will not work correctly outside the Tauri runtime.

---

## Build from Source

### Linux

```bash
npm run build
npm run tauri build -- --bundles deb,appimage
```

Output:

```text
src-tauri/target/release/bundle/
```

### Windows from Windows

```powershell
npm install
npm run tauri build -- --bundles nsis
```

Output:

```text
src-tauri\target\release\bundle\nsis\
```

### Windows from Linux

This project can also produce a Windows NSIS installer from Linux using `cargo-xwin`.

Install the required tools first:

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

Output:

```text
src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```

---

## Vendor Tools

The release build can bundle portable CLI tools.

Expected Linux layout:

```text
src-tauri/vendor/linux-x64/
├── avifenc
├── cwebp
├── lib/
└── imagemagick/
    ├── AppRun
    └── usr/
```

Expected Windows layout:

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

For a cleaner public repository, you may choose not to commit heavy third-party binaries directly. A common approach is:

- Keep source code in Git
- Keep binaries in GitHub Releases or Git LFS
- Provide a `scripts/prepare-vendor-*` setup script later

More details are available in [Technical Notes](./docs/TECHNICAL.md).

---

## Release Builds

Recommended release artifacts:

```text
Linux:
- image-toolkit_0.1.0_amd64.deb
- Image Toolkit_0.1.0_amd64.AppImage

Windows:
- Image Toolkit_0.1.0_x64-setup.exe
```

---

## Privacy

Image Toolkit is local-first.

- No cloud upload
- No account required
- No telemetry by default
- Files are processed on the user’s machine

---

## License

This repository should include a project license before public release.

Suggested options:

- MIT
- Apache-2.0
- GPL-3.0

Third-party tools have their own licenses. Keep notices in:

```text
src-tauri/vendor/THIRD_PARTY_NOTICES/
```

---

## Credits

Built by **ViraPeak**.

Website: [virapeak.ir](https://virapeak.ir)

---

## Roadmap

- Preset manager
- Better AVIF-specific controls
- Dedicated WebP encoder panel
- Drag-and-drop output folders
- Advanced naming templates
- Multi-language UI
- Auto-update support
- macOS build
- GitHub Actions release pipeline
