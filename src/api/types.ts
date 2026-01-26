export interface TripData {
  id?: number;
  title: string;
  description: string;
  destination: string; // ✅ DODAJ
  price: number;
  date: string;
  user_id?: number;
  created_at?: string;
}