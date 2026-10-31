import { renderUrbanHero } from "./urban-hero.js";

const createRules = (playerName, esc) => `
  <form id="create-form" class="lp-form">
    <label class="lp-field">YOUR NAME
      <input name="name" maxlength="24" required autocomplete="nickname" placeholder="What should we call you?" value="${esc(playerName)}"/>
    </label>
    <div class="lp-form-row">
      <label class="lp-field">PLAY AREA RADIUS <span>(METRES)</span>
        <input name="radius" type="number" min="100" max="100000" step="100" required value="1000" inputmode="numeric"/>
      </label>
      <label class="lp-field">ROUND LENGTH <span>(MINUTES)</span>
        <input name="duration" type="number" min="5" max="180" step="1" required value="30" inputmode="numeric"/>
      </label>
    </div>
    <details class="lp-advanced">
      <summary>PERSONALISE THE GAME <span>+ OPTIONAL SETTINGS</span></summary>
      <div class="lp-form-row lp-advanced-grid">
        <label class="lp-field">TIME TO HIDE <span>(MIN)</span>
          <input name="headstart" type="number" min="0" max="10" step="1" required value="3" inputmode="numeric"/>
        </label>
        <label class="lp-field">LOCATION HINT <span>(SEC)</span>
          <input name="reveal" type="number" min="30" max="600" step="30" required value="180" inputmode="numeric"/>
        </label>
        <label class="lp-field">ZONE CHANGES <span>(MIN)</span>
          <input name="shrink" type="number" min="1" max="30" step="1" required value="10" inputmode="numeric"/>
        </label>
      </div>
      <p class="lp-advanced-note">Range: 100 m–100 km. Match: 5–180 minutes. Only the host configures these settings.</p>
    </details>
    <button type="submit" class="lp-submit lp-submit-red"><span>CREATE YOUR GAME</span><span aria-hidden="true">↗</span></button>
    <p class="lp-input-note">Your location sets the centre of the play area. Location permission is required.</p>
  </form>`;

const joinRules = (playerName, esc) => `
  <form id="join-form" class="lp-form">
    <label class="lp-field">YOUR NAME
      <input name="name" maxlength="24" required autocomplete="nickname" placeholder="What should we call you?" value="${esc(playerName)}"/>
    </label>
    <label class="lp-field">FRIEND'S ROOM CODE
      <input class="lp-code-input" name="code" maxlength="6" minlength="6" required
             autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="XXXXXX"/>
    </label>
    <button type="submit" class="lp-submit lp-submit-ghost"><span>JOIN THEIR GAME</span><span aria-hidden="true">↗</span></button>
    <p class="lp-input-note">Ask a friend for their room code. Location sharing is only for the game.</p>
  </form>`;

