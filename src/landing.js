
const createRules = (playerName, esc) => `
  <form id="create-form" class="lp-form">
    <label class="lp-field">YOUR CALLSIGN
      <input name="name" maxlength="24" required autocomplete="nickname" placeholder="e.g. Ghost_07" value="${esc(playerName)}"/>
    </label>
    <div class="lp-form-row">
      <label class="lp-field">HUNT RADIUS <span>(METRES)</span>
        <input name="radius" type="number" min="100" max="100000" step="100" required value="1000" inputmode="numeric"/>
      </label>
      <label class="lp-field">GAME TIME <span>(MINUTES)</span>
        <input name="duration" type="number" min="5" max="180" step="1" required value="30" inputmode="numeric"/>
      </label>
    </div>
    <details class="lp-advanced">
      <summary>FIELD CONFIGURATION <span>+ ADVANCED RULES</span></summary>
      <div class="lp-form-row lp-advanced-grid">
        <label class="lp-field">HEAD START <span>(MIN)</span>
          <input name="headstart" type="number" min="0" max="10" step="1" required value="3" inputmode="numeric"/>
        </label>
        <label class="lp-field">RADAR PING <span>(SEC)</span>
          <input name="reveal" type="number" min="30" max="600" step="30" required value="180" inputmode="numeric"/>
        </label>
        <label class="lp-field">ZONE SHRINK <span>(MIN)</span>
          <input name="shrink" type="number" min="1" max="30" step="1" required value="10" inputmode="numeric"/>
        </label>
      </div>
      <p class="lp-advanced-note">Range: 100 m–100 km. Match: 5–180 minutes. Only the host configures these settings.</p>
    </details>
    <button type="submit" class="lp-submit lp-submit-red"><span>CREATE A HUNT</span><span aria-hidden="true">↗</span></button>
    <p class="lp-input-note">Your device's GPS sets the zone centre. Location permission required.</p>
  </form>`;

const joinRules = (playerName, esc) => `
  <form id="join-form" class="lp-form">
    <label class="lp-field">YOUR CALLSIGN
      <input name="name" maxlength="24" required autocomplete="nickname" placeholder="e.g. Ghost_07" value="${esc(playerName)}"/>
    </label>
    <label class="lp-field">ROOM ACCESS CODE
      <input class="lp-code-input" name="code" maxlength="6" minlength="6" required
             autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXXXX"/>
    </label>
    <button type="submit" class="lp-submit lp-submit-ghost"><span>ENTER THE FIELD</span><span aria-hidden="true">↗</span></button>
    <p class="lp-input-note">Get the code from your host. Everyone shares their location only during active games.</p>
  </form>`;

