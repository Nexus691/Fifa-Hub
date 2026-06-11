import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Use the VITE_API_URL if provided (e.g. for production deployments), otherwise fallback to the dev proxy
if (import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL);
} else if (import.meta.env.PROD) {
  // If in production and no URL provided, default to the user's Render URL
  setBaseUrl("https://fifa-hub.onrender.com");
}

createRoot(document.getElementById("root")!).render(<App />);
