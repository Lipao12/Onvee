import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-provider";
import { supabase } from "@/lib/supabase-client";
import { format, getDay, isToday, isTomorrow, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
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
  const currentUser = user as any;
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"my" | "all">("my");
  //const [isCalendarLoaded, setIsCalendarLoaded] = useState(false);

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

      if (!isOwner || filterMode === "my") {
        const { data: barberData } = await supabase
            .from("barbers")
            .select("id")
            .eq("profile_id", currentUser.profile_id)
            .single();
            
        if (barberData) {
             query = query.eq("barber_id", barberData.id);
        } else if (!isOwner) {
             setEvents([]);
             setLoading(false);
             return;
        }
      } else {
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
  }, [user, filterMode, view, date]);

  // Melhorar performance do calendário em mobile
  /*useEffect(() => {
    setIsCalendarLoaded(true);
  }, []);*/

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const getDateDisplayText = () => {
    //const today = new Date();
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    
    if (view === Views.DAY) {
      return format(date, "EEE, d 'de' MMM", { locale: ptBR });
    } else if (view === Views.WEEK) {
      const start = startOfWeek(date, { locale: ptBR });
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${format(start, "d MMM", { locale: ptBR })} - ${format(end, "d MMM", { locale: ptBR })}`;
    } else {
      return format(date, "MMM yyyy", { locale: ptBR });
    }
  };

  const getEventCountText = () => {
    const todayEvents = events.filter(event => 
      isToday(event.start)
    ).length;
    
    return `${events.length} agendamento${events.length !== 1 ? 's' : ''} • ${todayEvents} hoje`;
  };

  // Navigation handlers para touch
  const navigatePrevious = () => {
    const newDate = new Date(date);
    if (view === Views.DAY) newDate.setDate(date.getDate() - 1);
    if (view === Views.WEEK) newDate.setDate(date.getDate() - 7);
    if (view === Views.MONTH) newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(date);
    if (view === Views.DAY) newDate.setDate(date.getDate() + 1);
    if (view === Views.WEEK) newDate.setDate(date.getDate() + 7);
    if (view === Views.MONTH) newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const isCompleted = event.resource?.status === 'completed';
    const isCancelled = event.resource?.status === 'cancelled';
    
    let style = {
      borderLeft: '4px solid',
      fontSize: '0.75rem',
      borderRadius: '4px',
      opacity: 0.9,
      color: '',
      backgroundColor: '',
      borderColor: ''
    };

    if (isCancelled) {
      style.backgroundColor = 'hsl(var(--muted))';
      style.color = 'hsl(var(--muted-foreground))';
      style.borderColor = 'hsl(var(--muted-foreground))';
    } else if (isCompleted) {
      style.backgroundColor = 'hsl(var(--primary) / 0.15)';
      style.color = 'hsl(var(--primary))';
      style.borderColor = 'hsl(var(--primary))';
    } else {
      style.backgroundColor = 'hsl(var(--primary))';
      style.color = 'hsl(var(--primary-foreground))';
      style.borderColor = 'hsl(var(--primary-foreground))';
    }

    return {
      style
    };
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-80px)] bg-background">
      {/* Sticky Header Section */}
      <div className="flex-none bg-background/95 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4 py-3 space-y-3">
          
          {/* Top Row: Title & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Agenda</h1>
                <p className="text-xs text-muted-foreground font-medium">
                  {getEventCountText()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <Button 
                onClick={() => setDate(new Date())}
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium"
              >
                Hoje
              </Button>
              {isOwner && (
                 <Select
                  value={filterMode}
                  onValueChange={(v: "my" | "all") => setFilterMode(v)}
                >
                  <SelectTrigger className="h-8 w-[130px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="my">Meus</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2 bg-muted/30 p-1 rounded-lg">
             <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold min-w-[100px] text-center px-2 truncate">
                  {getDateDisplayText()}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
             </div>

             <div className="flex bg-background rounded-md shadow-sm border p-0.5">
                {[Views.DAY, Views.WEEK, Views.MONTH].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`
                      px-3 py-1 text-xs font-medium rounded-sm transition-all
                      ${view === v 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {v === Views.DAY ? 'Dia' : v === Views.WEEK ? 'Sem' : 'Mês'}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Calendar Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 z-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
          </div>
        ) : (
           <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
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
                noEventsInRange: "Sem agendamentos",
              }}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={(date) => {
                if (isToday(date)) return { className: 'bg-primary/5' };
                return {};
              }}
              step={30}
              timeslots={2}
              selectable={false}
              popup
              components={{
                toolbar: () => null, // Hide default toolbar as we have a custom one
                week: {
                  header: ({ date }) => (
                    <div className="py-2 text-center">
                      <div className="text-[10px] uppercase text-muted-foreground font-bold">
                        {format(date, 'EEE', { locale: ptBR })}
                      </div>
                      <div className={`text-sm font-bold mt-0.5 ${isToday(date) ? 'text-primary' : ''}`}>
                        {format(date, 'd')}
                      </div>
                    </div>
                  )
                }
              }}
            />
        )}
      </div>
    </div>
  );
}