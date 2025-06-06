import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchPartyProvider } from "./context/SearchPartyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ClerkProvider } from "@clerk/clerk-react";

// Get the Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <SearchPartyProvider>
          <App />
        </SearchPartyProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </ClerkProvider>,
);
