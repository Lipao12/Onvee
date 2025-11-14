import { useBarberShop } from "@/context/barber-shop-provider";
import { ClientAppointmentContext } from "@/context/client-appoitment-provider";
import { createAppointment } from "@/lib/appointments";
import type { Barber } from "@/types/barber";
import type { Service } from "@/types/service";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCheck,
  PartyPopper,
  Scissors,
  User,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingPage from "../../loading";
import BarbersList from "./barber-list";
import BookingSuccess from "./booking-sucess";
import CalendarList from "./calendar-list";
import ConfirmBooking from "./confirm-booking";
import ServicesList from "./services-list";

// Definição dos passos
interface Step {
  id: number;
  title: string;
  Icon: LucideIcon;
  description?: string;
}

interface TimeSlot {
  start: Date;
  end: Date;
}

const STEPS: Step[] = [
  { id: 1, title: "O que vai fazer hoje?", Icon: Scissors },
  { id: 2, title: "Escolha seu barbeiro", Icon: User },
  { id: 3, title: "Qual o melhor horário para você?", Icon: Calendar },
  { id: 4, title: "Verifique se está tudo certo", Icon: CheckCheck },
  { id: 5, title: "Corte marcado!", Icon: PartyPopper },
];

const TOTAL_STEPS = STEPS.length;

export default function MakeAppointment() {
  const [serachParams] = useSearchParams();
  const shopId =
    serachParams.get("shop") || localStorage.getItem("barbershop_id");

  const [currentStep, setCurrentStep] = useState(1);

  const { loading } = useBarberShop();

  const clientAppointment = useContext(ClientAppointmentContext);
  if (!clientAppointment) {
    throw new Error(
      "MakeAppointment must be used within a ClientAppointmentProvider"
    );
  }
  const {
    service,
    barber,
    slotDate,
    setService,
    setBarber,
    setSlotDate,
    clearData,
  } = clientAppointment;

  // Navegação segura
  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Handlers para salvar as escolhas do usuário
  const handleSelectService = (selectedService: Service) => {
    setService(selectedService);
    goToNext();
  };

  const handleSelectBarber = (selectedBarber: Barber) => {
    setBarber(selectedBarber);
    goToNext();
  };

  const handleSelectDate = (selectedDate: TimeSlot) => {
    setSlotDate(selectedDate);
    //setCurrentStep(4);
    goToNext();
  };

  const handleCreatingAppointment = async () => {
    const appointmentInfo = {
      barber_id: barber?.id,
      barbershop_id: shopId,
      service_id: service?.id,
      start_time: slotDate.start.toISOString(),
      end_time: slotDate.end.toISOString(),
      status: "scheduled" as const,
    };
    try {
      await createAppointment(appointmentInfo);
      goToNext();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNewAppointment = () => {
    clearData();
    setCurrentStep(1);
  };

  const currentStepData = STEPS[currentStep - 1];

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div
      className="flex flex-col h-full"
      role="region"
      aria-labelledby="appointment-title"
    >
      <header className="p-4 border-b border-zinc-300 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 id="appointment-title" className="text-2xl font-semibold">
              {currentStepData.title}
            </h2>
          </div>

          <nav
            aria-label="Etapas do agendamento"
            className=" flex justify-start items-center gap-6"
          >
            {STEPS.map((step) => {
              const isActive = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <motion.div
                  key={step.id}
                  onClick={() => {
                    if (isActive && currentStep !== STEPS.length)
                      setCurrentStep(step.id);
                  }}
                  className={`flex flex-col items-center text-xs ${
                    isCurrent
                      ? "text-[var(--step-current)]" //"text-blue-400"
                      : isActive
                      ? "text-[var(--step-active)]" //"text-blue-700"
                      : "text-zinc-500"
                  }`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`w-7 h-2 rounded-sm mb-1 transition-all ${
                      isCurrent
                        ? "bg-[var(--step-current)] shadow-[0_0_6px_rgba(59,130,246,0.8)]" //"bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                        : isActive
                        ? "bg-[var(--step-active)]" //"bg-blue-600"
                        : "dark:bg-zinc-700 bg-zinc-400"
                    }`}
                  />
                  {<step.Icon className="h-4 w-4 mt-1" />}
                </motion.div>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {currentStep === 1 && <ServicesList onNext={handleSelectService} />}
        {currentStep === 2 && (
          <BarbersList onNext={handleSelectBarber} onBack={goToPrev} />
        )}
        {currentStep === 3 && (
          <CalendarList
            onNext={handleSelectDate}
            onBack={() => {}}
            barberId={barber ? barber.id : ""}
            serviceDuration={service ? service.duration_minutes : 30}
          />
        )}
        {currentStep === 4 && (
          <ConfirmBooking
            onNext={handleCreatingAppointment}
            info={{ barber: barber, service: service, date: slotDate.start }}
          />
        )}
        {currentStep === 5 && (
          <BookingSuccess onNext={handleStartNewAppointment} />
        )}
      </main>
    </div>
  );
}
