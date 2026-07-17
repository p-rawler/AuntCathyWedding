const inviteUrl = document.getElementById("invite-url");
const guestList = document.getElementById("guest-list");
const output = document.getElementById("generator-output");
const linksOutput = document.getElementById("links-output");
const entriesOutput = document.getElementById("entries-output");
const copyStatus = document.getElementById("copy-status");

inviteUrl.value = new URL("index.html", window.location.href).href;

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

function generate() {
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
  copyStatus.textContent = `${records.length} personalized ${records.length === 1 ? "link" : "links"} ready.`;
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
  copyStatus.textContent = "";
  guestList.focus();
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyOutput(button.dataset.copy));
});
