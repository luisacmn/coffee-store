import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route } from "react-router-dom";
import { FaroRoutes } from "@grafana/faro-react";
import * as Sentry from "@sentry/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouteChangeTracker, sentryErrorFallback, SentryRouteSync } from "@/shared/lib/observability";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();
const DashboardPage = lazy(() => import("./pages/DashboardPage.tsx"));
const SupportStressPage = lazy(() => import("./pages/SupportStressPage.tsx"));

const App = () => (
  <Sentry.ErrorBoundary fallback={sentryErrorFallback} showDialog={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <SentryRouteSync />
          <RouteChangeTracker />
          <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Loading page...</div>}>
            <FaroRoutes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/support" element={<SupportStressPage />} />
              <Route path="*" element={<NotFound />} />
            </FaroRoutes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Sentry.ErrorBoundary>
);

export default App;
