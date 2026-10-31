
export function renderUrbanHero() {
  return `
  <section class="lp-hero urban-hero" aria-labelledby="lp-hero-title">
    <div class="urban-photo" aria-hidden="true"></div>
    <div class="urban-hero-fade" aria-hidden="true"></div>
    <div class="urban-grain" aria-hidden="true"></div>
    <span class="urban-frame-corner a" aria-hidden="true"></span><span class="urban-frame-corner b" aria-hidden="true"></span>
    <span class="urban-frame-corner c" aria-hidden="true"></span><span class="urban-frame-corner d" aria-hidden="true"></span>

    <div class="urban-hero-copy">
      <div class="urban-eyebrow"><span class="urban-pulse"></span> REAL-WORLD FIELD GAMES <span class="urban-divider">/</span> TONIGHT'S STORY IS YOURS</div>
      <h1 id="lp-hero-title"><span>THE CITY</span><span>BECOMES</span><span>THE <em>GAME.</em></span></h1>
      <p class="urban-hero-desc">One group chat. Six friends. Thirty minutes.<br/>A real-world hide-and-seek game for nights you'll remember.</p>
      <div class="urban-hero-actions">
        <a class="urban-button urban-primary" href="#lobby">START A HUNT <span aria-hidden="true">↗</span></a>
        <a class="urban-button urban-outline" href="#preview"><span class="urban-play-icon" aria-hidden="true">▷</span> WATCH A ROUND</a>
      </div>
      <div class="urban-story-note"><span class="urban-note-label">THE INVITE</span> "3-minute head start. Go." <span aria-hidden="true">✳</span></div>
    </div>

    <div class="urban-artifact-cluster" aria-label="Fictional game artifacts preview">
      <span class="urban-artifact-label">A NIGHT IN MOTION <i>SIMULATED MATCH</i></span>
      <article class="urban-chat-card" aria-label="Illustrative group-chat messages">
        <header><span class="urban-chat-icon" aria-hidden="true">✳</span><div><strong>THE HUNT</strong><small>6 friends in the game</small></div><span aria-hidden="true">•••</span></header>
        <div class="urban-chat-bubble"><span>RIYA <time>22:11</time></span><p>3 min head start. GO.</p></div>
        <div class="urban-chat-bubble"><span>VED <time>22:13</time></span><p>Already lost you guys 😂</p></div>
        <div class="urban-chat-bubble"><span>ARAV <time>22:14</time></span><p>Who's near the park?</p></div>
        <div class="urban-chat-typing"><i></i><i></i><i></i><small>Someone's typing...</small></div>
      </article>

      <article class="urban-map-card" aria-label="Simulated map with one Hunter and three Shadows">
        <header><strong>MAP / ROUND 014</strong><span>◉ ZONE ACTIVE</span></header>
        <div class="urban-map-canvas">
          <svg viewBox="0 0 470 352" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stylized city map with contracting play-zone circle and player markers">
            <defs><pattern id="km-urban-grid" width="31" height="31" patternUnits="userSpaceOnUse"><path d="M31 0H0V31" fill="none" stroke="#49646A" stroke-width=".8" opacity=".45"/></pattern></defs>
            <rect width="470" height="352" fill="#0E1C22"/>
            <rect width="470" height="352" fill="url(#km-urban-grid)"/>
            <g fill="#192D2D" stroke="#365451" stroke-width="1.2">
              <path d="M12 14H105V99H12Z M128 15H209V100H128Z M229 16H309V97H229Z M333 16H456V100H333Z"/>
              <path d="M12 119H103V188H12Z M129 119H212V191H129Z M231 119H304V191H231Z M329 119H456V190H329Z"/>
              <path d="M14 217H103V337H14Z M130 218H213V335H130Z M237 217H306V335H237Z M332 219H456V335H332Z"/>
            </g>
            <g stroke="#72918D" opacity=".35" stroke-width="9" fill="none">
              <path d="M0 110H470 M0 204H470 M116 0V352 M222 0V352 M318 0V352 M0 313L398 0 M213 352L470 128"/>
            </g>
            <g stroke="#D5E1DC" opacity=".34" stroke-width="1" fill="none">
              <path d="M0 110H470 M0 204H470 M116 0V352 M222 0V352 M318 0V352 M0 313L398 0 M213 352L470 128"/>
            </g>
            <g fill="#7D9D98" font-size="9" font-family="monospace" letter-spacing="1.5">
              <text x="21" y="43">BLOCK 01</text><text x="244" y="40">NORTH</text><text x="21" y="259">PARK</text><text x="357" y="245">LANE 04</text>
            </g>
            <circle class="urban-zone-circle" cx="246" cy="177" r="130" fill="#F6B947" fill-opacity=".065" stroke="#F6B947" stroke-width="2.5"/>
            <circle cx="237" cy="178" r="42" fill="#FF344E" fill-opacity=".10" stroke="#FF344E" stroke-opacity=".28"/>
            <path d="M150 240L179 211L202 202L237 178" fill="none" stroke="#FF344E" stroke-width="2.5" stroke-dasharray="4 6"/>
            <g class="urban-hunter-dot" transform="translate(237 178)"><circle r="17" fill="#FF344E" opacity=".24"/><circle r="10.5" fill="#FF344E" stroke="#FFE6E7" stroke-width="1.7"/><text text-anchor="middle" y="4" fill="#0E1520" font-size="12" font-weight="800">H</text></g>
            <g transform="translate(150 240)"><circle r="10" fill="#C7FF55" stroke="#12221B" stroke-width="2"/><text text-anchor="middle" y="4" fill="#14220F" font-size="11" font-weight="800">S</text></g>
            <g transform="translate(332 140)"><circle r="10" fill="#C7FF55" stroke="#12221B" stroke-width="2"/><text text-anchor="middle" y="4" fill="#14220F" font-size="11" font-weight="800">S</text></g>
            <g transform="translate(321 255)"><circle r="10" fill="#C7FF55" stroke="#12221B" stroke-width="2"/><text text-anchor="middle" y="4" fill="#14220F" font-size="11" font-weight="800">S</text></g>
          </svg>
          <div class="urban-countdown"><span>TIME LEFT</span><b>27:38</b><i></i></div>
          <div class="urban-map-scale">⊕ &nbsp; 740 M SAFE ZONE</div>
        </div>
        <footer><span><i class="urban-key hunter"></i> HUNTER 01</span><span><i class="urban-key shadow"></i> SHADOWS 05</span><span><i class="urban-key zone"></i> 740M</span></footer>
      </article>

      <div class="urban-snapshot" aria-label="Atmospheric night street photo">
        <div class="urban-snapshot-image"></div>
        <div class="urban-snapshot-caption">THAT ONE NIGHT. <span>↗</span></div>
      </div>

      <article class="urban-match-card" aria-label="Illustrative round settings">
        <header><span>MATCH / 014</span><span class="urban-match-live"><i class="urban-pulse"></i> LIVE PREVIEW</span></header>
        <div class="urban-match-values">
          <div><strong>06</strong><small>FRIENDS</small></div>
          <div><strong>1.0<span>KM</span></strong><small>RADIUS</small></div>
          <div><strong>30<span>MIN</span></strong><small>ROUND</small></div>
          <div><strong>180<span>S</span></strong><small>RADAR PINGS</small></div>
        </div>
      </article>
    </div>

    <div class="urban-bottom-strip">
      <span>THE CITY / THE CREW / THE GAME</span>
      <div><b>06 FRIENDS</b><b>1 KM RADIUS</b><b>30 MIN</b><b>LIVE GPS</b><b>NO SIGNUP</b></div>
      <span>FICTIONAL ROUND / 001</span>
    </div>
  </section>
  `;
}
