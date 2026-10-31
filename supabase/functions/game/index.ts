import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const MAX_PLAYERS = 20;
const GPS_TTL_MS = 45_000;
const REVEAL_WINDOW_S = 25;

type RecordAny = Record<string, any>;
function bad(message: string, status = 400): never {
  throw Object.assign(new Error(message), { status });
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
function intRange(value: unknown, min: number, max: number, field: string) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) bad(field + " must be " + min + "–" + max);
  return n;
}
function coordinate(value: unknown, min: number, max: number, name: string) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) bad("Invalid " + name);
  return n;
}
function queryError(result: RecordAny) {
  if (result.error) bad("Database error: " + result.error.message, 500);
  return result.data;
}
function haversine(a: RecordAny, b: RecordAny) {
  const toRad = Math.PI / 180;
  const p1 = a.lat * toRad, p2 = b.lat * toRad;
  const dp = (b.lat - a.lat) * toRad, dl = (b.lng - a.lng) * toRad;
  const h = Math.sin(dp/2)**2 + Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 6371000 * 2 * Math.asin(Math.min(1,Math.sqrt(h)));
}
function clock(game: RecordAny, now = Date.now()) {
  if (game.status === "waiting") return { phase: "waiting", remaining_s: game.duration_s, elapsed_s: 0, hunt_elapsed_s: 0, zone_radius_m: game.radius_m, reveal_active: false, next_reveal_s: null };
  const elapsed = Math.max(0, Math.floor((now - Date.parse(game.started_at || game.created_at))/1000));
  const huntElapsed = Math.max(0, elapsed - game.headstart_s);
  const shrinkCount = Math.floor(huntElapsed / game.shrink_s);
  const minimum = Math.min(game.radius_m, Math.max(100, Math.round(game.radius_m * 0.1)));
  const zone = Math.max(minimum, Math.round(game.radius_m * Math.pow(0.7, shrinkCount)));
  const remaining = Math.max(0, game.duration_s - elapsed);
  const tick = Math.floor(huntElapsed/game.reveal_s);
  const reveal = game.status === "active" && elapsed >= game.headstart_s && tick >= 1 &&
    huntElapsed % game.reveal_s < REVEAL_WINDOW_S && remaining > 0;
  return {
    phase: game.status === "finished" || remaining === 0 ? "finished" : elapsed < game.headstart_s ? "headstart" : "hunt",
    remaining_s: remaining,
    elapsed_s: elapsed,
    hunt_elapsed_s: huntElapsed,
    zone_radius_m: zone,
    reveal_active: reveal,
    next_reveal_s: elapsed < game.headstart_s ? game.headstart_s - elapsed + game.reveal_s :
      game.reveal_s - (huntElapsed % game.reveal_s),
  };
}
function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const bearer = req.headers.get("Authorization") || "";
    if (!bearer.startsWith("Bearer ")) bad("Sign in required", 401);
    const { data: { user }, error: authErr } = await admin.auth.getUser(bearer.slice(7));
    if (authErr || !user) bad("Invalid session", 401);

    const payload = await req.json();
    const action = String(payload.action || "");
    if (action === "create") {
      const name = String(payload.name || "").trim().slice(0,24);
      if (!name) bad("Enter your name");
      const radius_m = intRange(payload.radius_m, 100, 100000, "Radius (metres)");
      const duration_s = intRange(payload.duration_s, 300, 10800, "Duration (seconds)");
      const headstart_s = intRange(payload.headstart_s, 0, 600, "Head start (seconds)");
      const reveal_s = intRange(payload.reveal_s, 30, 600, "Reveal interval (seconds)");
      const shrink_s = intRange(payload.shrink_s, 60, 1800, "Shrink interval (seconds)");
      if (headstart_s >= duration_s) bad("Head start must be shorter than the match");
      const center_lat = coordinate(payload.lat, -90, 90, "latitude");
      const center_lng = coordinate(payload.lng, -180, 180, "longitude");
      let game: RecordAny | null = null;
      for (let i=0;i<4;i++) {
        const result = await admin.from("games").insert({
          code: randomCode(), host_user_id: user.id,
          center_lat, center_lng, radius_m, duration_s, headstart_s, reveal_s, shrink_s,
        }).select().single();
        if (!result.error) { game = result.data; break; }
        if (result.error.code !== "23505") bad(result.error.message, 500);
      }
      if (!game) bad("Could not create a unique room", 500);
      queryError(await admin.from("players").insert({
        game_id: game.id, user_id: user.id, name, role: "hunter",
      }));
      return json({ code: game.code });
    }

    const code = String(payload.code || "").trim().toUpperCase();
    if (!/^[A-Z2-9]{6}$/.test(code)) bad("Enter a valid six-character room code");
    const game = queryError(await admin.from("games").select("*").eq("code", code).maybeSingle());
    if (!game) bad("Room not found", 404);

    if (action === "join") {
      const name = String(payload.name || "").trim().slice(0,24);
      if (!name) bad("Enter your name");
      const existing = queryError(await admin.from("players").select("id").eq("game_id",game.id).eq("user_id",user.id).maybeSingle());
      if (existing) return json({ code });
      if (game.status !== "waiting") bad("Game already started");
      const count = queryError(await admin.from("players").select("id",{count:"exact",head:true}).eq("game_id",game.id));
      // Count is returned as a separate property by Supabase; fetch below to avoid a stale count.
      const roster = queryError(await admin.from("players").select("id").eq("game_id",game.id));
      if (roster.length >= MAX_PLAYERS) bad("Room is full (20 players)");
      queryError(await admin.from("players").insert({ game_id: game.id, user_id: user.id, name, role:"shadow" }));
      return json({ code });
    }

    const me = queryError(await admin.from("players").select("*").eq("game_id",game.id).eq("user_id",user.id).maybeSingle());
    if (!me) bad("Join the lobby first", 403);
    const isHost = game.host_user_id === user.id;

    if (action === "assign") {
      if (!isHost || game.status !== "waiting") bad("Only the host may assign roles before the match", 403);
      const role = String(payload.role || "");
      if (role !== "hunter" && role !== "shadow") bad("Invalid role");
      const target = queryError(await admin.from("players").select("id").eq("game_id",game.id).eq("id",payload.target_id).maybeSingle());
      if (!target) bad("Player not in room");
      queryError(await admin.from("players").update({role}).eq("id",target.id));
      return json({ ok:true });
    }

    if (action === "start") {
      if (!isHost || game.status !== "waiting") bad("Only host can start a waiting room", 403);
      const roster = queryError(await admin.from("players").select("role").eq("game_id",game.id));
      if (roster.length < 2 || !roster.some((p:RecordAny)=>p.role==="hunter") || !roster.some((p:RecordAny)=>p.role==="shadow"))
        bad("Need at least one Hunter and one Shadow");
      const started_at = new Date().toISOString();
      queryError(await admin.from("games").update({status:"active",started_at}).eq("id",game.id).eq("status","waiting"));
      return json({ok:true});
    }

    if (action === "location") {
      if (game.status === "finished" || me.captured_at) return json({ok:true});
      const lat = coordinate(payload.lat,-90,90,"latitude");
      const lng = coordinate(payload.lng,-180,180,"longitude");
      const accuracy_m = coordinate(payload.accuracy_m,0,5000,"GPS accuracy");
      queryError(await admin.from("positions").upsert({player_id:me.id,lat,lng,accuracy_m,updated_at:new Date().toISOString()}));
      return json({ok:true});
    }

    if (action === "request_tag") {
      const c = clock(game);
      if (c.phase !== "hunt" || me.role !== "hunter" || me.captured_at) bad("Only active Hunters can request a tag");
      const target = queryError(await admin.from("players").select("*").eq("id",payload.target_id).eq("game_id",game.id).maybeSingle());
      if (!target || target.role !== "shadow" || target.captured_at) bad("Target must be an uncaptured Shadow");
      const pos = queryError(await admin.from("positions").select("*").in("player_id",[me.id,target.id]));
      const a = pos.find((p:RecordAny)=>p.player_id===me.id), b = pos.find((p:RecordAny)=>p.player_id===target.id);
      if (!a || !b || [a,b].some((p:RecordAny)=>Date.now()-Date.parse(p.updated_at)>GPS_TTL_MS))
        bad("Both players need recent GPS fixes. Keep both phones open.");
      if (a.accuracy_m > 35 || b.accuracy_m > 35)
        bad("GPS accuracy too low for proximity tagging. Move to open space.");
      if (haversine(a,b) > Math.min(80,20+a.accuracy_m+b.accuracy_m))
        bad("Not close enough to request a tag");
      const pending = queryError(await admin.from("tag_requests").select("id,created_at").eq("game_id",game.id).eq("hunter_player_id",me.id).eq("shadow_player_id",target.id).eq("status","pending").order("created_at",{ascending:false}).limit(1));
      if (pending.some((t:RecordAny)=>Date.now()-Date.parse(t.created_at)<60000)) bad("A tag request is already pending");
      queryError(await admin.from("tag_requests").insert({game_id:game.id,hunter_player_id:me.id,shadow_player_id:target.id}));
      return json({ok:true});
    }

    if (action === "respond_tag") {
      const tag = queryError(await admin.from("tag_requests").select("*").eq("id",payload.tag_id).eq("game_id",game.id).maybeSingle());
      if (!tag || tag.shadow_player_id !== me.id || tag.status !== "pending" || me.captured_at)
        bad("Not an active tag request",403);
      if (Date.now()-Date.parse(tag.created_at)>60000) bad("Tag request expired");
      const accept = payload.accept === true;
      queryError(await admin.from("tag_requests").update({
        status:accept?"accepted":"declined",resolved_at:new Date().toISOString(),
      }).eq("id",tag.id).eq("status","pending"));
      if (accept) queryError(await admin.from("players").update({captured_at:new Date().toISOString()}).eq("id",me.id).is("captured_at",null));
      return json({ok:true});
    }

    if (action === "finish") {
      if (!isHost) bad("Only host may end the match",403);
      if (game.status !== "finished") queryError(await admin.from("games").update({
        status:"finished",winner:"cancelled",finished_at:new Date().toISOString(),
      }).eq("id",game.id));
      const rosterForPurge = queryError(await admin.from("players").select("id").eq("game_id",game.id));
      if (rosterForPurge.length) queryError(await admin.from("positions").delete().in("player_id",rosterForPurge.map((p:RecordAny)=>p.id)));
      return json({ok:true});
    }

    if (action !== "state") bad("Unknown action",404);
    const roster = queryError(await admin.from("players").select("id,name,role,captured_at,joined_at").eq("game_id",game.id).order("joined_at"));
    let state = clock(game);
    let winner = game.winner;
    if (game.status === "active") {
      const uncaptured = roster.filter((p:RecordAny)=>p.role==="shadow"&&!p.captured_at);
      if (!uncaptured.length || state.remaining_s===0) {
        winner = uncaptured.length ? "shadows" : "hunters";
        queryError(await admin.from("games").update({
          status:"finished",winner,finished_at:new Date().toISOString(),
        }).eq("id",game.id).eq("status","active"));
        state = {...state,phase:"finished",reveal_active:false};
        const idsToPurge = roster.map((p:RecordAny)=>p.id);
        if (idsToPurge.length) queryError(await admin.from("positions").delete().in("player_id",idsToPurge));
      }
    }
    const myPosition = queryError(await admin.from("positions").select("lat,lng,accuracy_m,updated_at").eq("player_id",me.id).maybeSingle());
    let revealed: RecordAny[] = [];
    // DO NOT fetch/send other players' GPS except during the explicit reveal window.
    if (me.role==="hunter" && state.reveal_active) {
      const alive = roster.filter((p:RecordAny)=>p.role==="shadow"&&!p.captured_at).map((p:RecordAny)=>p.id);
      if (alive.length) {
        const positions = queryError(await admin.from("positions").select("player_id,lat,lng,accuracy_m,updated_at").in("player_id",alive));
        revealed = positions.filter((p:RecordAny)=>Date.now()-Date.parse(p.updated_at)<GPS_TTL_MS)
          .map((p:RecordAny)=>({
            player_id:p.player_id,
            lat:Math.round(p.lat*10000)/10000,
            lng:Math.round(p.lng*10000)/10000,
            accuracy_m:Math.max(15,Math.round(p.accuracy_m)),
            age_s:Math.round((Date.now()-Date.parse(p.updated_at))/1000),
          }));
      }
    }
    const tags = queryError(await admin.from("tag_requests").select("id,hunter_player_id,shadow_player_id,status,created_at")
      .eq("game_id",game.id).or('hunter_player_id.eq.'+me.id+',shadow_player_id.eq.'+me.id)
      .order("created_at",{ascending:false}).limit(12));
    return json({
      game: { code:game.code,status:state.phase,winner,
        center_lat:game.center_lat,center_lng:game.center_lng,radius_m:game.radius_m,
        duration_s:game.duration_s,headstart_s:game.headstart_s,reveal_s:game.reveal_s,shrink_s:game.shrink_s,
        remaining_s:state.remaining_s,elapsed_s:state.elapsed_s,zone_radius_m:state.zone_radius_m,
        reveal_active:state.reveal_active,next_reveal_s:state.next_reveal_s
      },
      is_host:isHost,
      me:{id:me.id,name:me.name,role:me.role,captured_at:me.captured_at},
      players:roster,
      my_position:myPosition,
      revealed,
      tags:tags.filter((t:RecordAny)=>Date.now()-Date.parse(t.created_at)<180000),
      server_time:new Date().toISOString(),
    });
  } catch (error) {
    return json({error: error instanceof Error ? error.message : "Unexpected error"},(error as RecordAny)?.status || 500);
  }
});
