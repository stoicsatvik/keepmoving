# KeepMoving

Mobile-first GPS manhunt with player-selected radius (100 m–100 km), time (5–180 min), teams, zone shrink, timed reveals, and two-sided tag confirmation.

## Stack
- Vite + vanilla JavaScript UI
- MapLibre GL JS over OpenStreetMap raster tiles
- Supabase anonymous auth + Postgres + one Edge Function
- Edge Function owns rules and restricts access to location data
- Foreground geolocation only (mobile browsers limit background updates)

## Run locally
1. Create a Supabase project. In **Authentication → Providers → Anonymous**, enable anonymous sign-ins.
2. Run `supabase/migrations/202611010001_keepmoving.sql` in the SQL Editor.
3. Deploy the Edge Function from `supabase/functions/game/index.ts` via Supabase CLI:
   ```bash
   npm install
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase functions deploy game
   ```
   Make sure JWT verification is enabled for this function. The deployment supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to it; **never** expose the service role key in Vite.
4. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
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
- Coordinates remain on the server until removed. Do not use this for covert tracking.

## Limits
- Radius 100–100,000 m; duration 300–10,800 s; headstart 0–600 s; reveal 30–600 s; shrink interval 60–1,800 s; max 20 players/room.
- Foreground location updates targeted every 10 sec; game state polls every 5 sec.
- This MVP uses direct client polling rather than Realtime subscriptions to keep installation simple.
- No accounts, paid services, background GPS, geofenced street routing, or push notifications in v1.
- **Privacy:** The MVP does not yet automatically delete expired game coordinates. Run a retention cleanup before opening it beyond a trusted test group.

## Next before public launch
- Scheduled purge of finished games and GPS coordinates, spam/rate limits, admin moderation, map tile provider compliant with actual traffic, server-side transactional game transitions, and stronger capture validation.
- Location is sensitive information. Get explicit consent from all players and set a safe play boundary.
