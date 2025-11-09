// src/layouts/AppLayout.tsx
import { useBarberShop } from "@/context/barber-shop-provider";
import LoadingPage from "@/pages/loading";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { loading, fetchShopData, shop } = useBarberShop();
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
}
