import { supabase } from "@/lib/supabase-client";
import type { Barber } from "@/types/barber";
import type { BarberShop } from "@/types/barber-shop";
import type { Service } from "@/types/service";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface AvailableSlot {
  start: Date;
  end: Date;
  barberId: string;
}

type ShopId = string | null;

interface BarberShopContextProps {
  shop: BarberShop | null;
  services: Service[];
  barbers: Barber[];
  loading: boolean;
  error: string | null;
  setShop: (shop: BarberShop) => void;
  fetchShopData: (shopId: ShopId) => void;
  fetchBarberAvailability: any;
}

const BarberShopContext = createContext<BarberShopContextProps | undefined>(
  undefined
);

export function BarberShopProvider({ children }: { children: ReactNode }) {
  const [searchId, setSearchId] = useState<ShopId>(null);
  const [shop, setShop] = useState<BarberShop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(
    new Map()
  );
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchShopData = useCallback(async (shopId: string | null) => {
    if (!shopId) {
      setShop(null);
      setServices([]);
      setBarbers([]);
      setError(null);
      return;
    }

    const cached = cacheRef.current.get(shopId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setShop(cached.data.shop);
      setServices(cached.data.services);
      setBarbers(cached.data.barbers);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [shopRes, serviceRes, barberRes] = await Promise.all([
        supabase.from("barbershops").select("*").eq("id", shopId).single(),
        supabase
          .from("services")
          .select("*")
          .eq("barbershop_id", shopId)
          .order("price", { ascending: true }),
        supabase
          .from("barbers")
          .select("id, barbershop_id, profile_id, bio, rating, is_active")
          .eq("barbershop_id", shopId),
      ]);

      if (shopRes.error) throw shopRes.error;
      if (serviceRes.error) throw serviceRes.error;
      if (barberRes.error) throw barberRes.error;

      const barbersData = barberRes.data || [];

      let profileMap: Record<string, any> = {};

      const profileIds = barbersData
        .map((b: any) => b.profile_id)
        .filter((id: string | null) => id != null);

      if (profileIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, image_url")
          .in("id", profileIds);

        console.log("profiles: ", profiles);

        if (profileError) {
          console.warn(
            "Erro ao carregar perfis (pode ser auth):",
            profileError
          );
        } else if (profiles) {
          profileMap = Object.fromEntries(profiles.map((p: any) => [p.id, p]));
        }
      }

      const enrichedBarbers = barbersData.map((b: any) => {
        const profile = b.profile_id ? profileMap[b.profile_id] || null : null;
        return {
          ...b,
          ...(profile
            ? {
                full_name: profile.full_name,
                image_url: profile.image_url,
                phone: profile.phone,
              }
            : {}),
        };
      });
      const data = {
        shop: shopRes.data,
        services: serviceRes.data || [],
        barbers: enrichedBarbers,
      };

      console.log(data);

      cacheRef.current.set(shopId, { data, timestamp: Date.now() });

      setShop(shopRes.data);
      setServices(serviceRes.data || []);
      setBarbers(enrichedBarbers);
    } catch (err) {
      console.error("Erro fatal no fetchShopData:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar");
      setShop(null);
      setServices([]);
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBarberAvailability = useCallback(
    async (
      barberId: string,
      date: Date,
      serviceDuration: number
    ): Promise<AvailableSlot[]> => {
      if (!barberId || serviceDuration <= 0) return [];

      try {
        // Normaliza a data para o fuso local (Brasil) e remove horário
        const localDate = new Date(date);
        localDate.setHours(0, 0, 0, 0);
        const dateString = localDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

        // 1. Buscar horários de trabalho do dia
        const { data: workingHours, error: whError } = await supabase
          .from("working_hours")
          .select("start_time, end_time")
          .eq("barber_id", barberId)
          .eq("day_of_week", localDate.getDay());

        if (whError) throw whError;
        if (!workingHours?.length) return [];

        // 2. Buscar pausas (breaks) do dia
        const { data: breaks, error: breaksError } = await supabase
          .from("breaks")
          .select("start_time, end_time")
          .eq("barber_id", barberId)
          .gte("start_time", `${dateString}T00:00:00`)
          .lte("end_time", `${dateString}T23:59:59`);

        if (breaksError) throw breaksError;
        console.log(breaks);

        // 3. (Opcional) Buscar agendamentos confirmados
        const { data: appointments, error: apptError } = await supabase
          .from("appointments")
          .select("start_time, end_time")
          .eq("barber_id", barberId)
          .neq("status", "cancelled")
          .gte("start_time", `${dateString}T00:00:00`)
          .lte("end_time", `${dateString}T23:59:59`);

        if (apptError) throw apptError;
        console.log(appointments);

        // 4. Função auxiliar: verifica conflito com intervalo (break ou appointment)
        const hasConflict = (
          slotStart: Date,
          slotEnd: Date,
          intervals: Array<{ start_time: string; end_time: string }>
        ): boolean => {
          return intervals.some((interval) => {
            const start = new Date(interval.start_time).getTime();
            const end = new Date(interval.end_time).getTime();
            const s = slotStart.getTime();
            const e = slotEnd.getTime();
            return s < end && e > start;
          });
        };

        // 5. Gerar slots disponíveis
        const availableSlots: AvailableSlot[] = [];
        const SLOT_INTERVAL = serviceDuration; // minutos entre opções de início

        workingHours.forEach((wh) => {
          const workStartStr = `${dateString}T${wh.start_time}`;
          const workEndStr = `${dateString}T${wh.end_time}`;

          const workStart = new Date(workStartStr);
          const workEnd = new Date(workEndStr);

          // Valida se o horário de trabalho é válido
          if (
            isNaN(workStart.getTime()) ||
            isNaN(workEnd.getTime()) ||
            workStart >= workEnd
          ) {
            return;
          }

          let current = new Date(workStart);

          while (true) {
            const slotEnd = new Date(
              current.getTime() + serviceDuration * 60000
            );

            // Sai se o serviço não cabe mais no horário de trabalho
            if (slotEnd > workEnd) break;

            // Verifica conflitos com pausas e agendamentos
            const breakConflict = hasConflict(current, slotEnd, breaks || []);
            const apptConflict = hasConflict(
              current,
              slotEnd,
              appointments || []
            );

            if (!breakConflict && !apptConflict) {
              availableSlots.push({
                start: new Date(current),
                end: new Date(slotEnd),
                barberId,
              });
            }

            // Avança 15 minutos
            current = new Date(current.getTime() + SLOT_INTERVAL * 60000);

            // Para evitar loop infinito (segurança)
            if (current >= workEnd) break;
          }
        });

        // Ordena por horário de início
        availableSlots.sort((a, b) => a.start.getTime() - b.start.getTime());

        return availableSlots;
      } catch (err) {
        console.error("Erro ao calcular disponibilidade:", err);
        return [];
      }
    },
    [] // Dependências: supabase é estável
  );

  return (
    <BarberShopContext.Provider
      value={{
        shop,
        barbers,
        services,
        loading,
        error,
        setShop,
        fetchShopData,
        fetchBarberAvailability,
      }}
    >
      {children}
    </BarberShopContext.Provider>
  );
}

export function useBarberShop() {
  const context = useContext(BarberShopContext);
  if (!context)
    throw new Error("useBarberShop must be used inside BarberShopProvider");
  return context;
}
