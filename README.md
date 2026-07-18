# Janny & Cathy Wedding Invitation

A polished, responsive static wedding invitation inspired by the supplied ivory, antique-gold, floral printed card. It includes personalized guest greetings, countdown, schedule, maps, a WhatsApp RSVP action, an iCalendar download, and a guest-link generator.

## Run locally

Open `index.html` in a browser. For the most reliable testing experience, serve the folder with any simple local static server, then open the address it provides.

For a personalized preview, add a guest code to the address:

```text
index.html?guest=gideon-kalanzi
```

If no code is present, or the code is not in `guests.js`, the invitation says `Guest`.

## Update wedding settings

In `site.js`, update the `wedding` object before sharing the site:

- `rsvpNumber` — WhatsApp number in international digits only (no `+`, spaces, or dashes).
- `rsvpDisplay` — the friendly version of that number shown to guests.
- ceremony and reception details, if anything changes.

The event date, times, couple names, and venues currently come from the supplied invitation card:

- Marriage ceremony: 25 July 2026, 5:00 p.m., St Denis Konge Catholic Parish
- Dinner and reception: 25 July 2026, 6:00 p.m., Chocolate Hotel, Konge

## Add guests manually

Open `guests.js` and add a code-to-name entry inside the `guests` object:

```js
"gideon-kalanzi": "Gideon Kalanzi",
"aisha-namusoke": "Aisha Namusoke",
```

Then share a link such as:

```text
https://your-site.example/index.html?guest=aisha-namusoke
```

Codes should be lowercase and use hyphens instead of spaces.

## Generate many guest links

1. Open `generator.html` in the hosted site or locally.
2. Enter the final address for `index.html` in **Base invitation URL**. On a hosted site it may be prefilled correctly.
3. Paste one guest name per line, then select **Generate guest links**.
4. Copy the personalized URLs to share and copy the generated entries into the `guests` object in `guests.js`.

The generator makes clean lowercase codes and adds `-2`, `-3`, and so on if two names would make the same code.

## Host as a static site

Upload all files together to any static host (such as Netlify, Cloudflare Pages, Vercel static hosting, or shared web hosting). Keep `InvitationCard.jpeg` in the same folder as `index.html`, because the site loads it by that filename.

## Host on GitHub Pages

1. Create a GitHub repository and upload all files in this folder to its root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch containing the site (usually `main`) and the `/ (root)` folder, then save.
5. GitHub will show your public site address. Use that complete `index.html` address in `generator.html` when creating guest links.

## Privacy note

This is a static site. Names stored in `guests.js` are downloaded by every visitor and can be viewed by someone who inspects the site files. Do not put private phone numbers, addresses, RSVP decisions, or other sensitive information in that file. Use only names you are comfortable making visible to anyone with the invitation URL.
