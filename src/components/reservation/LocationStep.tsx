
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { Location } from "@/types/reservation";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    excludedDates: []
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

  const handleDateToggle = (locationId: string, dateId: string) => {
    const location = formData.locations.find(loc => loc.id === locationId);
    if (location?.excludedDates?.includes(dateId)) {
      dispatch({
        type: "ADD_DATE_TO_LOCATION",
        payload: { locationId, dateId },
      });
    } else {
      dispatch({
        type: "REMOVE_DATE_FROM_LOCATION",
        payload: { locationId, dateId },
      });
    }
  };

  const isDateExcluded = (locationId: string, dateId: string) => {
    const location = formData.locations.find(loc => loc.id === locationId);
    return location?.excludedDates?.includes(dateId) || false;
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "all":
        return "Available for all dates";
      case "some":
        return "Available for some dates";
      case "none":
        return "Not available for selected dates";
      default:
        return "";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "all":
        return "text-green-600";
      case "some":
        return "text-yellow-600";
      case "none":
        return "text-red-600";
      default:
        return "";
    }
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
            className="p-6"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <div className="aspect-square">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <div>
                <h3 className="text-lg font-semibold">{location.name}</h3>
                <p className="text-sm text-muted-foreground">{location.type}</p>
                <p className="text-sm">Rate: ${location.rate}/hour</p>
                <p className={`text-sm mt-1 ${getAvailabilityColor(location.availability)}`}>
                  {getAvailabilityText(location.availability)}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {location.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">{amenity}</Badge>
                  ))}
                </div>
                <Button
                  onClick={() => handleLocationSelect(location)}
                  variant={isLocationSelected(location.id) ? "secondary" : "outline"}
                  className="mt-4 w-full"
                >
                  {isLocationSelected(location.id) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Selected
                    </>
                  ) : (
                    "Select Location"
                  )}
                </Button>
                {isLocationSelected(location.id) && formData.dates.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium mb-2">Selected Dates:</p>
                    <div className="space-y-2">
                      {formData.dates.map((date) => (
                        <div
                          key={date.id}
                          onClick={() => handleDateToggle(location.id, date.id)}
                          className={`text-sm p-2 rounded cursor-pointer ${
                            isDateExcluded(location.id, date.id)
                              ? "bg-gray-100 text-gray-500"
                              : "bg-primary text-white"
                          }`}
                        >
                          {format(date.date, "MMM d, yyyy")} ({date.startTime} - {date.endTime})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
