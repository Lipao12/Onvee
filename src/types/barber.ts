export interface Barber {
  id: string;
  barbershop_id: string;
  full_name: string;
  bio?: string | null;
  phone?: string | null;
  image_url?: string | null;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
