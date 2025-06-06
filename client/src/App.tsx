import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/clerk-react";
import NotFound from "@/pages/not-found";
import Header from "./components/Header";
import MobileNavBar from "./components/MobileNavBar";
import Home from "./pages/Home";
import Listings2 from "./pages/Listings2";
import SearchParty from "./pages/SearchParty";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AcceptInvitation from "./pages/AcceptInvitation";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeFooter from "./components/Footer";

function Router() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/sign-in" component={SignIn} />
      <Route path="/sign-up" component={SignUp} />
      <Route path="/invite/:token" component={AcceptInvitation} />

      {/* Protected routes */}
      <Route path="/">
        {isLoaded && isSignedIn ? (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ) : (
          <Home />
        )}
      </Route>

      <Route path="/listings">
        <ProtectedRoute>
          <Listings2 />
        </ProtectedRoute>
      </Route>

      <Route path="/search-party">
        <ProtectedRoute>
          <SearchParty />
        </ProtectedRoute>
      </Route>

      <Route path="/favorites">
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isSignedIn } = useUser();
  const isListings2Page = location === "/listings";
  const isAuthPage = location === "/sign-in" || location === "/sign-up";

  return (
    <div className="flex flex-col min-h-screen bg-[#0D2436]">
      {!isAuthPage && location !== "/" && <Header />}
      <main className={`flex-1 flex`}>
        <Router />
      </main>
      {!isAuthPage && <HomeFooter />}
      {!isListings2Page && !isAuthPage && isSignedIn && <MobileNavBar />}
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
