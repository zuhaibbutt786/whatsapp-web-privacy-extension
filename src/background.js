// Background service worker for SafeWAChat

chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.get(null, (items) => {
    const defaults = {
      enabled: true,
      blurMessages: true,
      blurPreviews: true,
      blurMedia: true,
      blurProfilePics: true,
      timedAutoBlur: true,
      autoBlurDelay: 3, // seconds
      selectiveContacts: [], // array of contact names to always blur
      neverBlurContacts: [], // array of contact names to never blur
      screenShareProtection: true,
      blurStyle: "gaussian", // gaussian | pixelate | solid
      blurIntensity: 8,
      incognitoMode: false,
      hideBadges: true
    };

    const toSet = {};
    for (const [key, value] of Object.entries(defaults)) {
      if (items[key] === undefined) {
        toSet[key] = value;
      }
    }
    if (Object.keys(toSet).length > 0) {
      chrome.storage.sync.set(toSet);
    }
  });
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-privacy") {
    chrome.storage.sync.get("enabled", (data) => {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState }, () => {
        // Notify content scripts
        chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, {
              type: "TOGGLE_PRIVACY",
              enabled: newState
            }).catch(() => {});
          });
        });
      });
    });
  }
});

// Relay storage changes to content scripts
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "SETTINGS_CHANGED",
          changes
        }).catch(() => {});
      });
    });
  }
});
