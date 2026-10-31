# KeepMoving: The City Becomes the Game

## Hero concept

The first fold is a cinematic piece of fictional "found footage." It combines real licensed night-city photography with **actual responsive HTML and SVG artifacts**: a chat excerpt, shrinking-zone mini-map, player position markers, match stats, and taped photo evidence. The result should feel like the beginning of a story your own friends might make.

The fake round is consistently labeled **SIMULATED MATCH** or **FICTIONAL ROUND**. No real player names, GPS coordinates, private location history, or live session data are placed on the public landing page.

### Visual tokens

| Name | Value | Role |
| --- | --- | --- |
| Asphalt | #090D10 | Base, film-like darkness |
| Chalk | #F5F4ED | Headline and copy |
| Pursuit red | #FF344E | Hunter / kinetic CTA |
| Signal green | #C7FF55 | Shadow / received GPS |
| Closing amber | #F6B947 | Shrinking-zone circle |
| Cold cyan | #61D6DE | Secondary visual signal |

- Headlines: **Barlow Condensed** italic 900; story text: **Space Grotesk**; small field labels: **IBM Plex Mono**.
- Film-noir atmosphere: contrast, photographic light, minimal animated noise.
- No generic SaaS card wall, glass gradients, pointless slow floating, or fake corporate marketing.
- Group-chat card, mini-map and stats are responsive functional DOM components, not a flattened image.
- Internal role names in the backend stay `hunter` and `shadow`; the UI can use casual descriptions.

### Photographic sources and licensing

The hero uses an Unsplash-licensed night-city photo by **Robert | Visual Diary**:
https://unsplash.com/photos/city-street-at-night-with-wet-pavement-and-lights-8KJCgpIYptY/

The supporting snapshot uses an Unsplash-licensed night-city photo by **MChe Lee**:
https://unsplash.com/photos/people-walk-on-wet-street-with-neon-lights-at-night-uxfUg7RNees

The downloaded rendition is loaded from verified Unsplash CDN IDs. They are **atmospheric stock photos**, not claims to show a particular match or location. Visual UI cards are original custom HTML/SVG.

### Game architecture unchanged

- GitHub Pages hosts Vite static frontend.
- Supabase CampusConnect instance with separate `km_` tables and `keepmoving-game` function.
- Guest sessions, GPS reveal controls, server-owned game state, tag verification and map remain.
- MapLibre is lazy-loaded only once the player enters a match.
- User-controlled permissions, foreground-location limits, consent and retention remain important.

### After initial launch

- Replace fictional visuals with **consented, privacy-safe actual gameplay footage**.
- Add opt-in session summaries and distance totals using accuracy-filtered traces.
- Build genuine team play tests before wider release.
