import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { Location } from "@/types/reservation";
import { Badge } from "@/components/ui/badge";

const MOCK_LOCATIONS: Location[] = [
  {
    id: "1",
    type: "Sports Field",
    name: "Main Field",
    image: "/placeholder.svg",
    rate: 100,
    amenities: ["Parking", "Wheel Chair Access"],
    availability: "all"
  },
  {
    id: "2",
    type: "Baseball Diamond",
    name: "Diamond 1",
    image: "/placeholder.svg",
    rate: 75,
    amenities: ["Parking"],
    availability: "some",
    excludedDates: ["2024-07-04", "2024-07-05"]
  },
  {
    id: "3",
    type: "Gymnasium",
    name: "Main Gym",
    image: "/placeholder.svg",
    rate: 150,
    amenities: ["Parking", "Wheel Chair Access", "Wi-fi"],
    availability: "all"
  },
  {
    id: "4",
    type: "Classroom",
    name: "Room 101",
    image: "/placeholder.svg",
    rate: 50,
    amenities: ["Wi-fi"],
    availability: "some"
  },
];

export function LocationStep() {
  const { formData, dispatch } = useReservationForm();

  const handleLocationSelect = (location: Location) => {
    if (formData.locations.some(loc => loc.id === location.id)) {
      dispatch({
        type: "REMOVE_LOCATION",
        payload: location.id,
      });
    } else {
      dispatch({
        type: "ADD_LOCATION",
        payload: location,
      });
    }
  };

  const isLocationSelected = (locationId: string) => {
    return formData.locations.some(location => location.id === locationId);
  };

  if (formData.type === "Staff Vehicle" || formData.type === "Field Trip") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_LOCATIONS.map((location) => (
          <Card
            key={location.id}
            onClick={() => handleLocationSelect(location)}
            className={`p-6 cursor-pointer transition-all hover:border-primary ${
              isLocationSelected(location.id) ? "border-2 border-primary" : ""
            }`}
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <img
                src={location.image}
                alt={location.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{location.name}</h3>
                <p className="text-sm text-muted-foreground">{location.type}</p>
                <p className="text-sm">Rate: ${location.rate}/hour</p>
                <div className="flex space-x-2 mt-2">
                  {location.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
