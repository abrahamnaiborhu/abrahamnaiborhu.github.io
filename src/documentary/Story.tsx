import { ArrowIcon } from "../components/ArrowIcon";
import { AccountSummary, ProductScene, Dashes, SceneCaptions } from "./scenes/ScrubScene";
import { useScenesLive, useScrubScene } from "./scenes/useScrubScene";
import { sattabiScene } from "./scenes/sattabi";
import { avadScene } from "./scenes/avad";
import { glinstaScene } from "./scenes/glinsta";
import { startingScene } from "./scenes/startingPoint";
import { JudgmentFilm } from "./JudgmentFilm";

export function Applications() {
  useScenesLive();
  return (
    <section
      id="work"
      tabIndex={-1}
      className="scene scene-applications work-chapter"
      aria-labelledby="applications-title"
    >
      <div className="scene-top">
        <span>Application experience</span>
        <span>Selected product work</span>
      </div>
      <div className="work-intro">
        <h2 id="applications-title">
          I build applications that keep working when part of them <em>fails.</em>
        </h2>
        <p className="attribution-line">
          My role: end-to-end engineering, from design and development to deployment and monitoring.
        </p>
      </div>
      <ProductScene
        scene={sattabiScene}
        product="Sattabi · Door access"
        role="I built all of it, from the door wiring to the app."
        next={{ href: "#avad", label: "AVAD" }}
        site={{ href: "https://sattabi.com/", name: "Sattabi" }}
        account={{
          product:
            "People open a door with a card, a QR code, or a button in the app or on the website. Guests get a QR pass that opens only the doors they’re allowed through.",
          part: "I built all of it: the reader and controller software, the admin website, the mobile app, and the on-site installation, including wiring each door’s magnetic lock, exit sensor, emergency exit and key override.",
          decision: "A door shouldn’t depend on the internet to open.",
          detail:
            "Each door keeps its own copy of who may enter, so authorized people still get through when the cloud connection drops.",
        }}
      />
      <ProductScene
        scene={avadScene}
        product="AVAD · Worship presentation"
        role="Full-stack developer."
        next={{ href: "#glinsta", label: "Glinsta" }}
        site={{ href: "https://avad-online.com/", name: "AVAD" }}
        account={{
          product:
            "A browser-based presentation system for worship services: one operator controls the lyrics, verses and media on every screen.",
          part: "I was the full-stack developer, building the operator’s screen, the shared display and the server connecting them.",
          decision:
            "The congregation’s screens shouldn’t lag behind the operator, or silently drop out of step.",
          detail:
            "I chose WebSocket so every change reaches the screens the moment it’s made, and designed a small messaging protocol between them. Each shared screen is pinged on its own; one that drops out reconnects and catches up to the current slide by itself.",
        }}
      />
      <ProductScene
        scene={glinstaScene}
        product="Glinsta · Google Workspace for business"
        role="Full-stack developer."
        next={{ href: "#behind-the-application", label: "what runs behind the app" }}
        site={{ href: "https://glinsta.com/", name: "Glinsta" }}
        account={{
          product:
            "Indonesian businesses buy Google Workspace through Glinsta and get a working account without anyone setting it up by hand.",
          part: "I was the full-stack developer, from payment validation and domain verification to the integration with Google’s reseller system.",
          decision:
            "A payment must become exactly one working account, even if something fails halfway.",
          detail:
            "Account setup runs in a background worker that retries safely, so a dropped connection or a repeated payment notice is handled without creating a duplicate account.",
        }}
      />
    </section>
  );
}

