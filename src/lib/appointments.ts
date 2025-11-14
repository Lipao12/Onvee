import type { Appointment } from "@/types/appointment";
import { supabase } from "./supabase-client";



export async function createAppointment(appointmentData:Partial<Appointment>){

     const payload = {
    ...appointmentData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
    const { data, error } = await supabase
    .from("appointments")
    .insert([payload])
    .select()
    .single();

    if (error) {
    console.error("Erro ao criar appointment:", error.message);
    throw new Error(error.message);
  }

  return data;
}

export type AppointmentStatus = "completed" | "scheduled";
export interface AppointmentEnd {
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
  end_time?: string;
  start_time: string;
  status: AppointmentStatus;
} 
export async function fetchAllAppointments(client_id: string) {
    console.log(client_id)
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      start_time,
      end_time,
      status,
      barbers:barber_id (
        profile_id
      ),
      barbershops:barbershop_id (
        id,
        name
      ),
      services:service_id (
        id,
        name
      )
    `)
    //.eq("client_id", client_id)
    .order("start_time", { ascending: false });
const appointments = data || [];
    const profileIds = appointments
  .flatMap((appt: any) => {
    const b = appt.barbers;
    return b && b.profile_id ? [b.profile_id] : [];
  })
  .filter((id: string | null | undefined): id is string => !!id);

// Busca perfis se houver IDs
let profileMap: Record<string, any> = {};
if (profileIds.length > 0) {
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", profileIds);

  if (profileError) {
    console.warn("Erro ao carregar perfis:", profileError);
  } else if (profiles) {
    profileMap = Object.fromEntries(
      profiles.map((p: any) => [p.id, p])
    );
  }
}

// Mapeia “appointments” adicionando dados de perfil ao objeto “barbers”

const enrichedAppointments = appointments.map((appt: any) => {
  const b = appt.barbers;
  let enrichedBarber = null;

  if (b && b.profile_id) {
    const prof = profileMap[b.profile_id];
    enrichedBarber = {
      ...b,
      ...(prof
        ? {
            full_name: prof.full_name,
            image_url: prof.image_url,
            phone: prof.phone,
          }
        : {}),
    };
  }

  return {
    ...appt,
    barbers: enrichedBarber,
  };
});

    
    if (error) {
        console.error("Erro ao buscar agendamentos:", error.message);
        throw new Error(error.message);
    }
    
    const normalized: AppointmentEnd[] = enrichedAppointments.map((appt: any) => {
        return {
            id: String(appt.id),
            start_time: appt.start_time,
            end_time: appt.end_time,
            status: appt.status as AppointmentStatus,
            barbers: appt.barbers ? appt.barbers ?? { id: "", full_name: "Desconhecido" } : { id: "", full_name: "Desconhecido" },
            barbershops: appt.barbershops ? appt.barbershops ?? { id: "", name: "Não informado" } : { id: "", name: "Não informado" },
            services: appt.services ? appt.services ?? { id: "", name: "Serviço não informado" } : { id: "", name: "Serviço não informado" },
        }
  }
);

  return normalized;
}