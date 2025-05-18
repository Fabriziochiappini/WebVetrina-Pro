import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ChiSiamo from "@/pages/ChiSiamo";
import FloatingCta from "./components/FloatingCta";

// Import lazy per Admin
import { lazy, Suspense } from "react";
const Admin = lazy(() => import("@/pages/Admin"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chi-siamo" component={ChiSiamo} />
      <Route path="/admin">
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Caricamento...</div>}>
          <Admin />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <FloatingCta />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
