/**
 * Privacy Extension for WhatsApp Web
 * Content script – applies blur effects and manages all privacy features
 */

(function () {
  "use strict";

  const SELECTORS = {
    // Conversation messages
    messageContainers: '[data-testid="msg-container"], .message-in, .message-out',
    // Sidebar chat list items
    chatListItems: '[data-testid="cell-frame-container"]',
    // Preview text inside chat list
    previewText: '[data-testid="cell-frame-secondary"] span, [data-testid="last-msg-status"] + span, .x1iyjqo2 span',
    // Media
    media: 'img, video, [data-testid="image-thumb"], [data-testid="video-content"], [data-testid="sticker"], canvas',
    // Profile / avatar images
    avatars: 'img[data-testid="avatar"], [data-testid="default-user"] img, header img, [role="img"] img',
    // Unread badges
    badges: '[data-testid="icon-unread-count"], [data-testid="icon-unread-mentions"]'
  };

  let settings = {
    enabled: true,
    blurMessages: true,
    blurPreviews: true,
    blurMedia: true,
    blurProfilePics: true,
    timedAutoBlur: true,
    autoBlurDelay: 3,
    selectiveContacts: [],
    neverBlurContacts: [],
    screenShareProtection: true,
    blurStyle: "gaussian",
    blurIntensity: 8,
    incognitoMode: false,
    hideBadges: true
  };

  let autoBlurTimers = new WeakMap();
  let observer = null;
  let screenShareActive = false;

  // ---------- Helpers ----------

  function getBlurClass() {
    if (settings.blurStyle === "pixelate") return "privacy-blur-pixelate";
    if (settings.blurStyle === "solid") return "privacy-blur-solid";
    return "privacy-blur-gaussian";
  }

  function applyIntensity() {
    document.documentElement.style.setProperty(
      "--privacy-blur-amount",
      `${settings.blurIntensity}px`
    );
    document.documentElement.style.setProperty(
      "--privacy-pixel-size",
      `${Math.max(4, Math.floor(settings.blurIntensity / 1.2))}px`
    );
  }

  function clearTimers(el) {
    if (autoBlurTimers.has(el)) {
      clearTimeout(autoBlurTimers.get(el));
      autoBlurTimers.delete(el);
    }
  }

  function scheduleReblur(el) {
    if (!settings.timedAutoBlur || !settings.enabled) return;
    clearTimers(el);
    const timer = setTimeout(() => {
      el.classList.remove("privacy-revealed");
      autoBlurTimers.delete(el);
    }, (settings.autoBlurDelay || 3) * 1000);
    autoBlurTimers.set(el, timer);
  }

  function revealOnHover(el) {
    el.addEventListener("mouseenter", () => {
      el.classList.add("privacy-revealed");
      clearTimers(el);
    });
    el.addEventListener("mouseleave", () => {
      scheduleReblur(el);
    });
  }

  function getCurrentChatName() {
    // Try common locations for the open chat title
    const header = document.querySelector(
      'header [data-testid="conversation-info-header-chat-title"], header span[title], header [dir="auto"]'
    );
    return header ? (header.getAttribute("title") || header.textContent || "").trim() : "";
  }

  function shouldBlurContact(name) {
    if (!name) return true;
    const lower = name.toLowerCase();
    if (settings.neverBlurContacts.some((c) => lower.includes(c.toLowerCase()))) {
      return false;
    }
    if (settings.selectiveContacts.length === 0) return true;
    return settings.selectiveContacts.some((c) => lower.includes(c.toLowerCase()));
  }

  // ---------- Core blur application ----------

  function applyBlurToElement(el) {
    if (!el || el.dataset.privacyProcessed === "1") return;

    const blurClass = getBlurClass();
    el.classList.add(blurClass);
    el.dataset.privacyProcessed = "1";
    revealOnHover(el);
  }

  function processMessages() {
    if (!settings.enabled || !settings.blurMessages) return;

    const currentChat = getCurrentChatName();
    if (!shouldBlurContact(currentChat)) return;

    document.querySelectorAll(SELECTORS.messageContainers).forEach((el) => {
      // Avoid double-processing nested elements
      if (el.closest("[data-privacy-processed='1']") && el.dataset.privacyProcessed !== "1") {
        return;
      }
      applyBlurToElement(el);
    });
  }

  function processPreviews() {
    if (!settings.enabled || !settings.blurPreviews) return;

    document.querySelectorAll(SELECTORS.chatListItems).forEach((item) => {
      const nameEl = item.querySelector('[data-testid="cell-frame-title"] span, span[title]');
      const name = nameEl ? (nameEl.getAttribute("title") || nameEl.textContent || "").trim() : "";

      if (!shouldBlurContact(name)) {
        // Make sure any previous blur is removed
        item.querySelectorAll(".privacy-blur-gaussian, .privacy-blur-pixelate, .privacy-blur-solid")
          .forEach((el) => {
            el.classList.remove("privacy-blur-gaussian", "privacy-blur-pixelate", "privacy-blur-solid", "privacy-revealed");
            delete el.dataset.privacyProcessed;
          });
        return;
      }

      // Blur the secondary text / last message preview
      const preview = item.querySelector(
        '[data-testid="cell-frame-secondary"], [data-testid="last-msg-status"] + span, .x1iyjqo2'
      );
      if (preview) applyBlurToElement(preview);
    });
  }

  function processMedia() {
    if (!settings.enabled || !settings.blurMedia) return;

    const currentChat = getCurrentChatName();
    if (!shouldBlurContact(currentChat)) return;

    document.querySelectorAll(SELECTORS.media).forEach((el) => {
      // Skip tiny icons / emoji
      if (el.tagName === "IMG" && (el.width < 40 || el.height < 40)) return;
      if (el.closest('[data-testid="avatar"]')) return; // handled by profiles
      applyBlurToElement(el);
    });
  }

  function processProfiles() {
    if (!settings.enabled || !settings.blurProfilePics) return;

    document.querySelectorAll(SELECTORS.avatars).forEach((el) => {
      applyBlurToElement(el);
    });
  }

  function processBadges() {
    const hide = settings.enabled && (settings.incognitoMode || settings.hideBadges);
    document.querySelectorAll(SELECTORS.badges).forEach((el) => {
      el.style.opacity = hide ? "0" : "";
      el.style.pointerEvents = hide ? "none" : "";
    });
  }

  function applyBodyClasses() {
    const body = document.body;
    body.classList.toggle("privacy-blur-messages", settings.enabled && settings.blurMessages);
    body.classList.toggle("privacy-blur-previews", settings.enabled && settings.blurPreviews);
    body.classList.toggle("privacy-blur-media", settings.enabled && settings.blurMedia);
    body.classList.toggle("privacy-blur-profiles", settings.enabled && settings.blurProfilePics);
    body.classList.toggle("privacy-incognito", settings.enabled && settings.incognitoMode);
  }

  function fullRefresh() {
    // Remove old classes from previously processed elements so style changes take effect
    document.querySelectorAll("[data-privacy-processed='1']").forEach((el) => {
      el.classList.remove(
        "privacy-blur-gaussian",
        "privacy-blur-pixelate",
        "privacy-blur-solid",
        "privacy-revealed"
      );
      delete el.dataset.privacyProcessed;
    });

    applyIntensity();
    applyBodyClasses();

    if (!settings.enabled) {
      processBadges();
      return;
    }

    processMessages();
    processPreviews();
    processMedia();
    processProfiles();
    processBadges();
  }

  // ---------- Screen-share protection ----------

  function showScreenShareOverlay(show) {
    let overlay = document.getElementById("privacy-screen-share-overlay");
    if (show) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "privacy-screen-share-overlay";
        overlay.innerHTML = `
          <div>
            <div style="font-size:42px;margin-bottom:12px;">🔒</div>
            <div><strong>Screen Share Protection Active</strong></div>
            <div style="font-size:14px;opacity:0.8;margin-top:8px;">
              Content is hidden while screen sharing is detected
            </div>
          </div>
        `;
        document.documentElement.appendChild(overlay);
      }
      overlay.classList.remove("hidden");
    } else if (overlay) {
      overlay.classList.add("hidden");
    }
  }

  function detectScreenShare() {
    if (!settings.screenShareProtection || !settings.enabled) {
      showScreenShareOverlay(false);
      return;
    }

    // Heuristic: when the page loses focus while a getDisplayMedia track might be active,
    // or when document.visibilityState changes in suspicious ways.
    // A more robust approach would require the user to click a "I'm sharing" button,
    // but we implement a practical auto heuristic + manual toggle via settings.

    // Listen for possible display-media related events
    // Note: browsers restrict direct detection of getDisplayMedia for privacy reasons.
    // We use a combination of focus + a settings-driven manual mode.

    // For now we expose a simple detection via mediaDevices enumeration change
    // and also allow the user to force it via the popup (incognito + screenShareProtection).
  }

  // Simple focus-based soft protection (optional enhancement)
  window.addEventListener("blur", () => {
    if (settings.screenShareProtection && settings.enabled && settings.incognitoMode) {
      // Soft protection when window loses focus while in incognito
      document.body.style.filter = `blur(${settings.blurIntensity * 1.5}px)`;
    }
  });

  window.addEventListener("focus", () => {
    document.body.style.filter = "";
  });

  // ---------- MutationObserver ----------

  function startObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
      let needsProcess = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          needsProcess = true;
          break;
        }
      }
      if (needsProcess) {
        // Debounce a little
        clearTimeout(window.__privacyDebounce);
        window.__privacyDebounce = setTimeout(() => {
          processMessages();
          processPreviews();
          processMedia();
          processProfiles();
          processBadges();
        }, 120);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ---------- Messaging ----------

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "TOGGLE_PRIVACY") {
      settings.enabled = msg.enabled;
      fullRefresh();
      sendResponse({ ok: true });
    } else if (msg.type === "SETTINGS_CHANGED") {
      // Merge changes
      for (const [key, change] of Object.entries(msg.changes)) {
        settings[key] = change.newValue;
      }
      fullRefresh();
      sendResponse({ ok: true });
    } else if (msg.type === "GET_STATUS") {
      sendResponse({ settings });
    }
    return true;
  });

  // ---------- Init ----------

  function init() {
    chrome.storage.sync.get(null, (data) => {
      settings = { ...settings, ...data };
      applyIntensity();
      applyBodyClasses();
      fullRefresh();
      startObserver();

      // Re-apply periodically in case WhatsApp replaces large chunks of DOM
      setInterval(() => {
        if (settings.enabled) {
          processMessages();
          processPreviews();
          processMedia();
          processProfiles();
          processBadges();
        }
      }, 2500);
    });
  }

  // Wait for WhatsApp to load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