export function Perspective() {
  const track = useScrubScene(startingScene);
  const { Drawing } = startingScene;
  return (
    <section
      id="perspective"
      tabIndex={-1}
      className="scene starting-scene"
      aria-labelledby="perspective-title"
    >
      <div className="scene-top">
        <span>The starting point</span>
        <span>On premises · Development and staging</span>
      </div>
      <div className="perspective-bridge">
        <div className="narration">
          <h2 id="perspective-title">
            The team needed<br />
            <em>a better way to ship.</em>
          </h2>
        </div>
        <p>
          Every application meant another manual deployment. I wanted to give the team a shared
          way to deploy and understand their applications, starting with development and staging.
        </p>
      </div>
      <div ref={track} className="scene-track" data-mode="static">
        <div className="scene-stage" data-scrub-stage>
          <div className="scene-grid starting-grid">
            <div className="scene-copy">
              <p className="starting-command">
                ssh server <ArrowIcon direction="right" /> git pull <ArrowIcon direction="right" />{" "}
                pm2 restart
              </p>
              <p className="starting-lead" aria-hidden="true">
                {startingScene.captions[0]}
              </p>
              <SceneCaptions captions={startingScene.captions} />
              <ol className="sr-only">
                {startingScene.captions.map((caption) => (
                  <li key={caption}>{caption}</li>
                ))}
              </ol>
              <Dashes />
            </div>
            <div className="starting-art" data-scrub-art>
              <Drawing a={startingScene.parts(startingScene.settled[0])} />
            </div>
          </div>
          <div className="scene-foot">
            <span className="scene-progress" aria-hidden="true" />
            <a href="#team">
              Continue to the platform <ArrowIcon direction="down" />
            </a>
          </div>
        </div>
      </div>
      <div className="scene-still">
        <div className="scene-grid starting-grid">
          <div className="scene-copy">
            <p className="starting-command">
              ssh server <ArrowIcon direction="right" /> git pull <ArrowIcon direction="right" />{" "}
              pm2 restart
            </p>
            <p className="scene-caption">{startingScene.captions[2]}</p>
          </div>
          <div className="starting-art">
            <Drawing a={startingScene.parts(startingScene.settled[2])} />
          </div>
        </div>
      </div>
      <details className="scene-account starting-account">
        <AccountSummary
          kicker="Before the platform"
          name="The starting point, in full"
          teaser="SSH, git pull, restart with PM2, for every application."
        />
        <div className="account-body account-single">
          <p>
            Every application was deployed by hand: SSH into the server, git pull, restart with PM2.
            It was slow, easy to get wrong, and invisible, with no metrics or monitoring. An
            application couldn’t run on more machines when traffic grew, and if a server failed
            there was nothing to fall back to. When something broke, it simply broke.
          </p>
          <p>
            We’re moving away from that routine, starting with development and staging on the
            platform I built.
          </p>
        </div>
      </details>
    </section>
  );
}

export function Judgment() { return <JudgmentFilm />; }

export function Contact() {
  return (
    <section
      id="contact"
      tabIndex={-1}
      className="scene next-scene contact"
      aria-labelledby="contact-title"
    >
      <div className="scene-top">
        <span>The next team</span>
        <span>Abraham Naiborhu · Jakarta</span>
      </div>
      <div className="closing-main">
        <p className="closing-premise">I like making things work together.</p>
        <h2 id="contact-title">
          What could
          <br />
          we build
          <br />
          <em>together?</em>
        </h2>
        <p className="closing-focus">Cloud Engineer / Platform Engineer / DevOps Engineer</p>
        <p className="closing-copy">
          I bring an application developer’s perspective to the infrastructure and delivery systems
          that support the work. If that fits your team, let’s talk.
        </p>
        <a
          className="email-link"
          aria-label="Email Abraham at abrahamnaiborhu@gmail.com"
          href="mailto:abrahamnaiborhu@gmail.com"
        >
          abrahamnaiborhu@gmail.com <ArrowIcon />
        </a>
      </div>
      <div className="closing-links">
        <a href="https://www.linkedin.com/in/abrahamnaiborhu">
          LinkedIn <ArrowIcon />
        </a>
        <a href="https://github.com/abrahamnaiborhu">
          GitHub <ArrowIcon />
        </a>
        <a href="https://dev.to/abrahamnaiborhu">
          Dev.to <ArrowIcon />
        </a>
        <a href="/resume.html">
          Read my resume <ArrowIcon />
        </a>
        <a id="resume-note" href="/Abraham-Naiborhu-Resume.pdf" download>
          Resume PDF <ArrowIcon direction="down" />
        </a>
        <a href="#work">
          Revisit the work <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
