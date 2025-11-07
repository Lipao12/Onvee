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

type SupabaseAppointment = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  barbers: { id: string; full_name: string };
  barbershops: { id: string; name: string };
  services: { id: string; name: string };
};
type AppointmentStatus = "completed" | "scheduled";
interface AppointmentEnd {
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
        id,
        full_name
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

    console.log(data)

  if (error) {
    console.error("Erro ao buscar agendamentos:", error.message);
    throw new Error(error.message);
  }

  const normalized: AppointmentEnd[] = (data).map((appt) => ({
    ...appt,
    barbers: appt.barbers[0],         // ← remove array
    barbershops: appt.barbershops[0], // ← remove array
    services: appt.services[0],       // ← remove array
  }));

  return normalized;
}