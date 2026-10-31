# KeepMoving / Visual Direction 02

> **The city is not safe.** Real-world multiplayer manhunt, presented like a premium game rather than a dashboard.

## Reference direction

This is an original design language informed by high-end editorial web design and interactive experiences (including the user's Ascenta Studio reference), not a clone of anyone else's site.

- Oversized Barlow Condensed typography, small monospace telemetry, sharp architectural grids.
- Neutral black, charcoal, and bone-white foundation.
- Motion that teaches the game rather than moving simply for decoration.
- Treat the live game as a field instrument, not a general-purpose SaaS product.
- Avoid card walls, stock illustrations, glassmorphism, arbitrary gradients, and scroll hijacking.

## Semantic palette

| Token | Hex | Meaning |
| --- | --- | --- |
| Ink | `#0B0D0F` | Dark base, map |
| Bone | `#EEEAE3` | Primary content |
| Hunter | `#FF5757` | Tracking, danger, pursuit |
| Shadow | `#B9F47D` | Escape, survival, stealth |
| Zone | `#E9B969` | Boundary / shrink warnings |
| Muted | `#9FA5A4` | Supplemental telemetry |

**Never rely on color alone.** Use HUNTER / SHADOW / ZONE labels and distinct shapes/icons as well. Maintain clear contrast outdoors.

## Site sequence

1. **Hero** — immediate brand statement and clear Start the Hunt action.
2. **Cinematic replay** — simulated map, tracking, radar and contracting zone over 18 seconds; pause/replay; no real GPS displayed.
3. **Rules** — three clear steps, not a wall of marketing copy.
4. **Two sides** — Hunter and Shadow color selector (trailer preview only, actual roles assigned by host).
5. **Lobby** — functional existing create/join forms, no login required.

## Design / engineering choices

- The current preview is a **live HTML/CSS/SVG animation**, not an encoded MP4. It is clearly marked simulated. This keeps the first paint lightweight and avoids pretending we have recorded match footage.
- When we have real gameplay footage, replace or augment it with a 15–20 second muted, looped, mobile-friendly WebM/MP4 trailer and a static poster image. Use `autoplay muted loop playsinline preload="metadata"`, provide controls, and pause video when out of view.
- Keep motion transform/opacity-based; honor `prefers-reduced-motion`. No automatic sound.
- Keep actual gameplay GPS and backend session model untouched by landing-page changes.
- Do not ship real-player coordinates into the public preview.
- Respect tile provider usage limits before any large public launch.

## Open-source tools

| Tool | When to use | Notes |
| --- | --- | --- |
| [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/) | Interactive gameplay map | Already integrated |
| [Motion](https://motion.dev/) | Stagger, choreographed typography, scroll-linked animation | MIT; optional next polish |
| [Three.js](https://threejs.org/) | Future optional 3D map/atmosphere | MIT; avoid on low-end phones |
| [Lenis](https://lenis.darkroom.engineering/) | Optional controlled scroll smoothing | Not necessary in MVP; avoid hijacking touch gestures |
| [Lucide](https://lucide.dev/) | Clean semantic HUD icons | ISC |
| [GSAP](https://gsap.com/) | Complex scene timeline / ScrollTrigger | Free for many uses but uses its own standard license, not MIT |
| [SVG + CSS](https://developer.mozilla.org/en-US/docs/Web/SVG) | Cinematic replay, radar and zone sequences | Already integrated; no extra runtime dependency |

**Distance statistics, travel histories, routes, and leaderboards** are deliberately deferred until the core game is reliable. Later distance totals should use GPS quality filtering and avoid permanent raw-location retention.
