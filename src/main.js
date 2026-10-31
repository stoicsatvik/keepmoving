
import { createClient } from "@supabase/supabase-js";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./style.css";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = !!(url && key);
const supabase = configured ? createClient(url, key) : null;
const app = document.getElementById("app");
let roomCode = localStorage.getItem("km-room") || "";
let sessionToken = localStorage.getItem("km-session") || "";
let playerName = localStorage.getItem("km-name") || "";
let gps = null, lastLocationSent = 0, lastLocationMessage = "";
let currentState = null, lastStateTime = 0;
let map = null, selfMarker = null, revealMarkers = [];
let pollTimer = null, clockTimer = null, gpsWatch = null, gpsTimer = null, busy = false;
const esc = value => String(value ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const formatTime = secs => { const n=Math.max(0,Math.round(secs));return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0"); };
const meters = n => n >= 1000 ? (n/1000).toFixed(n%1000===0?0:1)+" km" : Math.round(n)+" m";
const status = (msg,type="info") => {
  const el=document.querySelector("#toast");if(!el)return;
  el.textContent=msg;el.className="toast "+type;el.hidden=false;
  clearTimeout(status.timer);status.timer=setTimeout(()=>{el.hidden=true},5500);
};
async function request(action, extra={}) {
  if(!configured) throw new Error("Add Supabase environment variables before playing.");
  const {data,error}=await supabase.functions.invoke("keepmoving-game", {body:{action,code:roomCode,session_token:sessionToken,...extra}});
  if(error){
    let message=error.message || "Request failed";
    try { const body=await error.context?.json();if(body?.error)message=body.error; }catch{}
    throw new Error(message);
  }
  if(data?.error) throw new Error(data.error);
  return data;
}
function home() {
  stopRoom();
  app.innerHTML=`
    <div class="landing">
      <header class="brand"><span class="brand-icon">↗</span> KEEP<span>MOVING</span><span class="version">ALPHA</span></header>
      <div class="hero">
        <p class="eyebrow">REAL WORLD. REAL CHASE.</p>
        <h1>THE CITY<br><em>IS YOUR ARENA.</em></h1>
        <p class="lead">Create a GPS-powered manhunt. Set the radius, choose your team, and survive the shrinking zone.</p>
      </div>
      <div class="setup-grid">
        <section class="panel">
          <div class="panel-heading"><span class="step">01</span><h2>Create a hunt</h2></div>
          <form id="create-form">
            <label>Your name<input name="name" maxlength="24" required placeholder="Your player name" value="${esc(playerName)}"></label>
            <div class="fields">
              <label>Radius (metres)<input name="radius" type="number" min="100" max="100000" step="100" required value="1000"></label>
              <label>Match (minutes)<input name="duration" type="number" min="5" max="180" step="1" required value="30"></label>
              <label>Head start (minutes)<input name="headstart" type="number" min="0" max="10" step="1" required value="3"></label>
              <label>Location reveal (seconds)<input name="reveal" type="number" min="30" max="600" step="30" required value="180"></label>
              <label>Zone shrink (minutes)<input name="shrink" type="number" min="1" max="30" step="1" required value="10"></label>
            </div>
            <div class="tip"><span>◎</span> Starting zone is centered on your phone's GPS. Maximum radius 100 km; walking matches work best below 2 km.</div>
            <button class="btn primary" type="submit">CREATE GAME <span>↗</span></button>
          </form>
        </section>
        <section class="panel secondary-panel">
          <div class="panel-heading"><span class="step">02</span><h2>Join friends</h2></div>
          <form id="join-form">
            <label>Your name<input name="name" maxlength="24" required placeholder="Your player name" value="${esc(playerName)}"></label>
            <label>Six-character lobby code<input class="code-input" name="code" required minlength="6" maxlength="6" placeholder="XXXXXX" autocapitalize="characters" autocomplete="off"></label>
            <button class="btn outlined" type="submit">JOIN GAME <span>→</span></button>
          </form>
          <div class="quick-rules"><h3>HOW IT WORKS</h3>
            <p><b>01.</b> Shadows get a head start.</p>
            <p><b>02.</b> Hunters see occasional GPS reveals.</p>
            <p><b>03.</b> The safe zone keeps shrinking.</p>
            <p><b>04.</b> Confirm tags to capture Shadows.</p>
            <p><b>05.</b> Survive the clock to win.</p>
          </div>
        </section>
      </div>
      <p class="disclaimer">Play only in safe, permitted public areas. Never trespass or cross traffic to chase someone. Location sharing requires consent. Keep this browser open during the match.</p>
      ${configured?"":'<div class="setup-warning">Setup required: configure Supabase credentials in <code>.env.local</code> and deploy the Edge Function (README).</div>'}
    </div>
    <div id="toast" class="toast" hidden></div>`;
  document.querySelector("#create-form").addEventListener("submit", createRoom);
  document.querySelector("#join-form").addEventListener("submit", joinRoom);
}
function rememberRoom(code,name,token) {
  roomCode=code;playerName=name;sessionToken=token;
  localStorage.setItem("km-room",code);localStorage.setItem("km-name",name);
  localStorage.setItem("km-session",token);
}
async function geolocate() {
  if(!navigator.geolocation)throw new Error("This browser does not support location.");
  return new Promise((resolve,reject)=>{
    navigator.geolocation.getCurrentPosition(p=>{
      gps={lat:p.coords.latitude,lng:p.coords.longitude,accuracy_m:p.coords.accuracy,at:Date.now()};
      resolve(gps);
    },e=>reject(new Error("Location permission needed: "+e.message)),{
      enableHighAccuracy:true,timeout:20000,maximumAge:0,
    });
  });
}
async function createRoom(event) {
  event.preventDefault();if(busy)return;
  const f=new FormData(event.target), name=String(f.get("name")||"").trim().slice(0,24);
  const radius=Number(f.get("radius")),duration=Number(f.get("duration"));
  const headstart=Number(f.get("headstart")),reveal=Number(f.get("reveal")),shrink=Number(f.get("shrink"));
  if(headstart>=duration){status("Head start must be shorter than match duration","error");return}
  if(radius>5000&&!confirm("A zone larger than 5 km may be unsafe or impractical on foot. Continue?"))return;
  busy=true;const btn=event.submitter;btn.disabled=true;
  try{
    status("Requesting precise GPS to center the game...");
    const pos=await geolocate();
    const result=await request("create",{
      name,radius_m:radius,duration_s:duration*60,headstart_s:headstart*60,
      reveal_s:reveal,shrink_s:shrink*60,lat:pos.lat,lng:pos.lng,
    });
    rememberRoom(result.code,name,result.token);await startRoom();
  }catch(e){status(e.message,"error")}
  finally{busy=false;btn.disabled=false}
}
async function joinRoom(event) {
  event.preventDefault();if(busy)return;
  const f=new FormData(event.target),name=String(f.get("name")||"").trim().slice(0,24);
  const code=String(f.get("code")||"").trim().toUpperCase();
  if(!/^[A-Z2-9]{6}$/.test(code)){status("Enter a valid six-character code","error");return}
  busy=true;const btn=event.submitter;btn.disabled=true;
  try{const result=await request("join",{code,name});rememberRoom(result.code,name,result.token);await startRoom()}
  catch(e){status(e.message,"error")}
  finally{busy=false;btn.disabled=false}
}
function stopRoom(){
  if(pollTimer)clearInterval(pollTimer);pollTimer=null;
  if(clockTimer)clearInterval(clockTimer);clockTimer=null;
  if(gpsTimer)clearInterval(gpsTimer);gpsTimer=null;
  if(gpsWatch!==null && navigator.geolocation)navigator.geolocation.clearWatch(gpsWatch);gpsWatch=null;
  if(map){map.remove();map=null}selfMarker=null;revealMarkers=[];currentState=null;
}
function leaveRoom(){
  roomCode="";sessionToken="";
  localStorage.removeItem("km-room");localStorage.removeItem("km-session");home();
}
function shell(){
  app.innerHTML=`
  <div class="game-root">
    <header class="game-header"><div class="brand"><span class="brand-icon">↗</span> KEEP<span>MOVING</span></div>
      <div class="room-head"><span class="muted">ROOM</span> <b>${esc(roomCode)}</b> <button id="copy-code" class="small-action">COPY</button></div>
      <button id="leave" class="small-action">EXIT</button>
    </header>
    <div class="game-layout">
      <section class="map-card">
        <div id="map"></div>
        <div class="map-top"><div class="chip" id="phase">LOADING</div><div class="chip" id="zone-size">ZONE --</div></div>
        <div id="zone-warning" class="zone-warning" hidden>⚠ OUTSIDE SAFE ZONE · RETURN SAFELY</div>
        <div class="map-bottom"><span id="gps-chip">● GPS STARTING</span><span class="mini-note">Keep the page open</span></div>
      </section>
      <aside class="sidebar">
        <section class="panel scoreboard"><div class="kicker">MATCH CLOCK</div><div class="clock" id="match-clock">--:--</div>
          <div class="stats-row"><div><span>STATUS</span><strong id="game-status">WAITING</strong></div>
          <div><span>NEXT REVEAL</span><strong id="next-reveal">--:--</strong></div></div>
          <div id="winner" class="winner" hidden></div>
        </section>
        <section class="panel"><div class="side-title">PLAYERS <span id="player-count"></span></div>
          <div id="players" class="players"></div><div id="start-controls"></div></section>
        <section class="panel"><div class="side-title">FIELD ACTIONS</div><div id="actions"></div></section>
        <section class="panel rules-small"><div class="side-title">SAFETY & RULES</div>
          <p>No trespassing or road chases. Pausing GPS, switching apps or locking the screen may stop updates.</p>
          <p>GPS boundary warnings aren't automatic captures. A tag needs recent GPS proximity and Shadow confirmation.</p>
        </section>
      </aside>
    </div>
  </div><div id="toast" class="toast" hidden></div>`;
  document.querySelector("#leave").onclick=leaveRoom;
  document.querySelector("#copy-code").onclick=async()=>{
    try{await navigator.clipboard.writeText(roomCode);status("Room code copied")}catch{status("Room code: "+roomCode)}
  };
}
async function startRoom(){
  stopRoom();shell();
  try{
    await refresh();startGps();pollTimer=setInterval(refresh,10000);clockTimer=setInterval(updateClock,1000);
  }catch(e){status(e.message,"error");throw e}
}
function startGps(){
  if(!navigator.geolocation){status("GPS unavailable on this browser","error");return}
  gpsWatch=navigator.geolocation.watchPosition(pos=>{
    gps={lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy_m:pos.coords.accuracy,at:Date.now()};
    updateGpsMarker();
    const now=Date.now();
    if(now-lastLocationSent>=10000){lastLocationSent=now;sendGps()}
  },err=>{
    const el=document.getElementById("gps-chip");if(el)el.textContent="● GPS ERROR";
    if(lastLocationMessage!==err.message){status("GPS: "+err.message,"error");lastLocationMessage=err.message}
  },{enableHighAccuracy:true,maximumAge:3000,timeout:20000});
  gpsTimer=setInterval(()=>{
    if(roomCode&&gps&&Date.now()-gps.at<=45000&&Date.now()-lastLocationSent>=10000){
      lastLocationSent=Date.now();sendGps()
    }
  },10000);
}
function sendGps(){
  if(!gps)return;
  request("location",{lat:gps.lat,lng:gps.lng,accuracy_m:gps.accuracy_m})
    .catch(e=>{if(lastLocationMessage!==e.message){status("GPS upload: "+e.message,"error");lastLocationMessage=e.message}});
}
async function refresh(){
  if(!roomCode||refresh.pending)return;
  refresh.pending=true;
  try{
    const data=await request("state"),prev=currentState;
    currentState=data;lastStateTime=Date.now();updateRoom();
    if(prev&&prev.game.status!==data.game.status)status("Match phase: "+data.game.status.toUpperCase());
    if(prev&&!prev.game.reveal_active&&data.game.reveal_active&&data.me.role==="hunter")status("RADAR PING! Shadows visible for 25 seconds.","alert");
    if(prev&&prev.game.zone_radius_m!==data.game.zone_radius_m)status("ZONE SHRUNK to "+meters(data.game.zone_radius_m),"alert");
  }catch(e){status("Connection: "+e.message,"error")}
  finally{refresh.pending=false}
}
function updateClock(){
  if(!currentState)return;
  const g=currentState.game,elapsed=Math.floor((Date.now()-lastStateTime)/1000);
  document.querySelector("#match-clock").textContent=formatTime(g.status==="waiting"?g.remaining_s:Math.max(0,g.remaining_s-elapsed));
  document.querySelector("#next-reveal").textContent=g.status==="hunt"?(g.reveal_active?"PING ACTIVE":formatTime(Math.max(0,(g.next_reveal_s||0)-elapsed))):"--:--";
}
function updateRoom(){
  if(!currentState)return;
  const {game,me,players,is_host,tags}=currentState;
  document.querySelector("#phase").textContent=game.status.toUpperCase();
  document.querySelector("#game-status").textContent=game.status==="headstart"?"SHADOWS HIDING":game.status==="hunt"?"HUNT LIVE":game.status.toUpperCase();
  document.querySelector("#zone-size").textContent="◎ "+meters(game.zone_radius_m);
  document.querySelector("#player-count").textContent=players.length+"/20";
  const winner=document.querySelector("#winner");winner.hidden=game.status!=="finished";
  winner.textContent=game.winner==="cancelled"?"GAME CANCELLED":game.winner?game.winner.toUpperCase()+" WIN!":"GAME ENDED";
  document.querySelector("#players").innerHTML=players.map(p=>`
    <div class="player"><div class="player-avatar ${p.role}">${p.role==="hunter"?"⌖":"◈"}</div>
      <div class="player-meta"><strong>${esc(p.name)} ${p.id===me.id?'<span class="you">(YOU)</span>':""}</strong>
      <small>${p.role.toUpperCase()}${p.captured_at?" · CAUGHT":""}</small></div>
      ${is_host&&game.status==="waiting"?`<button class="role-toggle" data-player="${p.id}" data-role="${p.role==="hunter"?"shadow":"hunter"}">SWAP</button>`:""}
    </div>`).join("");
  document.querySelectorAll(".role-toggle").forEach(el=>el.onclick=()=>act("assign",{target_id:el.dataset.player,role:el.dataset.role}));
  const startEl=document.querySelector("#start-controls");
  const hunters=players.filter(p=>p.role==="hunter").length,shadows=players.filter(p=>p.role==="shadow").length;
  startEl.innerHTML=game.status==="waiting"?`
    <div class="lobby-note">Need at least one Hunter and one Shadow. Host can swap roles.</div>
    ${is_host?`<button id="start-game" class="btn primary" ${!(hunters&&shadows&&players.length>=2)?"disabled":""}>START THE HUNT ↗</button>`:
    '<div class="waiting-note">Waiting for host to start…</div>'}`:"";
  const startButton=document.getElementById("start-game");
  if(startButton)startButton.onclick=()=>act("start");
  const a=document.querySelector("#actions");
  if(game.status==="waiting"){
    a.innerHTML=`<p class="action-note">Share code <b>${esc(roomCode)}</b> with friends. Everyone must allow GPS access.</p>`;
  }else if(game.status==="finished"){
    a.innerHTML='<p class="action-note">The game has ended. Create a new room for another round.</p>';
  }else if(me.captured_at){
    a.innerHTML='<p class="action-note">You have been captured. Spectate until the timer ends.</p>';
  }else if(me.role==="hunter"){
    const shadowsList=players.filter(p=>p.role==="shadow"&&!p.captured_at);
    a.innerHTML=`<p class="action-note">Find a Shadow in person. Ask them to confirm the capture.</p>
      <label>Tag a Shadow<select id="tag-target">${shadowsList.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></label>
      <button id="tag-button" class="btn primary" ${shadowsList.length?"":"disabled"}>REQUEST TAG</button>`;
    document.querySelector("#tag-button").onclick=()=>act("request_tag",{target_id:document.querySelector("#tag-target").value});
  }else{
    const pending=tags.filter(t=>t.shadow_player_id===me.id&&t.status==="pending"&&Date.now()-Date.parse(t.created_at)<60000);
    a.innerHTML=pending.length?pending.map(t=>{
      const hunter=players.find(p=>p.id===t.hunter_player_id);
      return `<div class="tag-request"><strong>${esc(hunter?.name||"Hunter")} requests a tag!</strong>
        <p>Only confirm if you were actually found.</p><div class="button-pair">
        <button class="btn primary tag-answer" data-id="${t.id}" data-accept="true">CONFIRM</button>
        <button class="btn outlined tag-answer" data-id="${t.id}" data-accept="false">DENY</button></div></div>`;
    }).join(""):'<p class="action-note">Stay hidden. Move safely within the zone and watch for radar pings.</p>';
    document.querySelectorAll(".tag-answer").forEach(el=>el.onclick=()=>act("respond_tag",{tag_id:el.dataset.id,accept:el.dataset.accept==="true"}));
  }
  if(is_host&&game.status!=="finished"){
    a.innerHTML+='<button id="end-game" class="small-action end-game">END MATCH</button>';
    document.querySelector("#end-game").onclick=()=>{if(confirm("End this game for everyone?"))act("finish")};
  }
  updateClock();drawMap();
}
async function act(action,data={}){
  try{await request(action,data);await refresh()}
  catch(e){status(e.message,"error")}
}
function circleGeoJSON(lat,lng,radiusM){
  const coords=[],R=6371000,lat1=lat*Math.PI/180,lng1=lng*Math.PI/180,ang=radiusM/R;
  for(let i=0;i<=96;i++){
    const bearing=i/96*2*Math.PI;
    const lat2=Math.asin(Math.sin(lat1)*Math.cos(ang)+Math.cos(lat1)*Math.sin(ang)*Math.cos(bearing));
    const lng2=lng1+Math.atan2(Math.sin(bearing)*Math.sin(ang)*Math.cos(lat1),Math.cos(ang)-Math.sin(lat1)*Math.sin(lat2));
    coords.push([((lng2*180/Math.PI+540)%360)-180,lat2*180/Math.PI]);
  }
  return {type:"FeatureCollection",features:[{type:"Feature",geometry:{type:"Polygon",coordinates:[coords]},properties:{}}]};
}
function initMap(){
  if(map||!currentState)return;
  const g=currentState.game;
  map=new maplibregl.Map({
    container:"map",
    style:{version:8,sources:{osm:{type:"raster",tiles:["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],tileSize:256,attribution:"© OpenStreetMap contributors"}},layers:[{id:"osm",type:"raster",source:"osm"}]},
    center:[g.center_lng,g.center_lat],zoom:g.radius_m>10000?8:g.radius_m>2000?12:14,attributionControl:true,
  });
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),"bottom-right");
  map.on("load",()=>{
    map.addSource("zone",{type:"geojson",data:circleGeoJSON(g.center_lat,g.center_lng,g.zone_radius_m)});
    map.addLayer({id:"zone-fill",type:"fill",source:"zone",paint:{"fill-color":"#3bf1ae","fill-opacity":0.10}});
    map.addLayer({id:"zone-line",type:"line",source:"zone",paint:{"line-color":"#3bf1ae","line-width":2.5,"line-dasharray":[4,2]}});
    const outline=circleGeoJSON(g.center_lat,g.center_lng,g.radius_m).features[0].geometry.coordinates[0];
    const bounds=outline.reduce((b,p)=>b.extend(p),new maplibregl.LngLatBounds(outline[0],outline[0]));
    map.fitBounds(bounds,{padding:46,maxZoom:15,duration:0});
    drawMap();
  });
}
function updateGpsMarker(){
  if(!gps)return;
  const chip=document.getElementById("gps-chip");if(chip)chip.textContent="● GPS ±"+Math.round(gps.accuracy_m)+"m";
  if(!map)return;
  if(!selfMarker){
    const el=document.createElement("div");el.className="self-pin";el.title="You";
    selfMarker=new maplibregl.Marker({element:el}).setLngLat([gps.lng,gps.lat]).addTo(map);
  }else selfMarker.setLngLat([gps.lng,gps.lat]);
  if(currentState){
    const g=currentState.game,d=distance(gps,{lat:g.center_lat,lng:g.center_lng});
    const outside=d>g.zone_radius_m+Math.max(15,gps.accuracy_m);
    const warn=document.getElementById("zone-warning");if(warn)warn.hidden=!outside;
  }
}
function distance(a,b){
  const R=6371000,r=Math.PI/180;
  const dlat=(b.lat-a.lat)*r,dlng=(b.lng-a.lng)*r;
  const h=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlng/2)**2;
  return R*2*Math.asin(Math.min(1,Math.sqrt(h)));
}
function drawMap(){
  if(!currentState)return;initMap();if(!map)return;
  const g=currentState.game,source=map.getSource("zone");
  if(source)source.setData(circleGeoJSON(g.center_lat,g.center_lng,g.zone_radius_m));
  updateGpsMarker();
  for(const marker of revealMarkers)marker.remove();revealMarkers=[];
  if(g.reveal_active&&currentState.me.role==="hunter"){
    for(const p of currentState.revealed){
      const div=document.createElement("div");div.className="shadow-pin";div.textContent="◈";
      div.title="Approximate Shadow GPS reveal, ±"+Math.round(p.accuracy_m)+"m";
      revealMarkers.push(new maplibregl.Marker({element:div}).setLngLat([p.lng,p.lat]).addTo(map));
    }
  }
}
home();
if(roomCode&&sessionToken&&configured){
  startRoom().catch(()=>{roomCode="";sessionToken="";localStorage.removeItem("km-room");localStorage.removeItem("km-session");home()});
}