export function renderLanding({ playerName, configured, esc }) {
  return `
<div class="lp landing" id="top" data-preview-role="hunter">
  <div class="lp-noise" aria-hidden="true"></div>
  <header class="lp-nav">
    <a class="lp-brand" href="#top" aria-label="KeepMoving home"><span class="lp-brand-symbol">K<span>↗</span></span><span class="lp-brand-word">KEEP<span>MOVING</span><small>FIELD GAMES / VOL.01</small></span></a>
    <nav aria-label="Primary">
      <a href="#preview">THE TRAILER</a>
      <a href="#how">THE RULES</a>
      <a href="#lobby" class="lp-nav-cta">ENTER THE GAME <span aria-hidden="true">↗</span></a>
    </nav>
  </header>

  <main>
    <section class="lp-hero" aria-labelledby="lp-hero-title">
      <div class="lp-hero-meta"><span><span class="lp-live-dot"></span> REAL-WORLD MULTIPLAYER</span><span>01 / 04 &nbsp; THE FIELD IS OPEN</span></div>
      <h1 id="lp-hero-title">THE CITY<br/><span class="lp-title-outline">IS NOT</span> <em>SAFE.</em></h1>
      <div class="lp-hero-end">
        <div class="lp-hero-copy">
          <span class="lp-small-index">[ NOT ANOTHER GAME ON YOUR PHONE. ]</span>
          <p>It's a game <strong>outside</strong> your phone. Real streets. Real friends. One shrinking zone. Hunt, or make sure you're never found.</p>
        </div>
        <div class="lp-hero-links">
          <a href="#lobby" class="lp-big-cta">START THE HUNT <span aria-hidden="true">↗</span></a>
          <a href="#preview" class="lp-link-quiet">WATCH THE GAME <span aria-hidden="true">↘</span></a>
        </div>
      </div>
    </section>

    <section class="lp-preview-section" id="preview" aria-labelledby="lp-preview-heading">
      <div class="lp-section-head">
        <span class="lp-index">[ 01 ] &nbsp; A TASTE OF THE CHAOS</span>
        <span class="lp-head-detail">SIMULATED GAMEPLAY / 18-SECOND LOOP</span>
      </div>
      <div class="lp-preview-stage" data-scene="0">
        <div class="lp-preview-map" aria-hidden="true">
          <svg class="lp-city-graphic" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="lp-small-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M38 0H0V38" fill="none" stroke="#293138" stroke-width="1" opacity=".6"/>
              </pattern>
              <radialGradient id="lp-bg-glow"><stop offset="0" stop-color="#233232" stop-opacity=".78"/><stop offset="1" stop-color="#0B1116" stop-opacity="0"/></radialGradient>
            </defs>
            <rect width="1200" height="650" fill="#0B1116"/>
            <rect width="1200" height="650" fill="url(#lp-small-grid)"/>
            <ellipse cx="600" cy="270" rx="620" ry="520" fill="url(#lp-bg-glow)"/>
            <g fill="#162027" stroke="#354148" stroke-width="2" opacity=".94">
              <path d="M70 48H274V198H70Z M300 48H422V198H300Z M459 43H617V198H459Z M667 48H872V199H667Z M910 48H1150V204H910Z"/>
              <path d="M71 232H235V386H71Z M273 231H445V362H273Z M485 242H596V410H485Z M638 238H815V350H638Z M852 232H1120V388H852Z"/>
              <path d="M73 422H240V593H73Z M283 415H472V590H283Z M511 447H691V607H511Z M729 409H891V585H729Z M925 420H1140V598H925Z"/>
            </g>
            <g stroke="#50616A" stroke-width="16" stroke-linecap="round" opacity=".3">
              <path d="M0 213H1200 M0 401H1200 M251 0V650 M463 0V650 M629 0V650 M892 0V650"/>
              <path d="M0 590L650 0 M575 650L1150 0"/>
            </g>
            <g stroke="#B3C4C8" stroke-width="1.2" opacity=".18">
              <path d="M0 213H1200 M0 401H1200 M251 0V650 M463 0V650 M629 0V650 M892 0V650"/>
              <path d="M0 590L650 0 M575 650L1150 0"/>
            </g>
            <g fill="#7E9298" font-family="monospace" font-size="15" letter-spacing="3" opacity=".65">
              <text x="92" y="80">BLOCK 04</text><text x="681" y="76">NORTH CORRIDOR</text>
              <text x="300" y="261">SECTOR 08</text><text x="888" y="455">THE PASSAGE</text>
              <text x="106" y="478">PARK / 07</text><text x="550" y="488">SOUTH GRID</text>
            </g>
            <path d="M96 535 Q263 440 359 476 T654 272 T976 251" stroke="#D7E4DE" stroke-width="3" fill="none" stroke-dasharray="2 12" opacity=".27"/>
          </svg>
          <div class="lp-hud-grid"></div>
          <div class="lp-safe-zone"></div>
          <div class="lp-hunt-path"></div>
          <div class="lp-pin lp-pin-hunter"><span>⌖</span><i>HUNTER</i></div>
          <div class="lp-pin lp-pin-shadow"><span>◆</span><i>SHADOW</i></div>
          <div class="lp-radar-origin"><span></span></div>
        </div>
        <div class="lp-stage-top">
          <span class="lp-film-mark"><b class="lp-rec-dot"></b> FIELD REPLAY // 001</span>
          <span class="lp-film-coordinates">19.XX° N &nbsp; 72.XX° E &nbsp; / SIMULATED</span>
        </div>
        <div class="lp-scene-text">
          <span class="lp-scene-kicker" id="lp-scene-kicker">PHASE 01 — VANISH</span>
          <h2 id="lp-preview-heading"><span id="lp-scene-title">03:00 TO DISAPPEAR.</span></h2>
          <p id="lp-scene-description">The hunters wait. The city is yours.</p>
        </div>
        <div class="lp-stage-bottom">
          <div class="lp-game-telemetry">
            <div><span>MISSION TIME</span><b id="lp-scene-clock">29:57</b></div>
            <div><span>SAFE ZONE</span><b id="lp-scene-radius">1,000 M</b></div>
            <div><span>PLAYERS</span><b>06 / 06</b></div>
          </div>
          <span class="lp-demo-tag">DEMO / NOT LIVE GPS</span>
        </div>
        <div class="lp-playback">
          <button class="lp-player-control" type="button" id="lp-pause" aria-label="Pause simulated gameplay preview">Ⅱ</button>
          <div class="lp-timeline" role="progressbar" aria-label="Gameplay preview progress" aria-valuemin="0" aria-valuemax="18" aria-valuenow="0">
            <span id="lp-timeline-fill"></span>
          </div>
          <span id="lp-preview-time">00:00 / 00:18</span>
          <button class="lp-player-control lp-replay" type="button" id="lp-replay" aria-label="Replay simulated gameplay preview">↻</button>
        </div>
      </div>
      <div class="lp-preview-caption"><span>DESIGNED TO FEEL LIKE A HUNT.</span><span>BUILT TO BE PLAYED IN REAL LIFE. <span aria-hidden="true">↗</span></span></div>
    </section>

    <div class="lp-marquee" aria-hidden="true"><div>HUNT / HIDE / MOVE / SURVIVE / &nbsp; HUNT / HIDE / MOVE / SURVIVE / &nbsp; HUNT / HIDE / MOVE / SURVIVE /</div></div>

    <section class="lp-how" id="how">
      <div class="lp-section-head">
        <span class="lp-index">[ 02 ] &nbsp; THE RULES OF ENGAGEMENT</span>
        <span class="lp-head-detail">SIMPLE TO LEARN. IMPOSSIBLE TO FAKE.</span>
      </div>
      <h2 class="lp-section-title">THREE STEPS.<br/><em>ZERO HIDING BEHIND A SCREEN.</em></h2>
      <div class="lp-steps">
        <article class="lp-step"><span class="lp-step-num">01</span><div><h3>CLAIM YOUR TERRITORY.</h3><p>Choose the playable radius, game duration and reveal frequency. Invite your friends with one room code.</p></div><span class="lp-step-icon" aria-hidden="true">◎</span></article>
        <article class="lp-step"><span class="lp-step-num">02</span><div><h3>DISAPPEAR OR PURSUE.</h3><p>Shadows get a head start. Hunters receive brief radar reveals. The safe zone contracts over time.</p></div><span class="lp-step-icon" aria-hidden="true">⌖</span></article>
        <article class="lp-step"><span class="lp-step-num">03</span><div><h3>OUTLAST THE CLOCK.</h3><p>Hunters must find and confirm captures. If even one Shadow survives the match, the Shadows win.</p></div><span class="lp-step-icon" aria-hidden="true">↗</span></article>
      </div>
    </section>

    <section class="lp-role-section" id="roles">
      <div class="lp-section-head">
        <span class="lp-index">[ 03 ] &nbsp; TWO SIDES. ONE CITY.</span><span class="lp-head-detail">CHOOSE A SIDE TO PREVIEW ITS COLOR</span>
      </div>
      <div class="lp-role-grid">
        <button type="button" class="lp-role-card lp-role-hunter" id="lp-role-hunter" aria-pressed="true">
          <span class="lp-role-top"><span class="lp-role-bullet">01 / THE PURSUER</span><span aria-hidden="true">↗</span></span>
          <span class="lp-role-symbol" aria-hidden="true">⌖</span>
          <span class="lp-role-title">HUNTER.</span>
          <span class="lp-role-desc">Your advantage is information. Their advantage is time.</span>
          <span class="lp-role-action">PREVIEW THE HUNTER SIGNAL <span aria-hidden="true">↗</span></span>
        </button>
        <button type="button" class="lp-role-card lp-role-shadow" id="lp-role-shadow" aria-pressed="false">
          <span class="lp-role-top"><span class="lp-role-bullet">02 / THE SURVIVOR</span><span aria-hidden="true">↗</span></span>
          <span class="lp-role-symbol" aria-hidden="true">◆</span>
          <span class="lp-role-title">SHADOW.</span>
          <span class="lp-role-desc">Every second you stay hidden is a second you win.</span>
          <span class="lp-role-action">PREVIEW THE SHADOW SIGNAL <span aria-hidden="true">↗</span></span>
        </button>
      </div>
      <p class="lp-role-disclaimer">Preview changes the trailer colors only. Your actual game role is assigned in the lobby.</p>
    </section>

    <section class="lp-lobby-section" id="lobby">
      <div class="lp-section-head">
        <span class="lp-index">[ 04 ] &nbsp; ENTER THE FIELD</span><span class="lp-head-detail">NO ACCOUNT REQUIRED / UP TO 20 PLAYERS</span>
      </div>
      <div class="lp-lobby-intro"><h2>READY<br/><em>TO RUN?</em></h2><p>Set the rules. Share a code.<br/>There's no tutorial for being found.</p></div>
      <div class="lp-lobby-grid">
        <div class="lp-lobby-panel">
          <div class="lp-panel-header"><span>01 / HOST A MATCH</span><span>↗</span></div>
          <h3>START A HUNT.</h3>
          ${createRules(playerName, esc)}
        </div>
        <div class="lp-lobby-panel lp-lobby-join">
          <div class="lp-panel-header"><span>02 / JOIN A MATCH</span><span>↗</span></div>
          <h3>JOIN YOUR CREW.</h3>
          ${joinRules(playerName, esc)}
          <div class="lp-join-footer"><b>PLAY SMART.</b><p>Stay on safe public paths. No trespassing, no risky road crossings, no vehicle chases. Keep the app open for GPS.</p></div>
        </div>
      </div>
      ${configured ? "" : '<div class="lp-config-warning">This build needs a configured Supabase deployment before rooms can be created.</div>'}
    </section>
  </main>
  <footer class="lp-footer"><div class="lp-footer-logo">K<span>/</span>M</div><p>GO OUTSIDE. STAY MOVING.</p><span>© 2026 KEEP MOVING &nbsp; / &nbsp; LOCATION SHARING ONLY DURING PLAY</span></footer>
</div>
<div id="toast" class="toast" hidden></div>`;
}

