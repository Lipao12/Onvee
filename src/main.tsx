import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth-provider.tsx";
import { BarberShopProvider } from "./context/barber-shop-provider.tsx";
import { ClientAppointmentProvider } from "./context/client-appoitment-provider.tsx";
import { OnboardingProvider } from "./context/onboarding-provider.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <OnboardingProvider>
            <BarberShopProvider>
              <ClientAppointmentProvider>
                <App />
              </ClientAppointmentProvider>
            </BarberShopProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
