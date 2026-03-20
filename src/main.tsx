import { StrictMode } from "react";
import { HashRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "./styles/events.css";

// We create a component wrapper
const MOWGameApp = () => (
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);

// We expose it to the window object so your PHP script can see it
(window as any).MOWGame = {
  default: MOWGameApp
};