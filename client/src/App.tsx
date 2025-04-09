import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "./components/Header";
import MobileNavBar from "./components/MobileNavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Listings2 from "./pages/Listings2";
import SearchParty from "./pages/SearchParty";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route path="/listings2" component={Listings2} />
      <Route path="/search-party" component={SearchParty} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isListings2Page = location === "/listings2";

  return (
    <div className="flex flex-col min-h-screen">
      {!isListings2Page && <Header />}
      <main className={`flex-1 ${isListings2Page ? '' : 'flex'}`}>
        <Router />
      </main>
      {!isListings2Page && <Footer />}
      {!isListings2Page && <MobileNavBar />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
