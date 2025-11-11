import { supabase } from "@/lib/supabase-client";
import {
  Calendar,
  Clock,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  Scissors,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const handleNavigate = async (path: string) => {
    if (path === "/logout") {
      handleLogout();
      navigate("/");
    }
    navigate(path);
  };

  /*const tabs = [
    { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Reserva", icon: Plus, path: "/newappointment" },
    { name: "Histórico", icon: Calendar, path: "/appointments" },
    //{ name: "Sair", icon: LogOut, path: "/logout" },
  ];*/

  const barberTabs = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/barber/dashboard" },
    { name: "Agenda", icon: Calendar, path: "/barber/schedule" },
    { name: "Horários", icon: Clock, path: "/barber/working-hours" },
    { name: "Serviços", icon: Scissors, path: "/owner/menage-services" },
    { name: "Sair", icon: LogOut, path: "/logout" },
    { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Reserva", icon: Plus, path: "/newappointment" },
    { name: "Histórico", icon: Calendar, path: "/appointments" },
  ];

  const handleLogout = async () => {
    supabase.auth.signOut();
  };

  return (
    <nav
      className={`fixed z-50 transform duration-500 backdrop-blur-md ${
        isIOS
          ? "rounded-3xl bottom-3 left-4 right-4"
          : "bottom-0 left-0 right-0" //rounded-t-2xl
      } 
      border-t dark:border-white/10 dark:bg-zinc-900/70 bg-white/70 border-black/15 h-20
       
        `}
    >
      <div className="flex justify-around items-center py-2 px-1">
        {barberTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === "/home"
              ? location.pathname === "/" || location.pathname === "/home"
              : location.pathname === tab.path;

          const activeColor = "text-blue-600 dark:text-blue-300";
          /*const activeGlow =
            "shadow-[0_0_8px_rgba(96,165,250,0.8)] bg-blue-500/20 border border-blue-400/30";*/

          return (
            <button
              key={tab.name}
              onClick={() => handleNavigate(tab.path)}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isActive || tab.name === "Sair"
                    ? "bg-linear-to-br from-blue-600/50 dark:from-blue-300/50 to-transparent"
                    : ""
                }
                `}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive || tab.name === "Sair"
                      ? activeColor
                      : "text-gray-400"
                  } `}
                />
              </div>
              <span
                className={`text-[11px] font-medium mt-1 ${
                  isActive || tab.name === "Sair"
                    ? activeColor
                    : "text-gray-500"
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
