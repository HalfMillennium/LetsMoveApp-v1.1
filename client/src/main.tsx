import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";
import { SearchPartyProvider } from "./context/SearchPartyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Get the Clerk publishable key from environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <SearchPartyProvider>
          <App />
        </SearchPartyProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </ClerkProvider>,
);
