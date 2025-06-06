import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchPartyProvider } from "./context/SearchPartyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FavoritesProvider>
        <SearchPartyProvider>
          <App />
        </SearchPartyProvider>
      </FavoritesProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
