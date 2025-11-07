import type { Barber } from "@/types/barber";
import type { Service } from "@/types/service";
import { createContext, useState, type ReactNode } from "react";

interface ClientAppointmentContextType {
  service: Service | null;
  barber: Barber | null;
  date: Date;
  setService: (service: Service) => void;
  setBarber: (barber: Barber) => void;
  setDate: (date: Date) => void;
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
  const [date, setDate] = useState(new Date());

  return (
    <ClientAppointmentContext.Provider
      value={{
        service,
        barber,
        date,
        setService,
        setBarber,
        setDate,
      }}
    >
      {children}
    </ClientAppointmentContext.Provider>
  );
}
