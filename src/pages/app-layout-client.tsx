// src/layouts/AppLayout.tsx
import { useBarberShop } from "@/context/barber-shop-provider";
import LoadingPage from "@/pages/loading";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { loading, fetchShopData, shop } = useBarberShop();
  const navigate = useNavigate();
  const location = useLocation();

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
  return (
    <div
      className={`pt-16 flex flex-col ${
        isHomePage ? "h-screen justify-center" : "min-h-screen"
      }`}
    >
      <Outlet />
    </div>
  );
}
