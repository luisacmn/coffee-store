import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry, initWebVitals } from "@/shared/lib/observability";
import {createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType} from 'react-router-dom'
import { getWebInstrumentations, initializeFaro, ReactIntegration, ReactRouterVersion } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

  initializeFaro({
    url: 'https://faro-collector-prod-sa-east-1.grafana.net/collect/5468584de04ad12827c9f3258f94a7aa',
    app: {
      name: 'o11y-ecommerce',
      version: '1.0.0',
      environment: 'production'
    },
    
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


initSentry();
initWebVitals();

createRoot(document.getElementById("root")!).render(<App />);
