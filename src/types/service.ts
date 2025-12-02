export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string | null;
}
