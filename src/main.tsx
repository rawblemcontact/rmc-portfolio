import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Locator UI is kept as a dependency but hard-disabled (not initialized).

createRoot(document.getElementById("root")!).render(<App />);
