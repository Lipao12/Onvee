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

export interface BarbershopConfig {
  id: string;
  barbershop_id: string;
  created_at: string;
  updated_at: string;
  main_color: string | null;
  theme: string;
  instagram_user?: string;
  whatsapp_number?: string;
  appointment_interval?: number;
  business_hours?: any;
  name: string;
  address: string;
  image_url: string;
}

type ShopId = string | null;

interface BarberShopContextProps {
  shop: BarberShop | null;
  services: Service[];
  barbers: Barber[];
  barbershop_config: any;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  setShop: (shop: BarberShop) => void;
  fetchShopData: (shopId: ShopId) => void;
  fetchBarberAvailability: any;
  updateBarbershopConfig: (
    configData: Partial<BarbershopConfig>
  ) => Promise<void>;
}

const BarberShopContext = createContext<BarberShopContextProps | undefined>(
  undefined
);

export function BarberShopProvider({ children }: { children: ReactNode }) {
  //const [searchId, setSearchId] = useState<ShopId>(null);
  const [shop, setShop] = useState<BarberShop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barbershop_config, setBarbersshopConfig] = useState();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  //const [lastFetch, setLastFetch] = useState<number>(0);
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
      const [shopRes, serviceRes, barberRes, barbershopConfigRes] =
        await Promise.all([
          supabase.from("barbershops").select("*").eq("id", shopId).single(),
          supabase
            .from("services")
            .select("*")
            .eq("barbershop_id", shopId)
            .order("price", { ascending: true }),
          supabase
            .from("barbers")
            .select(
              `id, barbershop_id, profile_id(full_name, image_url, phone)
              , bio, rating, is_active`
            )
            .eq("barbershop_id", shopId)
            .eq("is_active", true),
          supabase
            .from("barbershop_config")
            .select("*")
            .eq("barbershop_id", shopId)
            .single(),
        ]);

      if (shopRes.error) throw shopRes.error;
      if (serviceRes.error) throw serviceRes.error;
      if (barberRes.error) throw barberRes.error;
      if (barbershopConfigRes.error) throw barbershopConfigRes.error;

      changeTheme(barbershopConfigRes.data.theme);
      applyThemeColors(barbershopConfigRes.data.main_color);

      const barbersData = barberRes.data || [];

      const enrichedBarbers = barbersData.map((b: any) => ({
        ...b,
        ...(b.profile_id
          ? {
              full_name: b.profile_id.full_name,
              image_url: b.profile_id.image_url,
              phone: b.profile_id.phone,
            }
          : {}),
      }));

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
      setBarbersshopConfig(barbershopConfigRes.data);
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

  const changeTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove("theme-default", "theme-vintage");
    root.classList.add(`theme-${theme}`);
    localStorage.setItem("app-theme", theme);
  };

  function darken(hex: string, amount = 0.2) {
  const num = parseInt(hex.replace("#", ""), 16);

  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));

  const newHex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);

  return newHex;
}

  const applyThemeColors = (color: string | null) => {
    if (!color) return;

    const root = document.documentElement;
    // Assuming color is in hex format, we might need to convert to oklch if we were strictly following the new tailwind 4 theme system
    // But since we are using inline styles for dynamic overrides, hex works for many things, 
    // BUT the current css uses oklch for --primary etc.
    // However, setting the variable on style attribute overrides the class definition.
    // If the user provides a hex color, we can try to use it directly.
    // Note: Tailwind 4 variables like --primary are often used with opacity modifiers (e.g. bg-primary/50)
    // which requires the variable to be just the color channels if using the old method, 
    // or a valid color value if using the new CSS variables.
    // Let's try setting it directly. If it breaks opacity, we might need a hex-to-oklch converter or similar.
    // For now, let's assume simple usage.
    
    root.style.setProperty("--main-color", color);
    root.style.setProperty("--ring", color);
    root.style.setProperty("--step-active", darken(color));
    root.style.setProperty("--step-current", color); // Or a lighter version?
    
    // Also set sidebar primary if needed
    root.style.setProperty("--sidebar-primary", color);
  };

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

  const updateBarbershopConfig = useCallback(
    async (configData: Partial<BarbershopConfig>) => {
      if (!shop?.id) throw new Error("Nenhuma barbearia selecionada");

      try {
        setIsSaving(true);
        setLoading(true);
        const updates = [];
        const now = new Date().toISOString();

        // Atualiza barbershops (nome, endereço, imagem)
        if (configData.name || configData.address || configData.image_url) {
          updates.push(
            supabase
              .from("barbershops")
              .update({
                ...(configData.name && { name: configData.name }),
                ...(configData.address && { address: configData.address }),
                ...(configData.image_url && {
                  image_url: configData.image_url,
                }),
              })
              .eq("id", shop.id)
          );
        }

        // Verifica se já existe config
        const { data: existingConfig } = await supabase
          .from("barbershop_config")
          .select("id")
          .eq("barbershop_id", shop.id)
          .maybeSingle();

        // Atualiza ou cria config
        if (
          configData.main_color ||
          configData.theme ||
          configData.instagram_user
        ) {
          const configPayload = {
            ...(configData.main_color && { main_color: configData.main_color }),
            ...(configData.theme && { theme: configData.theme }),
            ...(configData.instagram_user && {
              instagram_user: configData.instagram_user,
            }),
            updated_at: now,
          };

          if (existingConfig) {
            updates.push(
              supabase
                .from("barbershop_config")
                .update(configPayload)
                .eq("id", existingConfig.id)
            );
          } else {
            updates.push(
              supabase.from("barbershop_config").insert({
                barbershop_id: shop.id,
                ...configPayload,
              })
            );
          }
        }

        // ⭐ CORREÇÃO PRINCIPAL: sempre executar os updates
        if (updates.length > 0) {
          const results = await Promise.all(updates);
          const hasError = results.some((r) => r.error);
          if (hasError) {
            const errors = results.map((r) => r.error).filter(Boolean);
            throw new Error(JSON.stringify(errors));
          }
        }

        // Recarrega tudo
        const [updatedShop, updatedConfig] = await Promise.all([
          supabase.from("barbershops").select("*").eq("id", shop.id).single(),
          supabase
            .from("barbershop_config")
            .select("*")
            .eq("barbershop_id", shop.id)
            .maybeSingle(),
        ]);

        if (updatedShop.error) throw updatedShop.error;

        if (configData.theme) {
          changeTheme(configData.theme);
        }
        if (configData.main_color) {
          applyThemeColors(configData.main_color);
        }

        setShop(updatedShop.data);
        if (updatedConfig.data) {
          setBarbersshopConfig(updatedConfig.data);
        }

        cacheRef.current.delete(shop.id);
      } catch (error) {
        console.error("Erro ao atualizar configurações:", error);
        throw error;
      } finally {
        setIsSaving(false);
        setLoading(false);
      }
    },
    [shop?.id]
  );

  return (
    <BarberShopContext.Provider
      value={{
        shop,
        barbers,
        services,
        barbershop_config,
        loading,
        error,
        isSaving,
        setShop,
        fetchShopData,
        fetchBarberAvailability,
        updateBarbershopConfig,
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
