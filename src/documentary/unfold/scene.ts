// Authored scene markup; shared DOM nodes remain in place throughout the camera move.
export default String.raw`
    <section class="film" aria-label="From the application to its supporting systems">
      <div class="stage" data-phase="application"><a class="unfold-skip" href="#perspective">Continue to the platform story <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></a>
        <div class="back-word" aria-hidden="true"><span>BUILD</span><span>BEHIND</span></div>
        <div class="camera" aria-hidden="true">
          <div class="world">
            <div class="ground"><span class="ground-label">A SHARED FOUNDATION</span><div class="ground-grid"></div><span class="ground-caption">DEVELOPMENT / STAGING</span></div>
            <div class="spine"></div>
            <div class="plane monitor"><span class="plane-number">03</span><strong>OBSERVE</strong><span class="plane-detail">METRICS / LOGS / ALERTS</span><svg class="wave" viewBox="0 0 280 65"><path d="M0 48H40L55 48 66 12 82 57 96 31 109 48H150L167 48 178 20 193 48H280"/></svg></div>
            <div class="plane runtime"><span class="plane-number">02</span><strong>RUN</strong><span class="plane-detail">RUNTIME / CONTAINERS</span><div class="runtime-cells"><i></i><i></i><i></i><i></i></div></div>
            <div class="plane deploy"><span class="plane-number">01</span><strong>SHIP</strong><span class="plane-detail">BUILD / VERSION / DEPLOY</span><div class="deploy-route"><i></i><b></b><i></i><b></b><i></i></div></div>
            <div class="peer peer-left"><div class="window-bar">APPLICATION / 02</div><strong>APP</strong><span>THE TEAM’S WORK</span></div>
            <div class="peer peer-right"><div class="window-bar">APPLICATION / 03</div><strong>APP</strong><span>THE TEAM’S WORK</span></div>
            <div class="application" data-actor="application"><div class="window-bar"><span>GLINSTA / APPLICATION</span><i></i></div><div class="application-body"><span class="receipt-label">PAYMENT RECEIVED</span><strong>01</strong><span class="account-ready">Account ready.</span><div class="receipt-rule"></div><span class="receipt-foot">ONE PAYMENT. ONE ACCOUNT.</span></div><div class="fold-edge"></div></div>
          </div>
        </div>
        <div class="narration">
          <p class="eyebrow"><span class="chapter">01</span> / THE RESPONSIBILITY GROWS</p>
          <div class="headlines" aria-hidden="true">
            <h2 data-copy="application">I build <br>what you <em>see.</em></h2>
            <h2 data-copy="operations">And what <br>keeps it <br><em>running.</em></h2>
            <h2 data-copy="shared">Then make it <br>work for <br><em>the team.</em></h2>
          </div>
          <div class="descriptions" aria-hidden="true">
            <p data-copy="application">A working application is the visible part of the job.</p>
            <p data-copy="operations">Behind it: deployment, runtime, and the visibility to understand what happens.</p>
            <p data-copy="shared">Those responsibilities become a shared foundation for development and staging.</p>
          </div>
          <p class="sr-only">I build applications and the systems that support them. Deployment, runtime and monitoring become a shared platform for the team.</p>
        </div>
        <div class="controls" hidden>
          <button class="play" type="button">Play sequence</button>
          <input type="range" min="0" max="1000" value="0" aria-label="Sequence progress">
          <output class="progress" aria-hidden="true">000</output>
        </div>
        <div class="phase-controls" hidden aria-label="Choose a scene"><button type="button" data-seek="0.08" aria-pressed="true">01 / App</button><button type="button" data-seek="0.59" aria-pressed="false">02 / Behind it</button><button type="button" data-seek="0.98" aria-pressed="false">03 / Shared</button></div>
        <span class="scroll-cue" aria-hidden="true">SCROLL TO UNFOLD <svg viewBox="0 0 24 24"><path d="M12 4v16m-6-6 6 6 6-6"/></svg></span>
      </div>
    </section>
`;
