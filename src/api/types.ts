export interface TripData {
  id: number;
  title: string;
  destination: string;
  budget?: number | null;
  is_public: boolean;
  user_id: number;
  created_at?: string;
}