import BottomBar from "@/components/bottom-bar";
import Sidebar from "@/components/sidebar";
import { useBarberShop } from "@/context/barber-shop-provider";
import { useIsMobile } from "@/lib/use-mobile";
import LoadingPage from "@/pages/loading";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { loading, fetchShopData, shop } = useBarberShop();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedShopId = localStorage.getItem("barbershop_id");

    if (!storedShopId) {
      navigate("/findbarber");
      return;
    }

    fetchShopData(storedShopId);
  }, []);

  if (loading || !shop) {
    return <LoadingPage />;
  }

  const isHomePage = location.pathname === "/home";
  const isOnboardingPage = location.pathname === "/barber/onboarding";

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && <Sidebar />}

      <div
        className={`flex-1 flex flex-col ${
          isOnboardingPage ? "" : isMobile ? "pt-16" : ""
        } ${isHomePage ? "justify-center" : ""}`}
      >
        <Outlet />
        {isMobile && <BottomBar />}
      </div>
    </div>
  );
}
