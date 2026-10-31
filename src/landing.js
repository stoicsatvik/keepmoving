
const ACTS=[
  {name:"THE INVITE",title:"It starts with one message.",story:"10:42 PM. Someone in the group says: three minutes. Find me.",event:"INVITE SENT",radius:"1,000 m"},
  {name:"THE HEAD START",title:"Three minutes to disappear.",story:"The Shadows get moving. The Hunters stay put. Every familiar turn feels different.",event:"HUNTERS WAIT",radius:"1,000 m"},
  {name:"THE FIRST PING",title:"A dot appears. Then vanishes.",story:"For twenty-five seconds, the map shows a location hint. Then you're guessing again.",event:"RADAR REVEAL",radius:"700 m"},
  {name:"THE CLOSING ZONE",title:"The whole city gets smaller.",story:"The safe circle shrinks. There's still a way out, if you're paying attention.",event:"ZONE SHRINKING",radius:"400 m"},
  {name:"THE LAST MINUTE",title:"You'll talk about this tomorrow.",story:"One Shadow survives. Somebody immediately asks to play another round.",event:"SHADOWS SURVIVE",radius:"250 m"}
];
const TOTAL=25;
const two=n=>String(n).padStart(2,"0");
const clock=n=>`${two(Math.floor(n/60))}:${two(Math.floor(n%60))}`;

function demoMap(){
return `<svg class="km-map-svg" viewBox="0 0 660 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated sample street map with shrinking circular zone and player signals">
<defs><pattern id="km-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#2A4145" stroke-width=".7"/></pattern></defs>
<rect width="660" height="480" fill="#101B20"/><rect width="660" height="480" fill="url(#km-grid)"/>
<g fill="#1B3033" stroke="#395158" stroke-width="2"><path d="M22 19H151V116H22Z M183 21H292V118H183Z M323 19H483V118H323Z M511 19H638V118H511Z"/>
<path d="M22 145H139V257H22Z M170 143H290V255H170Z M328 145H482V255H328Z M515 146H636V257H515Z"/>
<path d="M22 283H145V454H22Z M171 283H293V454H171Z M327 285H481V455H327Z M511 285H636V454H511Z"/></g>
<g stroke="#789393" stroke-width="12" opacity=".22" fill="none"><path d="M0 132H660 M0 270H660 M156 0V480 M309 0V480 M495 0V480 M-44 470L562 -60"/></g>
<g stroke="#AFC6BF" stroke-width="1.2" opacity=".35" fill="none"><path d="M0 132H660 M0 270H660 M156 0V480 M309 0V480 M495 0V480 M-44 470L562 -60"/></g>
<g fill="#839B9C" font-size="12" font-family="monospace"><text x="45" y="53">BLOCK 01</text><text x="347" y="52">NORTH</text><text x="43" y="330">THE PARK</text><text x="523" y="330">LANE 04</text></g>
<path d="M196 353L234 312L283 290L314 250" stroke="#FF4556" stroke-width="2.5" fill="none" stroke-dasharray="5 7" class="km-route"/>
<circle class="km-zone" cx="337" cy="242" r="179" stroke="#F2B447" stroke-width="3" fill="#F2B447" fill-opacity=".065"/>
<g class="km-hunter-track"><g transform="translate(210 344)"><circle r="23" fill="#FF4556" opacity=".22"/><circle r="12" fill="#FF4556" stroke="#EDEEE8" stroke-width="2"/><text y="4" text-anchor="middle" fill="#0B1619" font-size="12" font-weight="800">H</text></g></g>
<g class="km-shadows"><g transform="translate(395 158)"><circle r="12" fill="#C8F06B" stroke="#0E2116" stroke-width="2"/><text text-anchor="middle" y="4" fill="#132514" font-size="12" font-weight="800">S</text></g>
<g transform="translate(240 224)"><circle r="12" fill="#C8F06B" stroke="#0E2116" stroke-width="2"/><text text-anchor="middle" y="4" fill="#132514" font-size="12" font-weight="800">S</text></g>
<g transform="translate(430 348)"><circle r="12" fill="#C8F06B" stroke="#0E2116" stroke-width="2"/><text text-anchor="middle" y="4" fill="#132514" font-size="12" font-weight="800">S</text></g></g>
<g class="km-radar" transform="translate(337 242)"><circle r="25" stroke="#FF4556" stroke-width="2" fill="none"/><circle class="km-radar-delayed" r="25" stroke="#FF4556" stroke-width="2" fill="none"/></g>
<path d="M337 222v-10 M337 262v10 M317 242h-10 M357 242h10" stroke="#B7C4C0" stroke-width="1.4"/>
</svg>`;
}