const SCENES = [
 { title:"03:00 TO DISAPPEAR.", kicker:"PHASE 01 / THE HEAD START",description:"The hunters wait. The city is yours.",clock:"29:57", radius:"1,000 M",phase:0 },
 { title:"THE HUNT IS ON.",kicker:"PHASE 02 / TRACKING ENABLED",description:"The timer starts. Every corner is a decision.",clock:"26:08",radius:"1,000 M",phase:1 },
 { title:"SIGNAL DETECTED.",kicker:"PHASE 03 / RADAR REVEAL",description:"One location. Twenty-five seconds. Move.",clock:"20:31",radius:"700 M",phase:2 },
 { title:"THE ZONE IS CLOSING.",kicker:"PHASE 04 / FINAL MINUTES",description:"The city gets smaller. The stakes don't.",clock:"04:12",radius:"343 M",phase:3 },
];
const TRAILER_SECONDS = 18;
let trailerInterval = null;
let trailerElapsed = 0;
let lastFrame = 0;
let paused = false;
let sceneIndex = -1;

export function stopLanding() {
  if (trailerInterval !== null) window.clearInterval(trailerInterval);
  trailerInterval = null;
  lastFrame = 0;
  sceneIndex = -1;
  trailerElapsed = 0;
  paused = false;
}

