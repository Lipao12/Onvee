import { Button } from "@/components/ui/button";
import { useBarberShop } from "@/context/barber-shop-provider";
import { Instagram, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPage from "../loading";

export default function ClientHomePage() {
  const [serachParams] = useSearchParams();
  const shopId =
    serachParams.get("shop") || localStorage.getItem("barbershop_id");

  const { loading, fetchShopData } = useBarberShop();
  useEffect(() => {
    fetchShopData(shopId);
  }, [shopId]);

  const clientAppointment = useBarberShop();
  if (!clientAppointment) {
    throw new Error(
      "MakeAppointment must be used within a ClientAppointmentProvider"
    );
  }
  const { shop, barbershop_config } = clientAppointment;
  const navigator = useNavigate();

  const goTo = (path: string) => {
    navigator(path);
  };
  console.log("Barbershop Config:", barbershop_config);

  if (loading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex flex-1 flex-col justify-center items-center space-y-8 pb-24">
      <div className="relative">
        <img
          src={shop?.image_url ?? "/placeholder-barber.jpg"}
          alt={shop?.name}
          className="h-36 w-36 rounded-full object-cover ring-4 ring-accent/30 shadow-lg transition-transform hover:scale-105"
        />
        {/* <span className="absolute -bottom-1 right-0 rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">Aberto</span> */}
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-2xl font-bold  md:text-3xl">
          {shop?.name}
        </h1>

        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{shop?.address}</span>
        </div>
      </div>

      {barbershop_config?.instagram_user && (
        <Button
          variant="outline"
          className="mt-6 w-full max-w-xs  gap-2 group"
          onClick={() =>
            window.open(
              barbershop_config.instagram_user
                ? "https://instagram.com/" + barbershop_config.instagram_user
                : "https://instagram.com",
              "_blank"
            )
          }
        >
          <div className="relative flex items-center justify-center overflow-hidden rounded-sm bg-linear-60 from-pink-500 via-purple-500 to-orange-400 p-0.5 transition-all group-hover:scale-110">
            <Instagram className="h-5 w-5 text-amber-100  bg-clip-text" />
          </div>
          <span>Ver no Instagram</span>
        </Button>
      )}

      <div className="mt-4 mb-8 w-full max-w-xs border-t border-border/50" />

      <div className="grid w-full max-w-xs grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="default"
          className=" h-12 text-base font-medium "
          onClick={() => {
            goTo("/newappointment");
          }}
        >
          Nova Reserva
        </Button>

        <Button
          className="h-12 dark:bg-neutral-900 bg-neutral-100 text-neutral-900 dark:text-neutral-100 text-base font-medium hover:bg-accent/90"
          onClick={() => {
            goTo("/appointments");
          }}
        >
          Minhas Reservas
        </Button>
      </div>

      <footer className="mt-12  text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {shop?.name}
      </footer>
    </div>
  );
}
