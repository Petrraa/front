export interface TripData {
  id?: number;
  title: string;
  destination: string;
  description: string;
  price: number;
  date: string;
  image?: string; // ✅ putanja slike s backenda
}