function formatPlayback(value) {
  const seconds = Math.floor(value);
  return `00:${String(seconds).padStart(2, "0")} / 00:18`;
}

export function initLanding() {
  stopLanding();
  const root = document.querySelector(".lp");
  if (!root) return;
  const stage = root.querySelector(".lp-preview-stage");
  const progress = root.querySelector("#lp-timeline-fill");
  const bar = root.querySelector(".lp-timeline");
  const play = root.querySelector("#lp-pause");
  const replay = root.querySelector("#lp-replay");
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function update() {
    const scene = Math.min(SCENES.length-1, Math.floor(trailerElapsed / 4.5));
    if (scene !== sceneIndex) {
      sceneIndex=scene;
      const current=SCENES[scene];
      stage.dataset.scene=String(current.phase);
      root.querySelector("#lp-scene-kicker").textContent=current.kicker;
      root.querySelector("#lp-scene-title").textContent=current.title;
      root.querySelector("#lp-scene-description").textContent=current.description;
      root.querySelector("#lp-scene-clock").textContent=current.clock;
      root.querySelector("#lp-scene-radius").textContent=current.radius;
    }
    progress.style.width=(trailerElapsed/TRAILER_SECONDS*100).toFixed(2)+"%";
    bar.setAttribute("aria-valuenow",String(Math.round(trailerElapsed)));
    root.querySelector("#lp-preview-time").textContent=formatPlayback(trailerElapsed);
  }
  function setPause(next) {
    paused=next;
    stage.classList.toggle("lp-preview-paused",paused);
    play.textContent=paused?"▶":"Ⅱ";
    play.setAttribute("aria-label",paused?"Play simulated gameplay preview":"Pause simulated gameplay preview");
    lastFrame=performance.now();
  }
  root.querySelector("#lp-role-hunter").addEventListener("click",()=>setRole("hunter"));
  root.querySelector("#lp-role-shadow").addEventListener("click",()=>setRole("shadow"));
  function setRole(role) {
    root.dataset.previewRole=role;
    root.querySelector("#lp-role-hunter").setAttribute("aria-pressed",String(role==="hunter"));
    root.querySelector("#lp-role-shadow").setAttribute("aria-pressed",String(role==="shadow"));
    stage.scrollIntoView({behavior:reduced?"instant":"smooth",block:"center"});
  }
  play.addEventListener("click",()=>setPause(!paused));
  replay.addEventListener("click",()=>{
    trailerElapsed=0;sceneIndex=-1;
    stage.classList.remove("lp-preview-restart");
    void stage.offsetWidth;
    stage.classList.add("lp-preview-restart");
    update();setPause(false);
  });
  update();
  if (reduced) { setPause(true);return; }
  lastFrame=performance.now();
  trailerInterval=window.setInterval(()=>{
    if (paused || document.hidden) {lastFrame=performance.now();return;}
    const now=performance.now();
    trailerElapsed += Math.min(0.25,(now-lastFrame)/1000);
    lastFrame=now;
    if(trailerElapsed>=TRAILER_SECONDS){
      trailerElapsed=0;sceneIndex=-1;
      stage.classList.remove("lp-preview-restart");
      void stage.offsetWidth;
      stage.classList.add("lp-preview-restart");
    }
    update();
  },80);
}
