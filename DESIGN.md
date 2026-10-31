# KeepMoving · Storybook Visual Direction

## The premise

**One message. A group of friends. A familiar city becomes an adventure.**

KeepMoving should feel like an invitation to make memories with friends, rather than a horror poster, tactical military interface, or a neon SaaS dashboard.

### Visual language

- **Evening over alarm:** warm twilight, quiet streetlights, layered blue hills, and an illustrated city as the opening scene.
- **Literary editorial typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for story headlines, [Manrope](https://fonts.google.com/specimen/Manrope) for body and buttons, [DM Mono](https://fonts.google.com/specimen/DM+Mono) for subtle chapter labels and functional GPS telemetry.
- **Open, human copy:** narrative sentences rather than threatening all-caps headlines.
- **Actual gameplay remains legible:** the playful marketing site gives way to a precise, phone-readable game HUD.

### Color semantics

| Token | Color | Purpose |
| --- | --- | --- |
| Midnight | `#15233D` | Twilight hero, map/game base |
| Cream | `#F6F2EB` | Light story chapters, lettering |
| Peach | `#F6C2A5` | Invitation CTA, warmth, seeker visual |
| Sea glass | `#9BCDC6` | Hider / mystery |
| Lilac | `#9A819E` | Editorial emphasis |
| Golden hour | `#E4CF99` | Shrinking zone, warnings |

A user's role uses color **plus text and a distinct icon**: Hunters/Seekers remain warm apricot, Shadows/Hiders remain cool sea-glass. The real game backend still uses `hunter`/`shadow`.

### Chapters and interaction

1. **Prologue:** dusk-city SVG, personal story, group-chat bubble, gentle CTA.
2. **The invitation:** warm-paper editorial story, stylized neighborhood evening illustration.
3. **The chase:** 18-second simulated gameplay cinematic with pause/replay and explicit non-real-GPS disclosure.
4. **The rules:** three approachable steps grounded in game mechanics.
5. **Two sides:** interactive role-color perspectives; no change to actual role assignment.
6. **The next chapter:** working existing Create/Join flows with the same form names.

The illustrated skyline and replay are **original HTML/CSS/SVG**, not an externally hosted video or an actual gameplay recording. The page labels the replay as a simulation.

### Non-negotiables

- Keep the game engine, Supabase guest-session flow, and Vite/GitHub Pages base path working.
- Prioritize mobile performance; MapLibre is lazy-loaded only when entering an actual room.
- Respect `prefers-reduced-motion`, keyboard interaction, and readable contrast.
- No precise player GPS data in the public preview.
- Keep play confined to a safe agreed public area; never promote trespassing or risky road chases.
- If later adding a filmed 15–20s trailer, use muted `playsinline`, low bandwidth formats, a good poster, and pause when not visible.

### Potential open-source enhancement tools

- [MapLibre](https://maplibre.org/maplibre-gl-js/) for live GPS map (already in app).
- [Motion](https://motion.dev/) for optional refined text/scroll animation.
- [Three.js](https://threejs.org/) for future atmospheric web visual experiments, not needed for MVP.
- [Lucide](https://lucide.dev/) for functional HUD icons if necessary.

Avoid heavy extra dependencies purely for decorative motion. A working, delightful product is the goal.
