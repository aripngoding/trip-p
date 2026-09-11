export interface Activity {
  id: string;
  time: string;
  title: string;
  category: 'transport' | 'food' | 'sightseeing' | 'hotel' | 'activity' | 'other';
  cost: number;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
  date: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'documents' | 'clothing' | 'electronics' | 'toiletries' | 'medication' | 'other';
  packed: boolean;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  coverImage: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  itinerary: ItineraryDay[];
  expenses: Expense[];
  packingList: PackingItem[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  popularActivities: string[];
  recommendedDuration: string;
  estimatedCost: string;
}
