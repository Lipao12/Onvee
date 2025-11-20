import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("client_session");
    // Force reload or navigate to ensure state is cleared
    navigate("/login");
    window.location.reload();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      title="Sair"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
}
