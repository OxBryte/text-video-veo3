import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import sdk from '@farcaster/frame-sdk';

await sdk.actions.ready();
// await sdk.actions.ready({ disableNativeGestures: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
