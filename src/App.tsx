import { Navigate, Route, Routes } from "react-router-dom";
import BottomBar from "./components/bottom-bar";
import ProtectedRoute from "./components/protected-route";
import SecurityView from "./components/security-view";
import { useIsMobile } from "./lib/use-mobile";
import AppointmentHistoric from "./pages/historic";
import Login from "./pages/login";
import MakeAppointment from "./pages/make-appointment";
import UserBarberCode from "./pages/user-barber-code";

export default function App() {
  const isMobile = useIsMobile();

  const shouldHideBottomBar = () => {
    const path = location.pathname;
    return path.startsWith("/findbarber");
  };

  const hideBottomBar = shouldHideBottomBar();

  return (
    <SecurityView>
      <Routes>
        <Route path="/findbarber" element={<UserBarberCode />} />
        <Route path="/login" element={<Login />} />

        {/* Rota protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Aqui fica os protegidos</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<MakeAppointment />} />
        <Route path="/services" element={<MakeAppointment />} />
        <Route path="/newappointment" element={<MakeAppointment />} />
        <Route path="/appointments" element={<AppointmentHistoric />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isMobile && !hideBottomBar && <BottomBar />}
    </SecurityView>
  );
}
