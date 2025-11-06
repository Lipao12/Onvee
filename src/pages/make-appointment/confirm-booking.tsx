import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Scissors, User } from "lucide-react";

interface ConfirmBookingProps {
  onNext: () => void;
  info: {
    barber: { name: string };
    service: { name: string };
    date: Date;
  };
}

export default function ConfirmBooking({ onNext, info }: ConfirmBookingProps) {
  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <Card className="border-none shadow-none rounded-2xl bg-transparent">
        <CardContent className="space-y-4 text-gray-700">
          <div className="flex items-center gap-3 border-b pb-2">
            <Scissors className="w-5 h-5 text-gray-600  dark:text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Serviço
              </p>
              <p className="font-medium text-gray-900 dark:text-zinc-300">
                {info.service.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-b pb-2">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Barbeiro
              </p>
              <p className="font-medium text-gray-900 dark:text-zinc-300">
                {info.barber.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-gray-600 dark:text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data e Horário
              </p>
              <p className="font-medium text-zinc-900 dark:text-zinc-300">
                {info.date.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          className="h-12 px-8 text-base font-medium transition"
        >
          Confirmar Agendamento
        </Button>
      </div>
    </div>
  );
}
