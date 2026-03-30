import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry, initWebVitals } from "@/shared/lib/observability";

initSentry();
initWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
