import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <Scissors className="w-5 h-5" />
          </div>
          <span>BarberPro</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button onClick={() => navigate("/findbarber")}>
            Encontrar Barbeiro
          </Button>
        </div>
      </div>
    </header>
  );
}
