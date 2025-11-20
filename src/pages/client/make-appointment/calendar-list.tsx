import AvailabilityErrorState from "@/components/availability-error-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBarberShop } from "@/context/barber-shop-provider";
import { ClientAppointmentContext } from "@/context/client-appoitment-provider";
import { addDays, format, isAfter, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";

interface AvailableSlot {
  start: Date;
  end: Date;
  barberId: string;
  barberName: string;
}

interface TimeSlot {
  start: Date;
  end: Date;
}

export default function CalendarList({
  onNext,
  serviceDuration = 30,
}: {
  onNext: (selectedDate: TimeSlot) => void;
  onBack: () => void;
  serviceDuration: number;
  barberId: string;
}) {
  const { fetchBarberAvailability } = useBarberShop();
  const clientAppointment = useContext(ClientAppointmentContext);
  if (!clientAppointment) {
    throw new Error(
      "MakeAppointment must be used within a ClientAppointmentProvider"
    );
  }
  const { service, barber } = clientAppointment;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //const selectedService = services.find((s) => s.id === service);
  //const serviceDuration = selectedService?.duration_minutes || 30;

  // Gerar próximos 14 dias
  const generateDateOptions = useCallback(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      if (isAfter(date, today) || isToday(date)) {
        dates.push(date);
      }
    }
    return dates;
  }, []);

  const dateOptions = generateDateOptions();

  // Buscar horários disponíveis quando a data muda
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!service) {
        setError("select_service");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const slots = await fetchBarberAvailability(
          barber?.id,
          selectedDate,
          serviceDuration
        );
        setAvailableSlots(slots);

        if (slots.length === 0) {
          setError("not_work_time");
        }
      } catch (err) {
        setError("error_load_work_time");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, service, serviceDuration, fetchBarberAvailability]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      /*setDate(selectedSlot.start);
      setTime(
        selectedSlot.start.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );*/
      onNext(
        selectedSlot
        /*selectedSlot.start.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })*/
      );
    }
  };

  // Agrupar slots por barbeiro
  const slotsByBarber = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.barberName]) acc[slot.barberName] = [];
    acc[slot.barberName].push(slot);
    return acc;
  }, {} as Record<string, AvailableSlot[]>);

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Data */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Data
            </CardTitle>
            <CardDescription>
              Selecione o dia do seu agendamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2">
              {dateOptions.map((date) => (
                <Button
                  key={date.toISOString()}
                  variant={
                    selectedDate.toDateString() === date.toDateString()
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleDateSelect(date)}
                  className="shrink-0 snap-center px-4 py-2 rounded-full capitalize"
                >
                  {isToday(date)
                    ? "Hoje"
                    : isTomorrow(date)
                    ? "Amanhã"
                    : format(date, "EEE dd/MM", { locale: ptBR })}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Horários Disponíveis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários Disponíveis
            </CardTitle>
            <CardDescription>
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Buscando horários disponíveis...
                </p>
              </div>
            )}

            {error && !loading && (
              <AvailabilityErrorState
                errorType={error}
                onResetDate={() => setSelectedDate(new Date())}
                onRetry={() => window.location.reload()}
              />
            )}

            {!loading && !error && (
              <div className="space-y-6">
                {Object.entries(slotsByBarber).map(([barberName, slots]) => (
                  <div key={barber?.full_name} className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {barberName ? barber?.full_name : barber?.full_name}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {slots.map((slot, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedSlot?.start.getTime() ===
                            slot.start.getTime()
                              ? "default"
                              : "outline"
                          }
                          className="h-14"
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {format(slot.start, "HH:mm")}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                 <div className="flex justify-center mt-8">
              <Button
                onClick={handleConfirm}
                className="h-12 px-8 text-base font-medium transition"
              >
                Confirmar Horário
              </Button>
            </div>
              </div>
            )}

           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
