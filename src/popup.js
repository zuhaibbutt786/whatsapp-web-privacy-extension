const DEFAULTS = {
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

const ids = [
  "enabled",
  "blurMessages",
  "blurPreviews",
  "blurMedia",
  "blurProfilePics",
  "timedAutoBlur",
  "autoBlurDelay",
  "screenShareProtection",
  "incognitoMode",
  "hideBadges",
  "blurIntensity"
];

function load() {
  chrome.storage.sync.get(DEFAULTS, (data) => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.type === "checkbox") {
        el.checked = !!data[id];
      } else {
        el.value = data[id];
      }
    });

    // Radio
    const styleRadio = document.querySelector(
      `input[name="blurStyle"][value="${data.blurStyle || "gaussian"}"]`
    );
    if (styleRadio) styleRadio.checked = true;

    // Arrays → comma strings
    document.getElementById("selectiveContacts").value = (
      data.selectiveContacts || []
    ).join(", ");
    document.getElementById("neverBlurContacts").value = (
      data.neverBlurContacts || []
    ).join(", ");

    document.getElementById("intensityValue").textContent =
      (data.blurIntensity || 8) + "px";
  });
}

function parseList(str) {
  return (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function save() {
  const data = {};
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") {
      data[id] = el.checked;
    } else if (el.type === "number" || el.type === "range") {
      data[id] = Number(el.value);
    } else {
      data[id] = el.value;
    }
  });

  const styleEl = document.querySelector('input[name="blurStyle"]:checked');
  data.blurStyle = styleEl ? styleEl.value : "gaussian";

  data.selectiveContacts = parseList(
    document.getElementById("selectiveContacts").value
  );
  data.neverBlurContacts = parseList(
    document.getElementById("neverBlurContacts").value
  );

  chrome.storage.sync.set(data, () => {
    const status = document.getElementById("status");
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1800);
  });
}

document.getElementById("saveBtn").addEventListener("click", save);

document.getElementById("blurIntensity").addEventListener("input", (e) => {
  document.getElementById("intensityValue").textContent = e.target.value + "px";
});

// Live toggle of master switch
document.getElementById("enabled").addEventListener("change", (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked });
});

load();
