
import React, { createContext, useContext, useReducer } from 'react';
import { ReservationFormData, ReservationType, Location, AdditionalItem, ReservationDate } from '@/types/reservation';

type Action =
  | { type: 'SET_TYPE'; payload: ReservationType }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'ADD_DATE'; payload: ReservationDate }
  | { type: 'REMOVE_DATE'; payload: string }
  | { type: 'UPDATE_DATE'; payload: ReservationDate }
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'REMOVE_DATE_FROM_LOCATION'; payload: { locationId: string; dateId: string } }
  | { type: 'ADD_DATE_TO_LOCATION'; payload: { locationId: string; dateId: string } }
  | { type: 'ADD_ITEM'; payload: AdditionalItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_DATE_FROM_ITEM'; payload: { itemId: string; dateId: string } }
  | { type: 'ADD_DATE_TO_ITEM'; payload: { itemId: string; dateId: string } }
  | { type: 'RESET_FORM' };

interface ReservationFormContextType {
  formData: ReservationFormData;
  dispatch: React.Dispatch<Action>;
}

const initialState: ReservationFormData = {
  type: '' as ReservationType, // Start with empty type
  description: '',
  dates: [],
  locations: [],
  additionalItems: [],
};

const ReservationFormContext = createContext<ReservationFormContextType | undefined>(undefined);

function reservationFormReducer(state: ReservationFormData, action: Action): ReservationFormData {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'ADD_DATE':
      return { ...state, dates: [...state.dates, action.payload] };
    case 'REMOVE_DATE':
      return {
        ...state,
        dates: state.dates.filter((date) => date.id !== action.payload),
      };
    case 'UPDATE_DATE':
      return {
        ...state,
        dates: state.dates.map((date) =>
          date.id === action.payload.id ? action.payload : date
        ),
      };
    case 'ADD_LOCATION':
      return { ...state, locations: [...state.locations, action.payload] };
    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter((loc) => loc.id !== action.payload),
      };
    case 'REMOVE_DATE_FROM_LOCATION':
      return {
        ...state,
        locations: state.locations.map(location => {
          if (location.id === action.payload.locationId) {
            return {
              ...location,
              excludedDates: [...(location.excludedDates || []), action.payload.dateId]
            };
          }
          return location;
        })
      };
    case 'ADD_DATE_TO_LOCATION':
      return {
        ...state,
        locations: state.locations.map(location => {
          if (location.id === action.payload.locationId) {
            return {
              ...location,
              excludedDates: (location.excludedDates || []).filter(dateId => dateId !== action.payload.dateId)
            };
          }
          return location;
        })
      };
    case 'ADD_ITEM':
      return {
        ...state,
        additionalItems: [...state.additionalItems, {
          ...action.payload,
          includedDates: state.dates.map(date => date.id)
        }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        additionalItems: state.additionalItems.filter(
          (item) => item.id !== action.payload
        ),
      };
    case 'UPDATE_ITEM_QUANTITY':
      return {
        ...state,
        additionalItems: state.additionalItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, selectedQuantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_DATE_FROM_ITEM':
      return {
        ...state,
        additionalItems: state.additionalItems.map(item => {
          if (item.id === action.payload.itemId) {
            return {
              ...item,
              includedDates: item.includedDates.filter(dateId => dateId !== action.payload.dateId)
            };
          }
          return item;
        })
      };
    case 'ADD_DATE_TO_ITEM':
      return {
        ...state,
        additionalItems: state.additionalItems.map(item => {
          if (item.id === action.payload.itemId) {
            return {
              ...item,
              includedDates: [...(item.includedDates || []), action.payload.dateId]
            };
          }
          return item;
        })
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

export function ReservationFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, dispatch] = useReducer(reservationFormReducer, initialState);

  return (
    <ReservationFormContext.Provider value={{ formData, dispatch }}>
      {children}
    </ReservationFormContext.Provider>
  );
}

export function useReservationForm() {
  const context = useContext(ReservationFormContext);
  if (context === undefined) {
    throw new Error('useReservationForm must be used within a ReservationFormProvider');
  }
  return context;
}
