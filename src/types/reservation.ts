export type ModuleType = 'Schedule Requests' | 'Transportation Requests';

export type ReservationType = 'Athletics' | 'Meeting' | 'Field Trip' | 'Staff Vehicle';

export type LocationType = 'Sports Field' | 'Baseball Diamond' | 'Gymnasium' | 'Classroom';

export type VehicleType = 'Pick-Up Truck' | 'Service Van' | 'Commuter Car';

export type FacilityItemType = 'Chairs' | 'Tables' | 'Microphone' | 'Projector';

export type Amenity = 'Parking' | 'Wheel Chair Access' | 'Wi-fi';

export interface ReservationDate {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  repeatSchedule?: 'daily' | 'weekly' | 'biweekly';
}

export interface Location {
  id: string;
  type: LocationType;
  name: string;
  image: string;
  rate: number;
  amenities: Amenity[];
  availability: 'all' | 'some' | 'none';
  excludedDates?: string[];
}

export interface AdditionalItem {
  id: string;
  type: VehicleType | FacilityItemType;
  name: string;
  image: string;
  rate: number;
  quantityAvailable: number;
  selectedQuantity?: number;
  includedDates?: string[];
}

export interface ReservationFormData {
  module?: ModuleType;
  type: ReservationType;
  description: string;
  dates: ReservationDate[];
  locations: Location[];
  additionalItems: AdditionalItem[];
}
