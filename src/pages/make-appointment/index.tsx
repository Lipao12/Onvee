import { motion } from "framer-motion";
import {
  Calendar,
  CheckCheck,
  PartyPopper,
  Scissors,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
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

const STEPS: Step[] = [
  { id: 1, title: "O que vai fazer hoje?", Icon: Sparkle },
  { id: 2, title: "Escolha seu barbeiro", Icon: Scissors },
  { id: 3, title: "Qual o melhor horário para você?", Icon: Calendar },
  { id: 4, title: "Confirmar agendamento", Icon: CheckCheck },
  { id: 5, title: "Corte marcado!", Icon: PartyPopper },
  // Adicione mais passos aqui no futuro
];

const TOTAL_STEPS = STEPS.length;

export default function MakeAppointment() {
  const [currentStep, setCurrentStep] = useState(1);

  // Navegação segura
  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const currentStepData = STEPS[currentStep - 1];

  return (
    <div
      className="flex flex-col h-full"
      role="region"
      aria-labelledby="appointment-title"
    >
      <header className="p-4 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 id="appointment-title" className="text-lg font-semibold">
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
                      ? "text-blue-400"
                      : isActive
                      ? "text-blue-700"
                      : "text-zinc-500"
                  }`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`w-6 h-2 rounded-sm mb-1 transition-all ${
                      isCurrent
                        ? "bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                        : isActive
                        ? "bg-blue-700"
                        : "bg-zinc-700"
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
        {currentStep === 1 && <ServicesList onNext={goToNext} />}
        {currentStep === 2 && (
          <BarbersList onNext={goToNext} onBack={goToPrev} />
        )}
        {currentStep === 3 && <CalendarList onNext={() => setCurrentStep(4)} />}
        {currentStep === 4 && (
          <ConfirmBooking onNext={() => setCurrentStep(STEPS.length)} />
        )}
        {currentStep === 5 && <BookingSuccess />}
      </main>
    </div>
  );
}
