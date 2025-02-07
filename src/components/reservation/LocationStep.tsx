
import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Plus, Filter, X } from "lucide-react";
import { LocationType, Location as LocationData, Amenity } from "@/types/reservation";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

export function LocationStep() {
  const { formData } = useReservationForm();
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);

  // Skip this step for vehicle reservations
  if (formData.type === "Vehicle Reservation") {
    return null;
  }

  const locations: LocationData[] = [
    {
      id: "1",
      type: "Sports Field",
      name: "Main Soccer Field",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      rate: 100,
      amenities: ["Parking", "Wheel Chair Access"],
      availability: "all"
    },
    {
      id: "2",
      type: "Gymnasium",
      name: "Central Gym",
      image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
      rate: 150,
      amenities: ["Parking", "Wheel Chair Access", "Wi-fi"],
      availability: "some"
    },
    {
      id: "3",
      type: "Classroom",
      name: "Room 101",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      rate: 50,
      amenities: ["Wi-fi", "Wheel Chair Access"],
      availability: "none"
    }
  ];

  const filteredLocations = locations
    .filter(location => !selectedType || location.type === selectedType)
    .filter(location => 
      selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => location.amenities.includes(amenity))
    )
    .sort((a, b) => {
      const availabilityOrder = { all: 0, some: 1, none: 2 };
      return availabilityOrder[a.availability] - availabilityOrder[b.availability];
    });

  const handleAmenityToggle = (amenity: Amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearTypeSelection = () => {
    setSelectedType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary-dark">Reserved Location(s)</h2>
        <Button onClick={() => {}} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Select
            value={selectedType || ""}
            onValueChange={(value) => setSelectedType(value as LocationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Location Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sports Field">Sports Field</SelectItem>
              <SelectItem value="Baseball Diamond">Baseball Diamond</SelectItem>
              <SelectItem value="Gymnasium">Gymnasium</SelectItem>
              <SelectItem value="Classroom">Classroom</SelectItem>
            </SelectContent>
          </Select>
          {selectedType && (
            <button
              onClick={clearTypeSelection}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by amenities:</span>
          {["Parking", "Wheel Chair Access", "Wi-fi"].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2">
              <Checkbox
                checked={selectedAmenities.includes(amenity as Amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity as Amenity)}
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-border"
          >
            <img
              src={location.image}
              alt={location.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{location.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{location.type}</p>
              <p className="font-medium mb-2">${location.rate}/hour</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {location.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              <div className={`text-sm ${
                location.availability === 'all' 
                  ? 'text-green-600' 
                  : location.availability === 'some' 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                {location.availability === 'all' 
                  ? 'Available for all dates'
                  : location.availability === 'some'
                    ? 'Available for some dates'
                    : 'Not available for selected dates'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
