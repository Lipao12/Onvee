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
import { Button } from "./ui/button";

interface TabConfig {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  roles: UserRole[];
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("barbershop_id");
    await supabase.auth.signOut();
    navigate("/");
  };

  // Client Tabs
  const clientTabs: TabConfig[] = [
    { name: "Home", icon: HomeIcon, path: "/home", roles: ["client"] },
    { name: "Agendar", icon: Plus, path: "/newappointment", roles: ["client"] },
    {
      name: "Histórico",
      icon: Calendar,
      path: "/appointments",
      roles: ["client"],
    },
  ];

  // Barber Tabs
  const barberTabs: TabConfig[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/barber/dashboard",
      roles: ["barber"],
    },
    { name: "Agenda", icon: Calendar, path: "/agenda", roles: ["barber"] },
    {
      name: "Horários",
      icon: Clock,
      path: "/barber/working-hours",
      roles: ["barber"],
    },
  ];

  // Owner Tabs
  const ownerTabs: TabConfig[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/owner/dashboard",
      roles: ["owner"],
    },
    { name: "Agenda", icon: Calendar, path: "/agenda", roles: ["owner"] },
    {
      name: "Barbeiros",
      icon: Users,
      path: "/owner/manage-barbers",
      roles: ["owner"],
    },
    {
      name: "Serviços",
      icon: Scissors,
      path: "/owner/manage-services",
      roles: ["owner"],
    },
    {
      name: "Configurações",
      icon: Settings,
      path: "/owner/config-barbershop",
      roles: ["owner"],
    },
  ];

  const getTabs = () => {
    if (isLoading) return [];
    if (!isAuthenticated || !user) return clientTabs;

    if (user.role === "client") return clientTabs;
    if (user.role === "barber") return barberTabs;
    if (user.role === "owner") return ownerTabs;

    return [];
  };

  const tabs = getTabs();

  if (isLoading) return null;

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <Scissors className="w-5 h-5" />
          </div>
          <span>BarberPro</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.path ? location.pathname === tab.path : false;

          return (
            <Button
              key={tab.name}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${isActive ? "font-semibold" : "font-normal text-muted-foreground"}`}
              onClick={() => {
                if (tab.action) tab.action();
                else if (tab.path) navigate(tab.path);
              }}
            >
              <Icon className="w-5 h-5" />
              {tab.name}
            </Button>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}
