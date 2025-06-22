// WebPro Italia - Main Application Component
// React SPA with client-side routing and modern state management
// Built with TypeScript, React 18, and Tailwind CSS

import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { initGA, initScrollTracking } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ChiSiamo from "./pages/ChiSiamo";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Portfolio from "./pages/Portfolio";
import PortfolioPublic from "./pages/PortfolioPublic";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import Offerta197 from "./pages/Offerta197";
import Offerta197Form from "./pages/Offerta197Form";
import ThankYou from "./pages/ThankYou";


import CookieBanner from "./components/CookieBanner";

// Componente per scroll automatico all'inizio di ogni pagina
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  // Initialize Google Analytics page tracking
  useAnalytics();
  
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chi-siamo" component={ChiSiamo} />
        <Route path="/portfolio" component={PortfolioPublic} />
        <Route path="/portfolio-public" component={PortfolioPublic} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/offerta-197" component={Offerta197} />
        <Route path="/offerta-197form" component={Offerta197Form} />
        <Route path="/thankyou" component={ThankYou} />

        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
      initScrollTracking();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <CookieBanner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;