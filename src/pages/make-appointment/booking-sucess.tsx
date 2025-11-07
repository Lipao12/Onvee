import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <CheckCircle2 className="w-16 h-16 text-green-500 rounded-full flex items-center justify-center" />
      <h3 className="text-2xl font-bold">Agendamento confirmado!</h3>
      <p className="text-gray-400">
        Você receberá uma notificação por e-mail e WhatsApp.
      </p>
      <Button className="h-12  px-8 text-base font-medium">
        Fazer novo Agendamento
      </Button>
    </div>
  );
}
