import React from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { LiveTicker } from "@/components/layout/LiveTicker";
import { BootLoader } from "@/components/layout/BootLoader";
import { AnimatePresence } from "framer-motion";
import Home from "@/pages/Home";
import Fixtures from "@/pages/Fixtures";
import FixtureDetail from "@/pages/FixtureDetail";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Groups from "@/pages/Groups";
import Bracket from "./pages/Bracket";
import About from "./pages/About";
import Stadiums from "./pages/Stadiums";
import HostCities from "./pages/HostCities";
import History from "./pages/History";
import Records from "./pages/Records";
import News from "@/pages/News";
import Stats from "@/pages/Stats";
import { MouseTrail } from "@/components/ui/mouse-trail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  
  // Need to use useEffect to scroll to top whenever location changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  const [location] = useLocation();
  const [isBooted, setIsBooted] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimatePresence>
        {!isBooted && (
          <BootLoader key="bootloader" onReady={() => setIsBooted(true)} />
        )}
      </AnimatePresence>

      {isBooted && (
        <>
          <MouseTrail />
          <ScrollToTop />
          <Navbar />
          <div className="flex-1 flex flex-col pt-[72px]">
            {location === "/" && <LiveTicker />}
            <main className="flex-1">
              <PageTransition>
                <Switch location={location}>
                  <Route path="/" component={Home} />
                  <Route path="/fixtures" component={Fixtures} />
                  <Route path="/fixtures/:id" component={FixtureDetail} />
                  <Route path="/teams" component={Teams} />
                  <Route path="/teams/:id" component={TeamDetail} />
                  <Route path="/groups" component={Groups} />
                  <Route path="/bracket" component={Bracket} />
                  <Route path="/about" component={About} />
                  <Route path="/stadiums" component={Stadiums} />
                  <Route path="/host-cities" component={HostCities} />
                  <Route path="/history" component={History} />
                  <Route path="/records" component={Records} />
                  
                  {/* Stubs for future phases */}
                  <Route path="/news" component={News} />
                  <Route path="/stats" component={Stats} />
                  <Route>
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                      <span className="font-display text-6xl text-primary">404</span>
                      <p className="text-muted-foreground">Page not found</p>
                    </div>
                  </Route>
                </Switch>
              </PageTransition>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <Toaster theme="dark" />
      </WouterRouter>
    </QueryClientProvider>
  );
}
