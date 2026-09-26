import { createRoot } from "react-dom/client";
import App from "./App";
import heroVideoSrc from "./assets/hero1.mp4";
import "./index.css";
import "./styles/projects-corners.css";

// Locator UI is kept as a dependency but hard-disabled (not initialized).

/** Same hashed URL as the hero <video> — fill cache during grid, before React commit. */
{
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = heroVideoSrc;
  link.type = "video/mp4";
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(<App />);
