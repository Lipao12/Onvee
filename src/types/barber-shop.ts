export interface BarberShop {
  id: string;
  name: string;
  access_code: string;
  phone: string | null;
  address: string | null;
  image_url: string | null;
  instagram_url?: string | null;
  site_url?: string | null;
}
