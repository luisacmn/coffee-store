import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry, initWebVitals } from "@/shared/lib/observability";
import { getCurrentUserId, getOrCreateSessionId } from "@/shared/lib/observability/identity";
import {createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType} from 'react-router-dom'
import { getWebInstrumentations, initializeFaro, ReactIntegration, ReactRouterVersion } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

getOrCreateSessionId();

const faroUrl = import.meta.env.VITE_FARO_URL;

if (faroUrl) {
  initializeFaro({
    url: faroUrl,
    app: {
      name: import.meta.env.VITE_APP_NAME ?? 'o11y-ecommerce',
      version: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
      environment: import.meta.env.MODE
    },
    metas: [
      () => ({
        session: { id: getOrCreateSessionId() },
        user: getCurrentUserId() ? { id: getCurrentUserId() } : undefined,
      }),
    ],
    
    instrumentations: [
      // Mandatory, omits default instrumentations otherwise.
      ...getWebInstrumentations(),

      // Tracing package to get end-to-end visibility for HTTP requests.
      new TracingInstrumentation(),

      // React integration to get end-to-end visibility for React Router.
      new ReactIntegration({
        router: {
        version: ReactRouterVersion.V7,
        dependencies: {
          createRoutesFromChildren,
            matchRoutes,
            Routes,
            useLocation,
            useNavigationType,
          },
        },
      }),
    ],
  });
}


initSentry();
initWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
