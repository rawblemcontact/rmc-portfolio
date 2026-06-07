import { createRoot } from "react-dom/client";
import setupLocatorUI from "@locator/runtime";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  setupLocatorUI();
}

createRoot(document.getElementById("root")!).render(<App />);