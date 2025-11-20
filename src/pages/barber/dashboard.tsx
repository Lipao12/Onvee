import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
import { supabase } from "@/lib/supabase-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingPage from "../loading";

interface DashboardAppointment {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  service: { name: string };
  client?: { full_name: string };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [barberName, setBarberName] = useState("");

  const today = new Date();

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;

      setLoading(true);
      try {
        // 1. Get Barber Profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile) setBarberName(profile.full_name);

        // 2. Get Barber ID
        const { data: barber } = await supabase
          .from("barbers")
          .select("id")
          .eq("profile_id", user.id)
          .single();

        if (!barber) {
            console.error("Barber not found");
            setLoading(false);
            return;
        }

        // 3. Get Today's Appointments
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const { data: appts, error } = await supabase
          .from("appointments")
          .select(`
            id,
            start_time,
            end_time,
            status,
            service:service_id ( name )
          `)
          .eq("barber_id", barber.id)
          .gte("start_time", startOfDay.toISOString())
          .lte("start_time", endOfDay.toISOString())
          .order("start_time", { ascending: true });

        if (error) throw error;

        // Normalize data
        const normalized = (appts || []).map((a: any) => ({
            id: a.id,
            start_time: a.start_time,
            end_time: a.end_time,
            status: a.status,
            service: a.service || { name: "Serviço" },
            client: { full_name: "Cliente" } // Placeholder as client_id is missing
        }));

        setAppointments(normalized);

      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  const handleFinish = async (id: string) => {
      try {
          const { error } = await supabase
            .from("appointments")
            .update({ status: "completed" })
            .eq("id", id);
            
          if (error) throw error;
          
          setAppointments(prev => prev.map(a => 
            a.id === id ? { ...a, status: "completed" } : a
          ));
          toast.success("Atendimento finalizado!");
      } catch (error) {
          console.error("Error finishing appointment:", error);
          toast.error("Erro ao finalizar atendimento");
      }
  };

  if (loading) return <LoadingPage />;

  const now = new Date();
  const upcoming = appointments.filter(a => new Date(a.start_time) >= now && a.status !== 'completed');
  const nextAppt = upcoming[0];
  const secondAppt = upcoming[1];

  return (
    <div className="container mx-auto p-4 pb-24 space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Olá, {barberName.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground capitalize">
          {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </header>

      {/* Quick Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Appointment */}
        <Card className="bg-primary text-primary-foreground border-none shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">Próximo Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
                {nextAppt ? (
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">{nextAppt.client?.full_name}</h3>
                                <p className="text-primary-foreground/80">{nextAppt.service.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">
                                    {format(new Date(nextAppt.start_time), "HH:mm")}
                                </p>
                            </div>
                        </div>
                        <Button 
                            variant="secondary" 
                            className="w-full font-semibold"
                            onClick={() => handleFinish(nextAppt.id)}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Finalizar Atendimento
                        </Button>
                    </div>
                ) : (
                    <div className="py-8 text-center opacity-80">
                        <p>Nenhum próximo atendimento</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Second Appointment */}
        <Card className="bg-card border-none shadow-md">
             <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-muted-foreground">Em seguida</CardTitle>
            </CardHeader>
            <CardContent>
                {secondAppt ? (
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-full">
                                <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold">{secondAppt.client?.full_name}</p>
                                <p className="text-sm text-muted-foreground">{secondAppt.service.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xl font-bold text-primary">
                                {format(new Date(secondAppt.start_time), "HH:mm")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center text-muted-foreground">
                        <p>Livre após o próximo</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </section>

      {/* Daily List */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agenda de Hoje
        </h2>
        
        <div className="space-y-3">
            {appointments.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground border-dashed">
                    <p>Nenhum agendamento para hoje.</p>
                </Card>
            ) : (
                appointments.map((appt) => {
                    const isCompleted = appt.status === 'completed';
                    const isPast = new Date(appt.end_time) < now;
                    console.log(isPast);
                    
                    return (
                        <Card key={appt.id} className={`border-none shadow-sm transition-all ${isCompleted ? 'opacity-60 bg-muted/50' : 'hover:shadow-md bg-card'}`}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`text-center min-w-[60px] ${isCompleted ? 'text-muted-foreground' : 'text-primary'}`}>
                                        <p className="font-bold text-lg">
                                            {format(new Date(appt.start_time), "HH:mm")}
                                        </p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-border" />
                                    <div>
                                        <p className={`font-semibold ${isCompleted && 'line-through'}`}>
                                            {appt.client?.full_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {appt.service.name}
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    {isCompleted ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                            Finalizado
                                        </Badge>
                                    ) : (
                                        <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-primary"
                                            onClick={() => handleFinish(appt.id)}
                                        >
                                            Marcar como feito
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            )}
        </div>
      </section>
    </div>
  );
}
