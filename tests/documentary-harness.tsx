import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../src/App.tsx';

function Harness() {
  const [shown,setShown] = useState(true);
  return <><button style={{position:'fixed',zIndex:100,bottom:8,left:8,background:'#fff',color:'#111'}} onClick={()=>setShown(value=>!value)}>{shown?'Unmount documentary':'Mount documentary'}</button>{shown && <App />}</>;
}
createRoot(document.getElementById('test-root')!).render(<StrictMode><Harness /></StrictMode>);
