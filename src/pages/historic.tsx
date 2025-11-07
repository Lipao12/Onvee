import { Card, CardContent } from "@/components/ui/card";
import { fetchAllAppointments } from "@/lib/appointments";
import { useEffect, useState } from "react";
type AppointmentStatus = "completed" | "scheduled";

interface Appointment {
  id: string;
  barbershops: {
    id: string;
    name: string;
  };
  barbers: {
    id: string;
    full_name: string;
  };
  services: {
    id: string;
    name: string;
  };
  start_time: string;
  status: AppointmentStatus;
}
/*const agendamentos: Appointment[] = [
  {
    id: "1",
    barber_shop: {
      id: 1,
      name: "White Hair",
    },
    barber: {
      id: 1,
      name: "John",
    },
    service: {
      id: 1,
      name: "Corte de Cabelo",
    },
    date: "2025-11-05T15:30:00",
    status: "completed",
  },
  {
    id: "2",
    barber_shop: {
      id: 2,
      name: "Barber King",
    },
    barber: {
      id: 2,
      name: "Charles",
    },
    service: {
      id: 2,
      name: "Barba Completa",
    },
    date: "2025-11-07T10:00:00",
    status: "scheduled",
  },
  {
    id: "3",
    barber_shop: {
      id: 3,
      name: "Old School Barber",
    },
    barber: {
      id: 3,
      name: "Mark",
    },
    service: {
      id: 3,
      name: "Corte de Cabelo + Sobrancelhas",
    },
    date: "2025-11-10T18:45:00",
    status: "completed",
  },
  {
    id: "4",
    barber_shop: {
      id: 4,
      name: "Modern Fade Studio",
    },
    barber: {
      id: 4,
      name: "Alex",
    },
    service: {
      id: 4,
      name: "Corte de Cabelo + Barba",
    },
    date: "2025-11-12T14:00:00",
    status: "scheduled",
  },
];*/

const STATUS_DICT: { completed: string; scheduled: string } = {
  completed: "FINALIZADO",
  scheduled: "AGENDADO",
};

export default function AppointmentHistoric() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      const clientId = "b9a92b64-XXXX-XXXX-XXXX-XXXXXXXX"; // substitua pelo ID real
      setLoading(true);
      try {
        const res = await fetchAllAppointments(clientId);
        setAppointments(res);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  if (loading) return <p className="p-4">Carregando...</p>;

  return (
    <div className="flex flex-col pb-20 items-start justify-center space-y-6 w-full">
      {/* Header */}
      <header className="w-full p-4 border-b border-zinc-300 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl">
              Histórico de Agendamentos
            </h2>
            <p className="text-sm text-gray-500">
              Veja seus agendamentos anteriores e seus detalhes
            </p>
          </div>
        </div>
      </header>

      <div className="w-full space-y-4">
        {appointments.map((ag) => {
          const date = new Date(ag.start_time);

          const dia = date.toLocaleDateString("pt-BR", { day: "2-digit" });
          const mes = date.toLocaleDateString("pt-BR", { month: "long" });
          const hora = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Card
              key={ag.id}
              className="flex mx-2 justify-between items-center p-4 border-none shadow-none"
            >
              <CardContent className="flex flex-row sm:flex-row justify-between items-center w-full gap-4 p-0">
                <div>
                  <span
                    className={`uppercase inline-block px-3 py-1 rounded-full text-xs font-medium self-start
                ${
                  ag.status === "completed"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                  >
                    {STATUS_DICT[ag.status] || ag.status.toUpperCase()}
                  </span>
                  <div className="flex flex-col flex-1 text-left">
                    <h3 className="text-lg font-medium">{ag.services.name}</h3>
                    <p className="text-sm text-gray-500">
                      {ag.barbershops.name} • {ag.barbers.full_name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center px-3 py-2 w-20">
                  <span className="text-xs uppercase text-gray-500">{mes}</span>
                  <span className="text-4xl font-normal">{dia}</span>
                  <span className="text-md font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {hora}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
