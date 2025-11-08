import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BottomBar from "./components/bottom-bar";
import { useDynamicFavicon } from "./components/dynamic-favicon";
import Header from "./components/header";
import ProtectedRoute from "./components/protected-route";
import { useBarberShop } from "./context/barber-shop-provider";
import { useIsMobile } from "./lib/use-mobile";
import Dashboard from "./pages/barber/dashboard";
import AppointmentHistoric from "./pages/historic";
import ClientHomePage from "./pages/home";
import Login from "./pages/login";
import MakeAppointment from "./pages/make-appointment";
import UserBarberCode from "./pages/user-barber-code";

export default function App() {
  const isMobile = useIsMobile();
  const location = useLocation();

  const shouldHideBottomBar = () => {
    const path = location.pathname;
    return (
      path.startsWith("/findbarber") ||
      path.startsWith("/login") ||
      path === "/"
    );
  };

  const hideBottomBar = shouldHideBottomBar();

  const clientAppointment = useBarberShop();
  if (!clientAppointment) {
    throw new Error(
      "MakeAppointment must be used within a ClientAppointmentProvider"
    );
  }
  const { shop } = clientAppointment;

  useDynamicFavicon(shop?.image_url as string);

  return (
    <div>
      {isMobile && !hideBottomBar && (
        <Header title={shop?.name} logo_url={shop?.image_url as string} />
      )}
      <Routes>
        <Route path="/findbarber" element={<UserBarberCode />} />
        <Route path="/login" element={<Login />} />

        {/* Rota protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<UserBarberCode />} />
        <Route path="/home" element={<ClientHomePage />} />
        <Route path="/services" element={<MakeAppointment />} />
        <Route path="/newappointment" element={<MakeAppointment />} />
        <Route path="/appointments" element={<AppointmentHistoric />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isMobile && !hideBottomBar && <BottomBar />}
    </div>
  );
}
