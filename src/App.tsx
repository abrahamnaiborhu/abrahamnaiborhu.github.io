import { ArrowIcon } from './components/ArrowIcon';
import { Navigation } from './rebrand/Navigation';
import { APNMark, Opening } from './documentary/Opening';
import { Applications, Perspective, Judgment, Contact } from './documentary/Story';
import { Platform } from './documentary/Platform';
import { Evidence } from './documentary/Evidence';
import { profile } from './rebrand/profile';

export default function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation brand={<><APNMark /><span className="sr-only">Abraham Naiborhu · Back to top</span></>} />
    <main id="main" tabIndex={-1}>
      <Opening />
      <Applications />
      <Perspective />
      <Platform />
      <Judgment />
      <Contact />
      <Evidence />
    </main>
    <footer className="site-footer"><p>© 2026 {profile.name} · Jakarta</p><nav aria-label="Footer"><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a><a href={profile.writing}>Dev.to</a><a href="#home">Back to top <ArrowIcon direction="up" /></a></nav></footer>
  </>;
}
