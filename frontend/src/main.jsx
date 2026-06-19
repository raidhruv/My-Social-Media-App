import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </StrictMode>
);