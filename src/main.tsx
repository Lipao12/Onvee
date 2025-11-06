import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ClientAppointmentProvider } from "./context/client-appoitment-provider.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ClientAppointmentProvider>
          <App />
        </ClientAppointmentProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