function settingsForm(name,escapeHTML){
return `<form id="create-form" class="km-form">
<label>Your name<input name="name" maxlength="24" required autocomplete="nickname" placeholder="Your name" value="${escapeHTML(name)}"/></label>
<div class="km-form-row"><label>Radius · metres<input name="radius" type="number" min="100" max="100000" step="100" required value="1000" inputmode="numeric"/></label>
<label>Duration · min<input name="duration" type="number" min="5" max="180" required value="30" inputmode="numeric"/></label></div>
<details class="km-advanced"><summary>Customise the rules <span>+</span></summary>
<div class="km-form-row km-form-triple">
<label>Head start · min<input name="headstart" type="number" min="0" max="10" required value="3" inputmode="numeric"/></label>
<label>Location ping · sec<input name="reveal" type="number" min="30" max="600" step="30" required value="180" inputmode="numeric"/></label>
<label>Zone shrink · min<input name="shrink" type="number" min="1" max="30" required value="10" inputmode="numeric"/></label></div>
<p>Maximum radius: 100 km. For walking, 500 m–2 km is more practical.</p></details>
<label class="km-consent"><input type="checkbox" required/><span>I consent to GPS sharing during play and agree to use safe, permitted areas. <a href="privacy.html" target="_blank" rel="noopener">Privacy</a> · <a href="terms.html" target="_blank" rel="noopener">Terms</a></span></label>
<button class="km-btn km-btn-red" type="submit">CREATE ROOM <span>↗</span></button></form>`;
}
function joinForm(name,escapeHTML){
return `<form id="join-form" class="km-form">
<label>Your name<input name="name" maxlength="24" required autocomplete="nickname" placeholder="Your name" value="${escapeHTML(name)}"/></label>
<label>Six-character room code<input class="km-room-code" name="code" minlength="6" maxlength="6" required autocapitalize="characters" autocomplete="off" spellcheck="false" placeholder="XXXXXX"/></label>
<label class="km-consent"><input type="checkbox" required/><span>I consent to GPS sharing during play and agree to use safe, permitted areas. <a href="privacy.html" target="_blank" rel="noopener">Privacy</a> · <a href="terms.html" target="_blank" rel="noopener">Terms</a></span></label>
<button class="km-btn km-btn-outline" type="submit">JOIN ROOM <span>↗</span></button></form>`;
}

