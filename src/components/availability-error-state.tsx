import { Button } from "@/components/ui/button";
import { CalendarX, Clock, RefreshCw, Scissors } from "lucide-react";

interface AvailabilityErrorStateProps {
  errorType: string;
  onResetDate?: () => void;
  onRetry?: () => void;
}

export default function AvailabilityErrorState({
  errorType,
  onResetDate,
  onRetry,
}: AvailabilityErrorStateProps) {
  if (!errorType) return null;

  const renderContent = () => {
    switch (errorType) {
      case "select_service":
        return (
          <>
            <Scissors className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-lg font-medium text-foreground mb-1">
              Selecione um serviço ✂️
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Escolha o tipo de atendimento antes de ver os horários
              disponíveis.
            </p>
          </>
        );

      case "not_work_time":
        return (
          <>
            <CalendarX className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-lg font-medium text-foreground mb-1">
              Nenhum horário disponível 😕
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Esse profissional está com a agenda cheia nesse dia.
            </p>
            {onResetDate && (
              <Button
                variant="outline"
                onClick={onResetDate}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Escolher outra data
              </Button>
            )}
          </>
        );

      case "error_load_work_time":
      default:
        return (
          <>
            <Clock className="w-10 h-10 text-destructive mb-2" />
            <p className="text-lg font-medium text-destructive mb-1">
              Ocorreu um erro ao carregar horários
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Verifique sua conexão ou tente novamente em instantes.
            </p>
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </Button>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
      {renderContent()}
    </div>
  );
}
