import { Card, CardContent } from "@/components/ui/card";
import type { AppointmentEnd, AppointmentStatus } from "@/lib/appointments";
import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

export default function Dashboard() {
  const [appointments, setAppointments] = useState<AppointmentEnd[]>([]);
  const [loading, setLoading] = useState(true);
  const [barberName, setBarberName] = useState("");
  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error("Usuário não autenticado");
        return setLoading(false);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        console.error("Perfil não encontrado", profileError);
        return setLoading(false);
      }
      setBarberName(profile.full_name || "Barbeiro");

      const { data: barber, error: barberError } = await supabase
        .from("barbers")
        .select("id, barbershop_id")
        .eq("profile_id", profile.id)
        .single();

      if (barberError || !barber) {
        console.error("Barbeiro não encontrado", barberError);
        return setLoading(false);
      }

      // Filtro apenas dos atendimentos de hoje
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const { data: rawAppointments, error: apptError } = await supabase
        .from("appointments")
        .select(
          `
            id,
            start_time,
            end_time,
            status,
            service_id,
            barbershop_id
          `
        )
        .eq("barber_id", barber.id)
        .gte("start_time", today.toISOString())
        .lt("start_time", tomorrow.toISOString())
        .order("start_time", { ascending: true });

      if (apptError) {
        console.error("Erro ao carregar agendamentos", apptError);
        return setLoading(false);
      }

      const normalized: AppointmentEnd[] = (rawAppointments ?? []).map(
        (appt: any) => ({
          id: String(appt.id),
          start_time: appt.start_time, // mantém como string conforme o tipo
          end_time: appt.end_time,
          status: appt.status as AppointmentStatus,
          barbers: appt.barbers ?? { id: "", full_name: "Desconhecido" },
          services: appt.services ?? { id: "", name: "Serviço não informado" },
          barbershops: appt.barbershops ?? { id: "", name: "Não informado" },
        })
      );

      setAppointments(normalized);

      setLoading(false);
    }

    loadDashboard();
  }, []);

  if (loading) return <LoadingPage />;

  // separa os atendimentos
  const past = appointments.filter((a) => new Date(a.end_time as string) < now);
  const upcoming = appointments.filter((a) => new Date(a.start_time) >= now);

  const next = upcoming[0];
  const later = upcoming.slice(1);

  const STATUS_DICT: Record<string, string> = {
    completed: "FINALIZADO",
    scheduled: "AGENDADO",
  };

  return (
    <main className="p-6 space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
          Bem-vindo, {barberName.split(" ")[0]}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {now.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          })}
        </p>
      </header>

      {/* Próximo atendimento */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-100">
          Próximo atendimento
        </h2>

        {!next ? (
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Nenhum atendimento futuro hoje.
            </p>
          </div>
        ) : (
          <Card className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 shadow-md">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-indigo-800 dark:text-indigo-300">
                  {next.services?.name || "Serviço não informado"}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Cliente às{" "}
                  {new Date(next.start_time).toLocaleTimeString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-800/50 rounded-full text-indigo-700 dark:text-indigo-300">
                {STATUS_DICT[next.status] || "AGENDADO"}
              </span>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Próximos após o atual */}
      {later.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Ainda hoje
          </h3>
          <div className="space-y-2">
            {later.map((appt) => (
              <Card
                key={appt.id}
                className="bg-white/60 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 transition"
              >
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {appt.services?.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {new Date(appt.start_time).toLocaleTimeString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {STATUS_DICT[appt.status] || "AGENDADO"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Atendimentos concluídos */}
      {past.length > 0 && (
        <section>
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Ver atendimentos concluídos ({past.length})
            </summary>
            <div className="space-y-2 mt-2">
              {past.map((appt) => (
                <Card
                  key={appt.id}
                  className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800"
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-zinc-700 dark:text-zinc-200">
                        {appt.services?.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {new Date(appt.start_time).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      FINALIZADO
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </details>
        </section>
      )}
    </main>
  );
}
