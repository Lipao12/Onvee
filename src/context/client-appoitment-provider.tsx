import type { Barber } from "@/types/barber";
import type { Service } from "@/types/service";
import { createContext, useState, type ReactNode } from "react";

interface ClientAppointmentContextType {
  service: Service | null;
  barber: Barber | null;
  slotDate: TimeSlot;
  setService: (service: Service) => void;
  setBarber: (barber: Barber) => void;
  setSlotDate: (slotDate: TimeSlot) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
}

export const ClientAppointmentContext = createContext<
  ClientAppointmentContextType | undefined
>(undefined);

export function ClientAppointmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [slotDate, setSlotDate] = useState<TimeSlot>({
    start: new Date(),
    end: new Date(),
  });

  return (
    <ClientAppointmentContext.Provider
      value={{
        service,
        barber,
        slotDate,
        setService,
        setBarber,
        setSlotDate,
      }}
    >
      {children}
    </ClientAppointmentContext.Provider>
  );
}
