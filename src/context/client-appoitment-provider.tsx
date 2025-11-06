import { createContext, useState, type ReactNode } from "react";

interface ClientAppointmentContextType {
  service: string;
  barber: string;
  date: Date;
  setService: (service: string) => void;
  setBarber: (barber: string) => void;
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
  const [service, setService] = useState("");
  const [barber, setBarber] = useState("");
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
