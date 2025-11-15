import { useAuth, type UserRole } from "@/context/auth-provider";
import { supabase } from "@/lib/supabase-client";
import {
  Calendar,
  Clock,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
interface TabConfig {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: UserRole[];
}

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const { user, isAuthenticated } = useAuth();

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

  // Configuração centralizada de todas as abas
  const allTabs: TabConfig[] = [
    // Client Tabs
    {
      name: "Home",
      icon: HomeIcon,
      path: "/home",
      roles: ["client", "unauthenticated"],
    },
    {
      name: "Agendar",
      icon: Plus,
      path: "/newappointment",
      roles: ["client", "unauthenticated"],
    },
    {
      name: "Histórico",
      icon: Calendar,
      path: "/appointments",
      roles: ["client", "unauthenticated"],
    },

    // Barber Tabs
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/barber/dashboard",
      roles: ["barber", "owner"],
    },
    {
      name: "Agenda",
      icon: Calendar,
      path: "/barber/schedule",
      roles: ["barber", "owner"],
    },
    {
      name: "Horários",
      icon: Clock,
      path: "/barber/working-hours",
      roles: ["barber", "owner"],
    },

    // Owner Tabs
    {
      name: "Serviços",
      icon: Scissors,
      path: "/owner/manage-services",
      roles: ["owner"],
    },
    {
      name: "Barbeiros",
      icon: Users,
      path: "/owner/manage-barbers",
      roles: ["owner"],
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/owner/settings",
      roles: ["owner"],
    },

    {
      name: "Sair",
      icon: LogOut,
      path: "/logout",
      roles: ["client", "unauthenticated", "barber", "owner"],
    },
  ];
  const handleLogout = async () => {
    supabase.auth.signOut();
  };

  // Filtrar abas baseado no role do usuário
  const getFilteredTabs = () => {
    if (!isAuthenticated || !user)
      return allTabs.filter((tab) => tab.roles.includes("unauthenticated"));

    console.log(user);
    return allTabs.filter((tab) => tab.roles.includes(user.role as UserRole));
  };

  const tabs = getFilteredTabs();

  return (
    <nav
      className={`fixed z-50 transform duration-500 backdrop-blur-2xl ${
        isIOS
          ? "rounded-3xl bottom-3 left-4 right-4"
          : "bottom-0 left-0 right-0" //rounded-t-2xl
      } 
      border-t dark:border-background/10 dark:bg-foreground/5 bg-background/80 border-foreground/10 h-20
       
        `}
    >
      <div className="flex justify-around items-center py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === "/home"
              ? location.pathname === "/" || location.pathname === "/home"
              : location.pathname === tab.path;

          const activeColor = "text-[var(--step-active)]"; //"text-blue-600 dark:text-blue-300";
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
                    ? "bg-linear-to-br from-[var(--step-active)]/50 dark:from-[var(--step-current)]/50  to-transparent" //from-blue-600/50 dark:from-blue-300/50
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
