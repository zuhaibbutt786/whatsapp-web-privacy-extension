# Privacy Extension for WhatsApp™ Web

> Blurs your messages and content on WhatsApp Web until you hover over them. Built for privacy in public spaces, offices, cafés, and screen-sharing situations.

![Version](https://img.shields.io/badge/version-1.0.0-00a884)
![Manifest](https://img.shields.io/badge/manifest-v3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

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

1. Clone this repository or download the ZIP
2. Open Chrome / Edge / Brave and go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder
5. Open [web.whatsapp.com](https://web.whatsapp.com) and enjoy privacy

## Usage

1. Click the extension icon to open the settings popup
2. Toggle the features you need
3. Hover any blurred element to reveal it temporarily
4. Press **Alt + X** anytime to instantly enable/disable all effects

## Privacy

This extension:
- Does **not** collect any information about you or your messages
- Does **not** send data to any external server
- Only uses `chrome.storage.sync` to save your preferences
- Only runs on `https://web.whatsapp.com/*`

## Project Structure

```
whatsapp-web-privacy-extension/
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── background.js
│   ├── content.js
│   ├── content.css
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   └── options.html
└── README.md
```

## Development Notes

WhatsApp Web frequently changes its DOM. The content script uses resilient `data-testid` selectors where possible and a `MutationObserver` + periodic refresh to keep blurs applied.

If something stops working after a WhatsApp update, the most common fix is updating the selectors in `src/content.js`.

## License

MIT

---

**Disclaimer**: This is an unofficial extension and is not affiliated with, endorsed by, or sponsored by WhatsApp or Meta.
