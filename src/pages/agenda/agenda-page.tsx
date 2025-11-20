import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-provider";
import { supabase } from "@/lib/supabase-client";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, type View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "sonner";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
}

export default function AgendaPage() {
  const { user } = useAuth();
  const currentUser = user as any; // Cast to any to access extended properties
  const [view, setView] = useState<View>(Views.DAY);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");

  const isOwner = user?.role === "owner";

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from("appointments")
        .select(`
          id,
          start_time,
          end_time,
          status,
          service_id ( name ),
          barber_id ( id, profile_id ( full_name ) )
        `);

      // If not owner or filtering by "my", filter by barber_id
      if (!isOwner || filterMode === "my") {
        // We need to find the barber record for this user first
        const { data: barberData } = await supabase
            .from("barbers")
            .select("id")
            .eq("profile_id", currentUser.profile_id) // Assuming user.id maps to profile_id or we have profile_id in user object
            .single();
            
        if (barberData) {
             query = query.eq("barber_id", barberData.id);
        } else if (!isOwner) {
            // If user is not owner and not a barber (shouldn't happen on this page), show nothing
             setEvents([]);
             setLoading(false);
             return;
        }
      } else {
        // If owner and "all", filter by barbershop_id
        if (currentUser.barbershop_id) {
            query = query.eq("barbershop_id", currentUser.barbershop_id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedEvents: CalendarEvent[] = (data || []).map((appt: any) => {
        const serviceName = appt.service_id?.name || "Serviço";
        const barberName = appt.barber_id?.profile_id?.full_name || "Barbeiro";
        
        return {
          id: appt.id,
          title: isOwner && filterMode === 'all' ? `${serviceName} - ${barberName}` : serviceName,
          start: new Date(appt.start_time),
          end: new Date(appt.end_time),
          resource: appt,
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      toast.error("Erro ao carregar agenda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user, filterMode, view, date]); // Re-fetch when filter changes

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div className="container mx-auto p-4 pb-24 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <Card className="flex-1 flex flex-col shadow-md border-none bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-primary" />
              Agenda
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Gerencie seus agendamentos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOwner && (
              <Select
                value={filterMode}
                onValueChange={(v: "my" | "all") => setFilterMode(v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my">Meus Agendamentos</SelectItem>
                  <SelectItem value="all">Toda a Barbearia</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <div className="flex items-center bg-muted rounded-md p-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                        const newDate = new Date(date);
                        if (view === Views.DAY) newDate.setDate(date.getDate() - 1);
                        if (view === Views.WEEK) newDate.setDate(date.getDate() - 7);
                        if (view === Views.MONTH) newDate.setMonth(date.getMonth() - 1);
                        setDate(newDate);
                    }}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm font-medium min-w-[100px] text-center">
                    {format(date, view === Views.DAY ? "dd 'de' MMMM" : "MMMM yyyy", { locale: ptBR })}
                </span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                        const newDate = new Date(date);
                        if (view === Views.DAY) newDate.setDate(date.getDate() + 1);
                        if (view === Views.WEEK) newDate.setDate(date.getDate() + 7);
                        if (view === Views.MONTH) newDate.setMonth(date.getMonth() + 1);
                        setDate(newDate);
                    }}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Select
                value={view}
                onValueChange={(v) => setView(v as View)}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={Views.DAY}>Dia</SelectItem>
                    <SelectItem value={Views.WEEK}>Semana</SelectItem>
                    <SelectItem value={Views.MONTH}>Mês</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 sm:p-4">
            {loading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%", minHeight: "500px" }}
                    view={view}
                    date={date}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    culture="pt-BR"
                    messages={{
                        next: "Próximo",
                        previous: "Anterior",
                        today: "Hoje",
                        month: "Mês",
                        week: "Semana",
                        day: "Dia",
                        agenda: "Agenda",
                        date: "Data",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "Não há agendamentos neste período.",
                    }}
                    eventPropGetter={(event) => {
                        const isCompleted = event.resource?.status === 'completed';
                        return {
                            className: `text-xs rounded-md border-l-4 ${isCompleted ? 'bg-green-100 border-green-500 text-green-700' : 'bg-primary/10 border-primary text-primary-foreground'}`,
                            style: {
                                backgroundColor: isCompleted ? '#dcfce7' : 'var(--primary)',
                                color: isCompleted ? '#166534' : 'var(--primary-foreground)',
                                borderColor: isCompleted ? '#22c55e' : 'var(--primary)',
                            }
                        }
                    }}
                />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
