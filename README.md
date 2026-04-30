# ChatAI Dashboard

[![Release](https://img.shields.io/github/v/release/SomeGuru/chatai-dashboard?style=flat-square&color=38bdf8)](https://github.com/SomeGuru/chatai-dashboard/releases/latest)
[![License](https://img.shields.io/github/license/SomeGuru/chatai-dashboard?style=flat-square&color=818cf8)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-34d399?style=flat-square)](https://github.com/SomeGuru/chatai-dashboard/releases/latest)
[![Built with Electron](https://img.shields.io/badge/built%20with-Electron-47848f?style=flat-square&logo=electron)](https://www.electronjs.org)

> **Your gateway to every major AI model — in one professional desktop application.**

ChatAI Dashboard is a free, open-source Electron app that puts 12 AI services in a sleek, unified interface. Switch between ChatGPT, Claude, Gemini, DeepSeek, Grok, and more with a single click — no browser tabs, no context switching.

Created by **Mike Larios** — [IT2Innovations](https://www.thelarios.com) / TheLarios Designs

---

## Features

- **AI Tray** — All 12 AI services docked at the top for instant one-click access
- **In-App Webviews** — Each AI loads inside the app with its own persistent session
- **Suno + DeepSeek Split Screen** — Side-by-side with a draggable divider
- **Dashboard Return** — Close any AI and return to the launcher instantly
- **Credential Vault** — AES-256-GCM encrypted local store, passphrase-locked
- **Smart Autofill** — Fills login forms automatically; React/Vue input bypass built in
- **OAuth Assist** — Floating credential panel for Google/Microsoft SSO pages
- **Multi-Account Picker** — Multiple accounts for one service? Pick which to fill
- **Update System** — Background check + in-app panel with direct download links
- **Labels Toggle** — Show/hide AI names in the tray
- **Glassmorphism UI** — Professional navy/slate dark theme
- **Window State Memory** — Remembers size, position, and maximized state

---

## AI Services

| Service | Provider | Special |
|---------|----------|---------|
| ChatGPT | OpenAI | |
| Claude | Anthropic | |
| Gemini | Google | |
| DeepSeek | DeepSeek AI | Split Screen with Suno |
| Grok | xAI | |
| Copilot | Microsoft | |
| Meta AI | Meta | |
| NotebookLM | Google | |
| Perplexity | Perplexity AI | |
| Poe | Quora | |
| Qwen | Alibaba (chat.qwen.ai) | |
| Suno | Suno AI | Split Screen with DeepSeek |

---

## Download

**[Get the latest release](https://github.com/SomeGuru/chatai-dashboard/releases/latest)**

| Platform | File |
|----------|------|
| Windows | `ChatAI Dashboard Setup x.x.x.exe` — NSIS installer |
| Windows | `ChatAI-Dashboard-x.x.x-Portable.exe` — No install |
| Linux | `ChatAI-Dashboard-x.x.x.AppImage` — Universal |
| Linux | `ChatAI-Dashboard-x.x.x.deb` — Debian/Ubuntu |

**Windows:** Run the installer. SmartScreen may warn (app is unsigned — click More info > Run anyway).

**Linux AppImage:**
```bash
chmod +x ChatAI-Dashboard-*.AppImage && ./ChatAI-Dashboard-*.AppImage
```

---

## Credential Vault

Stored locally only — never transmitted anywhere.

| OS | Path |
|----|------|
| Windows | `%APPDATA%\chatai-dashboard\vault.enc` |
| Linux | `~/.config/chatai-dashboard/vault.enc` |

Encryption: AES-256-GCM + PBKDF2-SHA256 (210,000 iterations). Passphrase is never stored.

---

## Build from Source

```bash
git clone https://github.com/SomeGuru/chatai-dashboard.git
cd chatai-dashboard
npm install
npm start           # dev mode
npm run build:win   # Windows builds
npm run build:linux # Linux builds
```

---

## Changelog

### v2.2.0
- Credential Vault autofill with React/Vue-compatible native input bypass
- Fill Credentials toolbar button with green indicator
- Multi-account credential picker
- OAuth/SSO floating assist panel with copy buttons
- Fill status strip with real-time feedback

### v2.1.0
- Embedded logos for 8 AI services
- Fixed Qwen URL to chat.qwen.ai
- Added Copilot and Suno

### v2.0.0
- Full redesign: glassmorphism navy/slate theme
- Custom frameless titlebar with traffic-light controls
- Persistent per-service webview sessions
- Suno + DeepSeek split-screen
- AES-256-GCM credential vault
- Window state persistence

---

## Legal

All AI service logos and trademarks belong to their respective owners. This project is not affiliated with or endorsed by any AI provider.

(c) 2026 IT2Innovations / TheLarios Designs. [MIT License](LICENSE).
