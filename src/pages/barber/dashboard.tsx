"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppointmentEnd } from "@/lib/appointments";
import { supabase } from "@/lib/supabase-client";
import { CalendarDays, Scissors, Users } from "lucide-react";
import { useEffect, useState } from "react";

type Stat = {
  barbers: number;
  appointments: number;
  clients: number;
};

type Appointment = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  barbers: { full_name: string };
  services: { name: string };
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stat | null>(null);
  const [appointments, setAppointments] = useState<AppointmentEnd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const [barbersRes, appointmentsRes, clientsRes] = await Promise.all([
        supabase.from("barbers").select("id", { count: "exact", head: true }),
        supabase
          .from("appointments")
          .select(
            `
            id, start_time, end_time, status,
            barbers:barber_id(full_name),
            services:service_id(name)
          `
          )
          .order("start_time", { ascending: true })
          .limit(5),
        supabase.from("client").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        barbers: barbersRes.count ?? 0,
        appointments: appointmentsRes.data?.length ?? 0,
        clients: clientsRes.count ?? 0,
      });
      const normalized: AppointmentEnd[] = (appointmentsRes.data ?? []).map(
        (appt: any) => {
          return {
            id: String(appt.id),
            start_time: appt.start_time,
            end_time: appt.end_time,
            status: appt.status,
            barbers: appt.barbers
              ? appt.barbers ?? { id: "", full_name: "Desconhecido" }
              : { id: "", full_name: "Desconhecido" },
            barbershops: appt.barbershops
              ? appt.barbershops ?? { id: "", name: "Não informado" }
              : { id: "", name: "Não informado" },
            services: appt.services
              ? appt.services ?? { id: "", name: "Serviço não informado" }
              : { id: "", name: "Serviço não informado" },
          };
        }
      );
      setAppointments(normalized || []);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        Carregando dados...
      </div>
    );
  }

  return (
    <main className="p-6 space-y-8 pb-20">
      {/* Cabeçalho */}
      <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        Dashboard
      </h1>

      {/* Estatísticas principais */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-50 dark:bg-zinc-900/60 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Barbeiros ativos
            </CardTitle>
            <Scissors className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.barbers}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 dark:bg-zinc-900/60 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Próximos agendamentos
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.appointments}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 dark:bg-zinc-900/60 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              Clientes cadastrados
            </CardTitle>
            <Users className="w-4 h-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.clients}</div>
          </CardContent>
        </Card>
      </section>

      {/* Lista de agendamentos */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-3">
          Próximos atendimentos
        </h2>
        {appointments.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhum agendamento encontrado.
          </p>
        ) : (
          <div className="space-y-2">
            {appointments.map((appt) => (
              <Card
                key={appt.id}
                className="bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {appt.services?.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {appt.barbers?.full_name}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(appt.start_time).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
