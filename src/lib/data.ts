export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  vendorSetup: string;
  tables: number;
  entryFee: string;
  featured: boolean;
  availableDates: string[];
  image: string;
}

export const eventsData: Event[] = [];
