export interface TripData {
  id?: number;
  user_id: number;
  title: string;
  destination: string;
  description: string;
  price: number;
  date: string;
  image?: string; 
}