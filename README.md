# David & Melissa: 15 Years (26 Nov 2011 – 26 Nov 2026)

A static site for reliving the wedding day: a hero with a live counter, a **Relive the day** slideshow (auto-plays all 19 photos in order), the day told in five chapters, a photo viewer (arrow keys / swipe).

## Edit it
Open `script.js` and change the block at the top:
- `CONFIG` — names, wedding date/time, slideshow speed, hero background photos
- `CHAPTERS` — chapter titles, the little intro lines, and each photo's title and caption

To add a photo: drop it in `images/` and add a line to a chapter. Resize photos to about 1600px wide first.

## Preview locally
Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `anniversary`).
2. Upload everything in this folder, including `images/`.
3. Go to **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then Save.
4. After a minute it's live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Privacy note
GitHub Pages sites are public to anyone with the link (and can be found by search engines). The site shows names and wedding photos, including children. If that's a concern, add `<meta name="robots" content="noindex">` inside `<head>` in `index.html` and only share the link with family.

## Notes
- The counter counts **down** to the 15th anniversary until 26 Nov 2026 00:00 (the visitor's local time), then counts up from it.
