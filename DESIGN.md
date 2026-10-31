# KeepMoving / Field File V3

## Creative direction

One screen, one city, one story. The landing page uses **five beats** to show how a fictional match evolves: invite → head start → radar reveal → closing zone → last minute. Each act drives chat messages, map signals, player movement, zone boundary, sample game clock and story copy. This is real animation of UI state, not a video or artificial motion. There are pause, replay and act-selection controls.

### Visual invariants
- Asphalt black `#0B0D10`, charcoal `#15191D`, off-white `#F1EEE8`.
- Hunter red `#FF3B4F`, Shadow lime `#C7FF4D`, boundary amber `#F5B342`.
- Barlow Condensed for high-contrast headings, Space Grotesk for prose, IBM Plex Mono for time/map telemetry.
- Sharp corners, consistent line widths, functional color semantics and consistent typography across **marketing and active match**.
- No stock art, AI-generated photos, purple gradients, fake reviews, fabricated popularity counters, cursor trails or decorative scroll choreography.
- All demo records are **fictional and explicitly labeled**, never sold as real live match activity.

### Experience
1. Intro: **ONE MESSAGE. EVERYONE MOVES.** Real-world multiplayer premise and the primary Create CTA.
2. One functional sample replay (25 seconds, auto-plays when in viewport, pauses when hidden; can choose steps manually).
3. Three concise rules explaining the actual game.
4. Two visually differentiated roles (Hunter vs Shadow).
5. Operational Create and Join forms, explicit GPS/location consent.
6. Privacy and Terms in the footer and match HUD.

### Function and accessibility
- Existing Supabase game data, room token, GPS permissions, team roles, tagging and game engine remain in `src/main.js`.
- Static replay markup is SVG and HTML. The sample does not send or expose any user location.
- Animation stops when offscreen, page hidden, or browser requests reduced motion.
- Step selection, replay and pause controls are standard keyboard accessible buttons.
- Mobile layout collapses map/chat vertically; stage controls become a horizontal overflow strip.
- Vite compiles under `/keepmoving/`; `public/privacy.html` and `public/terms.html` are copied to GitHub Pages.

### Production gaps
- Complete end-to-end two-phone test of round creation and capture.
- Verify automated cleanup of abandoned rooms and metadata; the app currently purges individual positions when a game ends.
- Implement abuse/rate limits and a confidential privacy support channel before wider public release.
- Further accessibility testing outdoors on actual phones.
