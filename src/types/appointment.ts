export interface Appointment {
  id: string;
  barber_id: string | undefined;
  barbershop_id: string | null;
  service_id: string | undefined;
  client_id: string | undefined;
  start_time: string; 
  end_time: string;  
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}