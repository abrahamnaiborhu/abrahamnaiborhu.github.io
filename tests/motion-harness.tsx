import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Signature } from '../src/rebrand/Signature';
import { gsap } from '../src/rebrand/motion';

// Development-only harness. Neither this entry nor its diagnostics enter dist.
window.foundationTweenCount = () => gsap.globalTimeline.getChildren(true, true, false).length;
function Harness() {
  const [visible, setVisible] = React.useState(true);
  return <React.Fragment>
    <button onClick={() => setVisible(value => !value)}>{visible ? 'Hide sample' : 'Show sample'}</button>
    {visible && <Signature />}
  </React.Fragment>;
}
const root = document.getElementById('test-root');
if (!root) throw new Error('Missing test root');
createRoot(root).render(<React.StrictMode><Harness /></React.StrictMode>);
