const inviteUrl = document.getElementById("invite-url");
const guestList = document.getElementById("guest-list");
const output = document.getElementById("generator-output");
const linksOutput = document.getElementById("links-output");
const entriesOutput = document.getElementById("entries-output");
const copyStatus = document.getElementById("copy-status");
const storageKey = "janny-cathy-wedding-generator";

function defaultInviteUrl() {
  return new URL("index.html", window.location.href).href;
}

function loadSavedGuestList() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && typeof saved === "object") return saved;
  } catch {
    // The generator still works if browser storage is disabled or unavailable.
  }
  return null;
}

function saveGuestList() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      inviteUrl: inviteUrl.value.trim(),
      names: guestList.value
    }));
    return true;
  } catch {
    return false;
  }
}

function removeSavedGuestList() {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Nothing else is needed when browser storage is unavailable.
  }
}

function createCode(name, seen) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "guest";
  let code = base;
  let count = 2;
  while (seen.has(code)) code = `${base}-${count++}`;
  seen.add(code);
  return code;
}

function generate({ restored = false } = {}) {
  const names = guestList.value.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  const base = inviteUrl.value.trim();
  if (!names.length || !base) {
    output.hidden = true;
    copyStatus.textContent = "Add an invitation URL and at least one guest name.";
    return;
  }

  let url;
  try { url = new URL(base); } catch {
    output.hidden = true;
    copyStatus.textContent = "Please enter a complete base URL, such as https://example.com/index.html.";
    return;
  }

  const seen = new Set();
  const records = names.map((name) => {
    const code = createCode(name, seen);
    const guestUrl = new URL(url);
    guestUrl.searchParams.set("guest", code);
    return { name, code, link: guestUrl.href };
  });

  linksOutput.textContent = records.map(({ name, link }) => `${name}\n${link}`).join("\n\n");
  entriesOutput.textContent = records.map(({ code, name }) => `"${code}": "${name.replace(/"/g, "\\\"")}",`).join("\n");
  const saved = saveGuestList();
  const status = `${records.length} personalized ${records.length === 1 ? "link" : "links"} ready.`;
  copyStatus.textContent = saved
    ? `${status} ${restored ? "Restored after refresh." : "Saved in this browser."}`
    : status;
  output.hidden = false;
}

async function copyOutput(id) {
  const value = document.getElementById(id).textContent;
  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = "Copied to your clipboard.";
  } catch {
    copyStatus.textContent = "Select and copy the text manually; your browser blocked clipboard access.";
  }
}

document.getElementById("generate").addEventListener("click", generate);
document.getElementById("clear").addEventListener("click", () => {
  guestList.value = "";
  output.hidden = true;
  removeSavedGuestList();
  copyStatus.textContent = "Guest list and generated links cleared from this browser.";
  guestList.focus();
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyOutput(button.dataset.copy));
});

const savedGuestList = loadSavedGuestList();
if (savedGuestList) {
  inviteUrl.value = savedGuestList.inviteUrl || defaultInviteUrl();
  guestList.value = savedGuestList.names || "";
  if (guestList.value.trim()) generate({ restored: true });
} else {
  inviteUrl.value = defaultInviteUrl();
  if (typeof guests !== "undefined" && Object.keys(guests).length) {
    guestList.value = Object.values(guests).join("\n");
    generate();
  }
}
