# KeepMoving

Mobile-first GPS manhunt with player-selected radius (100 m–100 km), time (5–180 min), teams, zone shrink, timed reveals, and two-sided tag confirmation.

## Stack
- Vite + vanilla JavaScript UI
- MapLibre GL JS over OpenStreetMap raster tiles
- Supabase Postgres + one Edge Function with signed random guest-session credentials
- Edge Function owns rules and restricts access to location data
- Foreground geolocation only (mobile browsers limit background updates)

## Run locally
1. Use the **CampusConnect** Supabase project for now (tables prefixed `km_`), without changing its existing schema. Anonymous Auth sign-ins are not required.
2. Apply `supabase/migrations/202611010001_keepmoving.sql` to the project.
3. Deploy the Edge Function from `supabase/functions/keepmoving-game/index.ts` via Supabase CLI:
   ```bash
   npm install
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase functions deploy keepmoving-game --no-verify-jwt
   ```
   JWT verification is deliberately disabled at the gateway because the Edge Function validates its own cryptographically random, per-player guest tokens against SHA-256 hashes. Never disable authentication inside the function. The deployment supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to it; **never** expose the service role key in Vite.
4. For local dev, copy `.env.example` to `.env.local`. Production uses `.env.production` containing only Supabase's public project URL and publishable key.
5. `npm run dev`. To play on multiple phones, deploy the Vite site to an HTTPS host (for example Vercel); HTTP phone-to-laptop geolocation normally won't work.

## Gameplay rules (MVP)
- Host creates a room, shares the 6-letter room code, and assigns roles (one Hunter and one Shadow minimum).
- Hunters cannot begin hunting until the configured Shadow head start ends.
- Current Shadow coordinates **are not sent** to Hunters except during short scheduled reveal windows (25 sec every reveal interval); a reveal shows a coarse position circle only when the Shadow's GPS fix is recent.
- Host sets map center to their current location. The circular zone starts at the chosen radius; after head start it shrinks by 30% per interval, with a minimum radius of 10% of the initial radius or 100 m, whichever is larger.
- Exiting the zone triggers an alert, **not automatic elimination**, because GPS and roads are imperfect.
- Hunter can request a tag when near a Shadow (server checks recent, reasonably accurate GPS); Shadow must approve within 60 seconds. Never physically chase someone into unsafe areas.
- Hunters win when every Shadow is tagged; Shadows win if at least one remains after the timer.
- If a player closes their browser, GPS stops updating; their location becomes stale. Keep the app open and foregrounded. Android/iOS browsers do not guarantee background tracking.
- Coordinates are removed on match completion. Schedule the cleanup script to remove abandoned games; never use this for covert tracking.

## Limits
- Radius 100–100,000 m; duration 300–10,800 s; headstart 0–600 s; reveal 30–600 s; shrink interval 60–1,800 s; max 20 players/room.
- Foreground location updates targeted every 10 sec; game state polls every 10 sec.
- This MVP uses direct client polling rather than Realtime subscriptions to keep installation simple.
- No accounts, paid services, background GPS, geofenced street routing, or push notifications in v1.
- **Privacy:** Exact GPS positions are deleted when a game finishes or the host ends it. Abandoned games still need a scheduled retention cleanup; use `scripts/retention-cleanup.sql` every day.

## Next before public launch
- Schedule the included purge script for abandoned/old games; add spam/rate limits, admin moderation, map tile provider compliant with actual traffic, server-side transactional game transitions, and stronger capture validation.
- Location is sensitive information. Get explicit consent from all players and set a safe play boundary.

## Authentication & privacy
This build deliberately avoids Supabase Auth configuration. It issues a random 256-bit per-room guest token per player, stores only a SHA-256 hash in `km_players`, and requires that token for room state and writes. The token is stored on the player's device in localStorage. Do not share tokens. Only share room codes. This is a friends-only alpha and needs IP/session rate limiting before wide release.