export function renderLanding({playerName,configured,esc}){
return `
<div class="lp landing lp-story" id="top" data-preview-role="hunter">
  <header class="lp-nav">
    <a class="lp-brand" href="#top" aria-label="KeepMoving homepage">
      <span class="lp-brand-mark">k<span>m</span><i>.</i></span>
      <span class="lp-brand-word">keepmoving<small>A game for the outside</small></span>
    </a>
    <nav aria-label="Primary">
      <a href="#story">The story</a>
      <a href="#preview">See it happen</a>
      <a href="#how">How to play</a>
      <a class="lp-nav-cta" href="#lobby">Play with friends <span aria-hidden="true">↗</span></a>
    </nav>
  </header>
  <main>
    ${renderUrbanHero()}

    <section class="lp-story-section" id="story" aria-labelledby="lp-story-title">
      <div class="lp-story-label">Chapter one <span> / </span> The invitation</div>
      <div class="lp-story-grid">
        <div class="lp-story-copy">
          <h2 id="lp-story-title">Remember when <em>getting lost</em> was the whole point?</h2>
          <p>Those evenings when nobody wanted to go home. When every shortcut felt like a discovery and every corner held a little surprise.</p>
          <p>KeepMoving brings that feeling back. Your neighbourhood becomes the board. Your friends become the story. Your legs do the rest.</p>
          <a class="lp-text-link" href="#preview">Take a look inside the game <span aria-hidden="true">↗</span></a>
        </div>
        <div class="lp-story-scene">
          <div class="lp-story-scene-top">AN EVENING, SOMEWHERE IN YOUR CITY <span>✷</span></div>
          <div class="lp-story-photo-art" aria-hidden="true">
             <div class="lp-photo-sun"></div><div class="lp-photo-block one"></div><div class="lp-photo-block two"></div><div class="lp-photo-block three"></div>
             <div class="lp-photo-road"></div><div class="lp-photo-people"><span></span><span></span><span></span></div>
          </div>
          <p>The best memories don't happen on a screen.</p>
          <small>They happen on the way somewhere.</small>
        </div>
      </div>
    </section>

    <section class="lp-preview-section" id="preview" aria-labelledby="lp-preview-heading">
      <div class="lp-section-head">
        <span class="lp-index">Chapter two <span class="lp-sep">/</span> The chase</span>
        <span class="lp-head-detail">A LITTLE PREVIEW · SIMULATED GAMEPLAY</span>
      </div>
      <div class="lp-preview-intro">
        <h2>Now imagine <em>this.</em></h2>
        <p>Three minutes to disappear. A city full of places to hide. And a friend who knows you a little too well.</p>
      </div>
      <div class="lp-preview-stage" data-scene="0">
        <div class="lp-preview-map" aria-hidden="true">
          <svg class="lp-city-graphic" viewBox="0 0 1200 650" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="lp-small-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M38 0H0V38" fill="none" stroke="#7B89A4" stroke-width="1" opacity=".22"/>
              </pattern>
              <radialGradient id="lp-bg-glow"><stop offset="0" stop-color="#667A9E" stop-opacity=".4"/><stop offset="1" stop-color="#101B32" stop-opacity="0"/></radialGradient>
            </defs>
            <rect width="1200" height="650" fill="#15243D"/>
            <rect width="1200" height="650" fill="url(#lp-small-grid)"/>
            <ellipse cx="600" cy="270" rx="620" ry="520" fill="url(#lp-bg-glow)"/>
            <g fill="#253650" stroke="#536780" stroke-width="2" opacity=".9">
              <path d="M70 48H274V198H70Z M300 48H422V198H300Z M459 43H617V198H459Z M667 48H872V199H667Z M910 48H1150V204H910Z"/>
              <path d="M71 232H235V386H71Z M273 231H445V362H273Z M485 242H596V410H485Z M638 238H815V350H638Z M852 232H1120V388H852Z"/>
              <path d="M73 422H240V593H73Z M283 415H472V590H283Z M511 447H691V607H511Z M729 409H891V585H729Z M925 420H1140V598H925Z"/>
            </g>
            <g stroke="#71809C" stroke-width="17" stroke-linecap="round" opacity=".35">
              <path d="M0 213H1200 M0 401H1200 M251 0V650 M463 0V650 M629 0V650 M892 0V650"/>
              <path d="M0 590L650 0 M575 650L1150 0"/>
            </g>
            <g fill="#B4BED1" font-family="monospace" font-size="13" letter-spacing="2" opacity=".75">
              <text x="92" y="80">THE CORNER</text><text x="681" y="76">NORTH CORRIDOR</text>
              <text x="300" y="261">THE SHORTCUT</text><text x="888" y="455">THE PASSAGE</text>
              <text x="106" y="478">THE PARK</text><text x="550" y="488">SOUTH LANE</text>
            </g>
            <path d="M96 535 Q263 440 359 476 T654 272 T976 251" stroke="#E3C5BB" stroke-width="3" fill="none" stroke-dasharray="2 12" opacity=".65"/>
          </svg>
          <div class="lp-hud-grid"></div>
          <div class="lp-safe-zone"></div>
          <div class="lp-hunt-path"></div>
          <div class="lp-pin lp-pin-hunter"><span>⌖</span><i>SEEKER</i></div>
          <div class="lp-pin lp-pin-shadow"><span>◆</span><i>HIDER</i></div>
          <div class="lp-radar-origin"><span></span></div>
        </div>
        <div class="lp-stage-top">
          <span class="lp-film-mark"><b class="lp-rec-dot"></b> A NIGHT IN MOTION</span>
          <span class="lp-film-coordinates">ANIMATED EXAMPLE · NOT REAL GPS</span>
        </div>
        <div class="lp-scene-text">
          <span class="lp-scene-kicker" id="lp-scene-kicker">PART 01 · THE TIME TO HIDE</span>
          <h3 id="lp-preview-heading"><span id="lp-scene-title">You have three minutes.</span></h3>
          <p id="lp-scene-description">A familiar place suddenly feels full of possibilities.</p>
        </div>
        <div class="lp-stage-bottom">
          <div class="lp-game-telemetry">
            <div><span>TIME LEFT</span><b id="lp-scene-clock">29:57</b></div>
            <div><span>PLAY AREA</span><b id="lp-scene-radius">1,000 m</b></div>
            <div><span>FRIENDS</span><b>6 / 6</b></div>
          </div>
          <span class="lp-demo-tag">A GAMEPLAY STORY · 18 SEC</span>
        </div>
        <div class="lp-playback">
          <button class="lp-player-control" type="button" id="lp-pause" aria-label="Pause simulated gameplay preview">Ⅱ</button>
          <div class="lp-timeline" role="progressbar" aria-label="Gameplay preview progress" aria-valuemin="0" aria-valuemax="18" aria-valuenow="0"><span id="lp-timeline-fill"></span></div>
          <span id="lp-preview-time">00:00 / 00:18</span>
          <button class="lp-player-control lp-replay" type="button" id="lp-replay" aria-label="Replay simulated gameplay preview">↻</button>
        </div>
      </div>
      <div class="lp-preview-caption"><span>AN EXAMPLE OF THE GAME, NOT A REAL MATCH.</span><span>THE NEXT STORY COULD BE YOURS. <span aria-hidden="true">↗</span></span></div>
    </section>

    <section class="lp-how" id="how">
      <div class="lp-section-head"><span class="lp-index">Chapter three <span class="lp-sep">/</span> The rules</span><span class="lp-head-detail">EVERY GREAT GAME NEEDS A FEW</span></div>
      <h2 class="lp-section-title">Simple rules.<br/><em>Unpredictable nights.</em></h2>
      <div class="lp-steps">
        <article class="lp-step"><span class="lp-step-num">01</span><div><h3>Gather your people.</h3><p>Create a room, invite your friends, and choose the radius and time. The city is your playground, within the agreed safe area.</p></div><span class="lp-step-icon" aria-hidden="true">✳</span></article>
        <article class="lp-step"><span class="lp-step-num">02</span><div><h3>Hide. Seek. Repeat.</h3><p>Hiders get a head start. Seekers catch brief glimpses of their positions. The playable circle slowly closes in.</p></div><span class="lp-step-icon" aria-hidden="true">◎</span></article>
        <article class="lp-step"><span class="lp-step-num">03</span><div><h3>Make it to the end.</h3><p>Seekers confirm tags; hiders try to outlast the clock. One hider still free when time runs out means the hiders win.</p></div><span class="lp-step-icon" aria-hidden="true">↗</span></article>
      </div>
    </section>

    <section class="lp-role-section" id="roles">
      <div class="lp-section-head"><span class="lp-index">Chapter four <span class="lp-sep">/</span> Two sides to every story</span><span class="lp-head-detail">WHAT KIND OF FRIEND ARE YOU?</span></div>
      <div class="lp-role-heading"><h2>Everyone has <em>a part to play.</em></h2><p>One city. Two completely different perspectives.</p></div>
      <div class="lp-role-grid">
        <button type="button" class="lp-role-card lp-role-hunter" id="lp-role-hunter" aria-pressed="true">
          <span class="lp-role-top"><span class="lp-role-bullet">01 / THE ONE WHO LOOKS</span><span aria-hidden="true">↗</span></span>
          <span class="lp-role-symbol" aria-hidden="true">⌖</span>
          <span class="lp-role-title">The seeker.</span>
          <span class="lp-role-desc">The next clue is just around the corner. Trust your instincts, your friends, and the map.</span>
          <span class="lp-role-action">See the seeker’s perspective <span aria-hidden="true">↗</span></span>
        </button>
        <button type="button" class="lp-role-card lp-role-shadow" id="lp-role-shadow" aria-pressed="false">
          <span class="lp-role-top"><span class="lp-role-bullet">02 / THE ONE WHO VANISHES</span><span aria-hidden="true">↗</span></span>
          <span class="lp-role-symbol" aria-hidden="true">✧</span>
          <span class="lp-role-title">The hider.</span>
          <span class="lp-role-desc">Every turn could be the perfect escape. The clock is on your side. Keep moving.</span>
          <span class="lp-role-action">See the hider’s perspective <span aria-hidden="true">↗</span></span>
        </button>
      </div>
      <p class="lp-role-disclaimer">This changes the preview colors only. The host assigns actual roles in the lobby.</p>
    </section>

    <section class="lp-lobby-section" id="lobby">
      <div class="lp-section-head"><span class="lp-index">The next chapter <span class="lp-sep">/</span> Yours</span><span class="lp-head-detail">NO SIGNUP REQUIRED · UP TO 20 FRIENDS</span></div>
      <div class="lp-lobby-intro"><h2>So, who's <em>in?</em></h2><p>Pick your people. Set the scene.<br/>See where the evening takes you.</p></div>
      <div class="lp-lobby-grid">
        <div class="lp-lobby-panel">
          <div class="lp-panel-header"><span>YOUR STORY STARTS HERE</span><span>✷</span></div>
          <h3>Start a game.</h3>
          ${createRules(playerName,esc)}
        </div>
        <div class="lp-lobby-panel lp-lobby-join">
          <div class="lp-panel-header"><span>GOT AN INVITE?</span><span>↗</span></div>
          <h3>Join your friends.</h3>
          ${joinRules(playerName,esc)}
          <div class="lp-join-footer"><b>MAKE IT A GOOD STORY.</b><p>Play together, stay on safe public paths, and agree on boundaries before starting. No trespassing or risky crossings. Location sharing is limited to your game.</p></div>
        </div>
      </div>
      ${configured ? "" : '<div class="lp-config-warning">Connect Supabase to enable multiplayer rooms.</div>'}
    </section>
  </main>
  <footer class="lp-footer"><div class="lp-footer-logo">keepmoving<span>✳</span></div><p>There’s a whole world outside.</p><span>© 2026 KeepMoving · Go make a story.</span></footer>
</div><div id="toast" class="toast" hidden></div>`;
}

