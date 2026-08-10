# SafeWAChat

**SafeWAChat** – Privacy for WhatsApp Web

> Blurs your messages and content on WhatsApp Web until you hover over them. Built for privacy in public spaces, offices, cafés, and screen-sharing situations.

![Version](https://img.shields.io/badge/version-1.0.0-00a884)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Live repo:** https://github.com/zuhaibbutt786/whatsapp-web-privacy-extension

## Features

### Core Blur Options
- **All messages in chat** – Blurs every message in the open conversation
- **Last messages preview** – Blurs the preview text in the left sidebar
- **Media preview** – Blurs images, videos, stickers and other media
- **Profile pictures** – Blurs all avatars

### Advanced Features
- **Timed Auto-Blur** – Automatically re-blurs content after a configurable delay (default 3 s) when the mouse leaves
- **Selective Contact Blur** – Force-blur specific contacts/groups, or mark others as “never blur”
- **Screen-Share Protection** – Extra protection when the window loses focus / during presentations
- **Blur Strength & Style Control** – Choose Gaussian blur, pixelation-style, or solid overlay + adjustable intensity
- **Incognito Session Mode** – Stronger privacy mode that also hides unread badges and notification indicators

### Quick Toggle
- Keyboard shortcut **Alt + X** (customizable in `chrome://extensions/shortcuts`)
- One-click master switch in the popup

## Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/zuhaibbutt786/whatsapp-web-privacy-extension.git
   cd whatsapp-web-privacy-extension
   ```
2. Open Chrome / Edge / Brave → go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select this project folder
5. Open [web.whatsapp.com](https://web.whatsapp.com) — the extension activates automatically

> **Icons note:** Placeholder icons are included. Replace the PNGs in the `icons/` folder with your own designs (16/32/48/128 px) anytime. The extension functions fully even with the current placeholders.

## Usage

1. Click the extension icon to open the settings popup
2. Toggle the features you want → click **Save Settings**
3. Hover any blurred element to reveal it temporarily
4. Use **Alt + X** for a quick global toggle

## Privacy

This extension runs entirely locally. It does **not** collect, store, or transmit any of your messages, contacts, or personal data. All settings are stored in Chrome’s local `storage.sync`.

## License

MIT – see [LICENSE](LICENSE)
