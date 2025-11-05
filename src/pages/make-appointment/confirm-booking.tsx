import { Button } from "@/components/ui/button";

export default function ConfirmBooking({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Revise seu agendamento</h3>
      <div className="bg-zinc-900 p-4 rounded-lg space-y-2">
        <p>
          <strong>Serviço:</strong> Corte Clássico
        </p>
        <p>
          <strong>Barbeiro:</strong> João Silva
        </p>
        <p>
          <strong>Data:</strong> 10/11/2025 às 14:00
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onNext}
          className="h-12 flex-1 text-md rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
