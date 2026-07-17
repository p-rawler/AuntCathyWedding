const wedding = {
  startsAt: new Date("2026-07-25T17:00:00+03:00"),
  couple: "Janny Ruteraho and Catherine Wannyana",
  rsvpNumber: "256700000000", // Replace with the real WhatsApp number, digits only.
  rsvpDisplay: "+256 700 000 000", // Replace this at the same time as rsvpNumber.
  ceremonyLocation: "St Denis Konge Catholic Parish",
  receptionLocation: "Chocolate Hotel, Konge"
};

function guestFromUrl() {
  const code = new URLSearchParams(window.location.search).get("guest");
  return (code && guests[code]) || "Guest";
}

function setGuestDetails() {
  const guest = guestFromUrl();
  document.getElementById("guest-name").textContent = guest;
  document.title = `${guest} | Janny & Catherine's Wedding Invitation`;

  const message = `Hello, this is ${guest}. I am responding to the wedding invitation for Janny Ruteraho and Catherine Wannyana on 25 July 2026. My RSVP is: `;
  document.getElementById("rsvp-link").href = `https://wa.me/${wedding.rsvpNumber}?text=${encodeURIComponent(message)}`;
  document.getElementById("rsvp-contact").textContent = `RSVP via WhatsApp: ${wedding.rsvpDisplay}`;
}

function updateCountdown() {
  const remaining = wedding.startsAt.getTime() - Date.now();
  const countdown = document.getElementById("countdown");

  if (remaining <= 0) {
    countdown.innerHTML = "<span class=\"countdown-complete\"><b>Today</b><small>The celebration is here</small></span>";
    return;
  }

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const parts = {
    days: Math.floor(remaining / day),
    hours: Math.floor((remaining % day) / hour),
    minutes: Math.floor((remaining % hour) / minute),
    seconds: Math.floor((remaining % minute) / second)
  };

  Object.entries(parts).forEach(([key, value]) => {
    document.getElementById(key).textContent = String(value).padStart(2, "0");
  });
}

function downloadCalendarEvent() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Janny and Catherine Wedding//EN",
    "BEGIN:VEVENT",
    `UID:janny-catherine-wedding-20260725@invitation`,
    `DTSTAMP:${stamp}`,
    "DTSTART:20260725T170000",
    "DTEND:20260725T220000",
    `SUMMARY:Wedding of ${wedding.couple}`,
    `LOCATION:${wedding.ceremonyLocation}; reception at ${wedding.receptionLocation}`,
    "DESCRIPTION:Marriage ceremony at 5:00 p.m. followed by dinner and reception at 6:00 p.m.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const file = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "janny-catherine-wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function setupCardDialog() {
  const dialog = document.getElementById("card-dialog");
  document.querySelectorAll("[data-card-open]").forEach((button) => {
    button.addEventListener("click", () => dialog.showModal());
  });
  document.querySelector("[data-card-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

setGuestDetails();
updateCountdown();
setInterval(updateCountdown, 1000);
document.getElementById("calendar-button").addEventListener("click", downloadCalendarEvent);
setupCardDialog();
