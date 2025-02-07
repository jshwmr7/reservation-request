
export type ReservationType = 'Vehicle Reservation' | 'Facility Rental';

export type LocationType = 'Sports Field' | 'Baseball Diamond' | 'Gymnasium' | 'Classroom';

export type VehicleType = 'Pick-Up Truck' | 'Service Van' | 'Commuter Car';

export type FacilityItemType = 'Chairs' | 'Tables' | 'Microphone' | 'Projector';

export type Amenity = 'Parking' | 'Wheel Chair Access' | 'Wi-fi';

export interface ReservationDate {
  id: string;
  date: Date;
  endDate?: Date;
  time: string;
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
}

export interface AdditionalItem {
  id: string;
  type: VehicleType | FacilityItemType;
  name: string;
  image: string;
  rate: number;
  quantityAvailable: number;
  selectedQuantity?: number;
}

export interface ReservationFormData {
  type: ReservationType;
  description: string;
  dates: ReservationDate[];
  locations: Location[];
  additionalItems: AdditionalItem[];
}
