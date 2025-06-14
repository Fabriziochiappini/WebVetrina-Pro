// WebPro Italia - Main Application Component
// React SPA with client-side routing and modern state management
// Built with TypeScript, React 18, and Tailwind CSS

import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ChiSiamo from "./pages/ChiSiamo";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Portfolio from "./pages/PortfolioPublic";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Admin from "./pages/Admin";
import FloatingCta from "./components/FloatingCta";
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
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chi-siamo" component={ChiSiamo} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <FloatingCta />
        <CookieBanner />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;