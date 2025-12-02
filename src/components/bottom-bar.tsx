import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, type UserRole } from "@/context/auth-provider";
import { supabase } from "@/lib/supabase-client";
import {
  Calendar,
  Clock,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TabConfig {
  name: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  roles: UserRole[];
}

export default function BottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("barbershop_id");
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSheetOpen(false);
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
    { name: "Sair", icon: LogOut, action: handleLogout, roles: ["barber"] },
  ];

  // Owner Tabs (Bottom Bar)
  const ownerTabs: TabConfig[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/owner/dashboard",
      roles: ["owner"],
    },
    { name: "Agenda", icon: Calendar, path: "/agenda", roles: ["owner"] },
    { name: "Menu", icon: Menu, roles: ["owner"] }, // Triggers Sheet
  ];

  // Owner Side Menu Items
  const ownerMenuItems = [
    { name: "Barbeiros", icon: Users, path: "/owner/manage-barbers" },
    { name: "Serviços", icon: Scissors, path: "/owner/manage-services" },
    { name: "Configurações", icon: Settings, path: "/owner/config-barbershop" },
  ];

  const getTabs = () => {
    if (isLoading) return [];
    if (!isAuthenticated || !user) return clientTabs; // Default to client/unauth

    if (user.role === "client") return clientTabs;
    if (user.role === "barber") return barberTabs;
    if (user.role === "owner") return ownerTabs;

    return [];
  };

  const tabs = getTabs();

  if (isLoading) return null;

  return (
    <>
      <nav
        className={`fixed z-50 transform duration-500 backdrop-blur-2xl ${
          isIOS
            ? "rounded-3xl bottom-3 left-4 right-4"
            : "bottom-0 left-0 right-0"
        } 
        border-t dark:border-background/10 dark:bg-foreground/5 bg-background/80 border-foreground/10 h-20`}
      >
        <div className="flex justify-around items-center py-2 px-1 h-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.path ? location.pathname === tab.path : false;
            const activeColor = "text-[var(--step-active)]";

            if (tab.name === "Menu") {
              return (
                <Sheet
                  key={tab.name}
                  open={isSheetOpen}
                  onOpenChange={setIsSheetOpen}
                >
                  <SheetTrigger asChild>
                    <button className="flex flex-col items-center justify-center transition-all duration-200 active:scale-95 opacity-70 hover:opacity-100">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full">
                        <Icon className="w-6 h-6 text-gray-400" />
                      </div>
                      <span className="text-[11px] font-medium mt-1 text-gray-500">
                        {tab.name}
                      </span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                      {ownerMenuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigate(item.path)}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="bg-primary/10 p-2 rounded-full">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </button>
                      ))}
                      <div className="h-[1px] bg-border my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
                      >
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Sair</span>
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            }

            return (
              <button
                key={tab.name}
                onClick={() => {
                  if (tab.action) tab.action();
                  else if (tab.path) handleNavigate(tab.path);
                }}
                className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${
                  isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isActive
                      ? "bg-linear-to-br from-[var(--step-active)]/50 dark:from-[var(--step-current)]/50 to-transparent"
                      : ""
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? activeColor : "text-gray-400"
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] font-medium mt-1 ${
                    isActive ? activeColor : "text-gray-500"
                  }`}
                >
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
