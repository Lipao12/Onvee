import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
import { useBarberShop } from "@/context/barber-shop-provider";
import { supabase } from "@/lib/supabase-client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Copy, DollarSign, Scissors, TrendingUp, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingPage from "../loading";

interface DashboardMetrics {
  avgTicket: number;
  totalAppointments: number;
  estimatedRevenue: number;
  topService: string;
}

interface BarberPerformance {
  id: string;
  name: string;
  appointmentsCount: number;
  occupancy: number; // Dummy for now
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { shop } = useBarberShop()
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    avgTicket: 0,
    totalAppointments: 0,
    estimatedRevenue: 0,
    topService: "-",
  });
  const [barbers, setBarbers] = useState<BarberPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");

  const today = new Date();

  useEffect(() => {
    async function loadDashboard() {
      if (!user?.id) return;

      setLoading(true);
      try {
        setShopName(shop?.name || "");

        // 2. Get Today's Appointments
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const { data: appts, error } = await supabase
          .from("appointments")
          .select(`
            id,
            start_time,
            service:service_id ( name ),
            barber:barber_id ( id, profile_id ( full_name ) )
          `)
          .eq("barbershop_id", user.id)
          .gte("start_time", startOfDay.toISOString())
          .lte("start_time", endOfDay.toISOString());

        if (error) throw error;

        // Calculate Metrics
        const totalAppointments = appts?.length || 0;
        // Note: price might be on service, but usually copied to appointment or we fetch from service. 
        // Assuming price is NOT on appointment based on previous code, let's fetch service prices if needed.
        // Actually, let's assume we need to sum service prices.
        // Wait, the query above tries to select 'price' from appointments. Let's check if it exists.
        // If not, we need to join service and sum service.price.
        
        // Let's refine the query to get service price
        const { data: apptsWithPrice } = await supabase
             .from("appointments")
             .select(`
                id,
                service:service_id ( name, price ),
                barber:barber_id ( id, profile_id ( full_name ) )
              `)
              .eq("barbershop_id", user.id)
              .gte("start_time", startOfDay.toISOString())
              .lte("start_time", endOfDay.toISOString());
        
        let revenue = 0;
        const serviceCounts: Record<string, number> = {};
        const barberCounts: Record<string, number> = {};
        const barberNames: Record<string, string> = {};

        (apptsWithPrice || []).forEach((a: any) => {
            const price = a.service?.price || 0;
            revenue += price;

            const serviceName = a.service?.name || "Outros";
            serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;

            const barberId = a.barber?.id;
            if (barberId) {
                barberCounts[barberId] = (barberCounts[barberId] || 0) + 1;
                barberNames[barberId] = a.barber?.profile_id?.full_name || "Barbeiro";
            }
        });

        const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
        const avgTicket = totalAppointments > 0 ? revenue / totalAppointments : 0;

        setMetrics({
            avgTicket,
            totalAppointments,
            estimatedRevenue: revenue,
            topService
        });

        // Prepare Barber Performance
        const barberPerf: BarberPerformance[] = Object.keys(barberCounts).map(id => ({
            id,
            name: barberNames[id],
            appointmentsCount: barberCounts[id],
            occupancy: Math.min(Math.round((barberCounts[id] / 8) * 100), 100) // Dummy: assuming 8 slots/day
        }));
        
        setBarbers(barberPerf);

      } catch (error) {
        console.error("Error loading owner dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  if (loading) return <LoadingPage />;

  return (
    <div className="container mx-auto p-4 pb-24 space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{shopName || "Minha Barbearia"}</h1>
          <p className="text-muted-foreground capitalize">
            {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        {shop?.site_url && (
          <Card className="p-3 flex items-center justify-between gap-3 bg-muted/50 border-dashed">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground block text-xs uppercase tracking-wider mb-0.5">Link de Agendamento</span>
              <a href={shop?.site_url} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[200px] block">
                {shop?.site_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(shop?.site_url as string);
                toast.success("Link copiado!");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
        )}
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.avgTicket)}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">Hoje</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Est.</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.estimatedRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">Hoje</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Serviço</CardTitle>
                <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-lg font-bold truncate" title={metrics.topService}>
                    {metrics.topService}
                </div>
            </CardContent>
        </Card>
      </section>

      {/* Barber Performance */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Desempenho dos Barbeiros (Hoje)
        </h2>
        <div className="grid gap-4">
            {barbers.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground border-dashed">
                    <p>Nenhum atendimento registrado hoje.</p>
                </Card>
            ) : (
                barbers.map(barber => (
                    <Card key={barber.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold">{barber.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {barber.appointmentsCount} atendimentos
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">{barber.occupancy}%</div>
                            <p className="text-xs text-muted-foreground">Ocupação Est.</p>
                        </div>
                    </Card>
                ))
            )}
        </div>
      </section>
    </div>
  );
}