const SCENES = [
 { title:"You have three minutes.",kicker:"PART 01 · THE TIME TO HIDE",description:"A familiar place suddenly feels full of possibilities.",clock:"29:57",radius:"1,000 m",phase:0 },
 { title:"The game is on.",kicker:"PART 02 · SOMEONE'S SEEKING",description:"Around every corner: a new way to surprise your friends.",clock:"26:08",radius:"1,000 m",phase:1 },
 { title:"A little too close.",kicker:"PART 03 · THE RADAR REVEAL",description:"One quick glimpse. A dozen directions to go.",clock:"20:31",radius:"700 m",phase:2 },
 { title:"One last hiding place.",kicker:"PART 04 · THE FINAL MOMENTS",description:"The play area is smaller. The memories are getting bigger.",clock:"04:12",radius:"343 m",phase:3 },
];
const TRAILER_SECONDS = 18;
let trailerInterval = null;
let trailerObserver = null;
let trailerElapsed = 0;
let lastFrame = 0;
let paused = false;
let sceneIndex = -1;

export function stopLanding() {
  if (trailerObserver) trailerObserver.disconnect();
  trailerObserver = null;
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
  let inView = false;
  let beganPlaying = false;
  stage.classList.add("lp-preview-paused");

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
    stage.classList.toggle("lp-preview-paused",paused || !inView);
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
    // Preserve the user’s scroll position when previewing a different role.
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
  // Start the cinematic at the moment someone reaches it, rather than
  // playing through the entire story while it is offscreen.
  if ("IntersectionObserver" in window) {
    trailerObserver = new IntersectionObserver((entries)=>{
      inView = entries.some(entry=>entry.isIntersecting);
      if (inView && !beganPlaying) {
        beganPlaying = true;
        trailerElapsed = 0;
        sceneIndex = -1;
        for (const element of stage.querySelectorAll(".lp-safe-zone,.lp-pin-hunter,.lp-pin-shadow")) {
          element.style.animation = "none";
          void element.offsetWidth;
          element.style.animation = "";
        }
        update();
      }
      stage.classList.toggle("lp-preview-paused", paused || !inView);
      lastFrame = performance.now();
    }, {threshold:0.2});
    trailerObserver.observe(stage);
  } else {
    inView = true;
    stage.classList.remove("lp-preview-paused");
  }
  lastFrame=performance.now();
  trailerInterval=window.setInterval(()=>{
    if (paused || !inView || document.hidden) {lastFrame=performance.now();return;}
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