export function renderLanding({playerName,configured,esc}) {
return `<div class="km-site" id="top" data-scene="0">
<header class="km-nav"><a class="km-logo" href="#top" aria-label="KeepMoving home"><span class="km-logo-mark">K<span>.</span></span> KEEP<span>MOVING</span></a>
<nav aria-label="Site sections"><a href="#replay">THE ROUND</a><a href="#rules">THE RULES</a><a href="#roles">THE ROLES</a><a href="#lobby" class="km-nav-cta">PLAY ↗</a></nav></header>
<main><section class="km-hero" id="replay">
<div class="km-intro"><div class="km-micro"><span class="km-dot"></span> FIELD FILE 001 / A SAMPLE ROUND <span>THE NEXT ONE IS YOURS</span></div>
<h1>ONE MESSAGE.<br/>EVERYONE <em>MOVES.</em></h1>
<div class="km-intro-bottom"><p>A real-world hide-and-seek game for your crew. Pick the radius. Split into teams. Let the city become the story.</p>
<div class="km-intro-links"><a class="km-btn km-btn-red" href="#lobby">START A GAME <span>↗</span></a><a class="km-inline-link" href="#field">WATCH THE STORY ↓</a></div></div></div>
<div class="km-field" id="field">
<div class="km-field-head"><span><i class="km-dot"></i> FIELD RECORD / 001</span><span>SIMULATED / 25 SECOND REPLAY</span></div>
<div class="km-field-main">
<div class="km-left">
<div class="km-chapter-copy" aria-live="polite" aria-atomic="true">
<span class="km-chapter-label" id="km-chapter-label">01 / THE INVITE</span>
<h2 id="km-chapter-title">It starts with one message.</h2>
<p id="km-chapter-description">10:42 PM. Someone in the group says: three minutes. Find me.</p></div>
<div class="km-chat" aria-label="Scripted group chat for the fictional match"><div class="km-chat-head"><span>THE GROUP CHAT</span><span>FICTIONAL / 6 FRIENDS</span></div>
<div class="km-chat-lines">
<div class="km-message" data-unlock="0"><b>ARAV <time>10:42</time></b><span>3 minutes. Find me.</span></div>
<div class="km-message" data-unlock="1"><b>RIYA <time>10:45</time></b><span>We're splitting up.</span></div>
<div class="km-message" data-unlock="2"><b>VED <time>10:54</time></b><span>BRO I JUST SAW THE PING</span></div>
<div class="km-message" data-unlock="3"><b>RIYA <time>11:03</time></b><span>The zone's getting tiny.</span></div>
<div class="km-message" data-unlock="4"><b>ARAV <time>11:12</time></b><span>Same time tomorrow?</span></div></div>
<div id="km-chat-event" class="km-chat-event">INVITE SENT</div>
</div></div>
<div class="km-map-panel">
<div class="km-map-head"><span>MAP / FICTIONAL ROUND</span><span id="km-map-status">INVITE SENT</span></div>
<div class="km-map-surface">${demoMap()}</div>
<div class="km-map-clock"><span>TIME LEFT <small>FAST-FORWARDED</small></span><strong id="km-clock">30:00</strong><span>SAFE ZONE <b id="km-radius">1,000 m</b></span></div>
<div class="km-map-legend"><span><i class="km-key hunter"></i> HUNTER</span><span><i class="km-key shadow"></i> SHADOW</span><span><i class="km-key zone"></i> ZONE</span></div>
</div></div>
<div class="km-replay"><div class="km-replay-label"><span>FIVE BEATS OF ONE NIGHT</span><span id="km-elapsed">00:00 / 00:25</span></div>
<div class="km-stepbar" role="group" aria-label="Choose a part of the demo">
${ACTS.map((a,i)=>`<button type="button" class="km-step" data-step="${i}" aria-pressed="${i===0}"><small>0${i+1}</small><strong>${a.name}</strong><i></i></button>`).join("")}
</div>
<div class="km-replay-controls"><div class="km-progress"><div id="km-progress"></div></div>
<button type="button" id="km-toggle" class="km-control" aria-label="Pause sample replay">PAUSE Ⅱ</button>
<button type="button" id="km-restart" class="km-control" aria-label="Replay from beginning">REPLAY ↻</button></div></div>
</div></section>

<section class="km-section" id="rules"><div class="km-section-meta"><span>02 / THE RULES</span><span>THE GAME IS EASY TO EXPLAIN.</span></div>
<h2>YOUR CITY.<br/><em>YOUR MOVE.</em></h2>
<div class="km-rule-list">
<article><span>01</span><div><h3>MAKE THE INVITE.</h3><p>Start a room, set your radius and game duration, then share the code with friends. Agree on safe, permitted boundaries first.</p></div><b>↗</b></article>
<article><span>02</span><div><h3>DISAPPEAR OR SEARCH.</h3><p>Shadows get a head start. Hunters see short GPS reveals at set intervals, never a permanent live tracking dot.</p></div><b>◎</b></article>
<article><span>03</span><div><h3>LAST UNTIL ZERO.</h3><p>The safe zone shrinks. Hunters request captures, Shadows confirm them. If one Shadow survives, Shadows win.</p></div><b>⌁</b></article></div>
<p class="km-safety">Be smart out there: stay on public paths, never trespass, avoid dangerous crossings, and keep your phone open for GPS.</p>
</section>
<section class="km-section" id="roles"><div class="km-section-meta"><span>03 / TWO SIDES</span><span>SAME STREET. DIFFERENT STORY.</span></div>
<h2>FIND THEM.<br/><em>OR DON'T GET FOUND.</em></h2>
<div class="km-roles"><article class="km-role-hunter"><div class="km-role-top">A / HUNTER <span>⌖</span></div><h3>FOLLOW THE SIGNAL.</h3><p>Get a glimpse. Make a choice. Find the Shadow before time runs out.</p></article>
<article class="km-role-shadow"><div class="km-role-top">B / SHADOW <span>◇</span></div><h3>STAY ONE STEP AHEAD.</h3><p>Use the head start. Watch the zone. Make it to the final second.</p></article></div></section>
<section class="km-section km-lobby" id="lobby"><div class="km-section-meta"><span>04 / YOUR TURN</span><span>NO ACCOUNT. JUST A ROOM CODE.</span></div>
<h2>MAKE IT<br/><em>A STORY.</em></h2><p class="km-lobby-sub">The example ends here. Now make your own.</p>
<div class="km-forms"><section><div class="km-form-head"><span>01 / CREATE</span><span>HOST</span></div><h3>START A ROUND</h3>${settingsForm(playerName,esc)}</section>
<section><div class="km-form-head"><span>02 / JOIN</span><span>PLAYER</span></div><h3>JOIN YOUR FRIENDS</h3>${joinForm(playerName,esc)}</section></div>
${configured?"":'<p class="km-config-error">Backend configuration required before playing.</p>'}</section>
</main>
<footer class="km-footer"><a href="#top" class="km-logo">KEEP<span>MOVING</span></a><p>THE REST OF THE STORY HAPPENS OUTSIDE.</p>
<div><a href="privacy.html">PRIVACY</a><a href="terms.html">TERMS & RULES</a><a href="https://github.com/stoicsatvik/keepmoving" target="_blank" rel="noopener">SOURCE</a></div></footer></div>
<div id="toast" class="toast" hidden></div>`;
}

