import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchPartyProvider } from "./context/SearchPartyContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <SearchPartyProvider>
        <App />
      </SearchPartyProvider>
    </FavoritesProvider>
  </QueryClientProvider>
);