let timer=null,observer=null,root=null,elapsed=0,paused=false,visible=true,last=0,reduced=false;
export function stopLanding(){
 if(timer!==null)clearInterval(timer);
 if(observer)observer.disconnect();
 timer=null;observer=null;root=null;elapsed=0;paused=false;last=0;
}
export function initLanding(){
 stopLanding();
 root=document.querySelector(".km-site");
 if(!root)return;
 const sceneSteps=[...root.querySelectorAll(".km-step")];
 const toggle=root.querySelector("#km-toggle"),restart=root.querySelector("#km-restart");
 reduced=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 paused=reduced;last=performance.now();
 let lastScene=-1;
 const paint=()=>{
  if(!root)return;
  const index=Math.min(ACTS.length-1,Math.floor(elapsed/5)),a=ACTS[index];
  if (index !== lastScene) {
    lastScene=index;
    root.dataset.scene=String(index);
    root.querySelector("#km-chapter-label").textContent=`0${index+1} / ${a.name}`;
    root.querySelector("#km-chapter-title").textContent=a.title;
    root.querySelector("#km-chapter-description").textContent=a.story;
    root.querySelector("#km-map-status").textContent=a.event;
    root.querySelector("#km-chat-event").textContent=a.event;
    root.querySelector("#km-radius").textContent=a.radius;
    root.querySelectorAll(".km-message").forEach(n=>n.classList.toggle("is-visible",Number(n.dataset.unlock)<=index));
    sceneSteps.forEach((n,i)=>n.setAttribute("aria-pressed",String(index===i)));
  }
  root.querySelector("#km-clock").textContent=clock(Math.round(1800*(1-elapsed/TOTAL)));
  root.querySelector("#km-elapsed").textContent=clock(elapsed)+" / 00:25";
  root.querySelector("#km-progress").style.width=(elapsed/TOTAL*100)+"%";
  sceneSteps.forEach((n,i)=>{
   n.querySelector("i").style.width=Math.min(100,Math.max(0,(elapsed-i*5)/5*100))+"%";
  });
  toggle.textContent=paused?"PLAY ▶":"PAUSE Ⅱ";
  toggle.setAttribute("aria-label",paused?"Play sample replay":"Pause sample replay");
 };
 const seek=i=>{elapsed=i*5;last=performance.now();paint();};
 sceneSteps.forEach((n,i)=>n.addEventListener("click",()=>seek(i)));
 toggle.addEventListener("click",()=>{paused=!paused;last=performance.now();paint();});
 restart.addEventListener("click",()=>{elapsed=0;paused=reduced;last=performance.now();paint();});
 if("IntersectionObserver" in window){
   visible=false;
   observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);last=performance.now();},{threshold:.07});
   observer.observe(root.querySelector(".km-field"));
 }
 paint();
 if(reduced)return;
 timer=setInterval(()=>{
  if(paused||!visible||document.hidden){last=performance.now();return;}
  const now=performance.now();elapsed+=Math.min(.25,(now-last)/1000);last=now;
  if(elapsed>=TOTAL)elapsed=0;
  paint();
 },100);
}
