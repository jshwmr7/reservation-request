import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Plus, Filter, X, ToggleLeft, ToggleRight, MapPin, Check } from "lucide-react";
import { LocationType, Location as LocationData, Amenity } from "@/types/reservation";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LocationStep() {
  const { formData, dispatch } = useReservationForm();
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [selectedType, setSelectedType] = useState<LocationType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  if (formData.type === "Vehicle Reservation") {
    return null;
  }

  const locations: LocationData[] = [
    {
      id: "1",
      type: "Sports Field",
      name: "Main Soccer Field",
      image: "/lovable-uploads/f26293ed-cc74-4a89-9eb7-7f80389154da.png",
      rate: 100,
      amenities: ["Parking", "Wheel Chair Access"],
      availability: "all"
    },
    {
      id: "2",
      type: "Gymnasium",
      name: "Central Gym",
      image: "/lovable-uploads/1c595780-53a2-4915-9868-a8a2f93ce64d.png",
      rate: 150,
      amenities: ["Parking", "Wheel Chair Access", "Wi-fi"],
      availability: "some"
    },
    {
      id: "3",
      type: "Classroom",
      name: "Room 101",
      image: "/lovable-uploads/d91c2e35-41fe-4453-b1bc-b427ef520559.png",
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

  const handleLocationSelect = (location: LocationData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch({ type: "ADD_LOCATION", payload: location });
  };

  const handleLocationRemove = (locationId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch({ type: "REMOVE_LOCATION", payload: locationId });
  };

  const handleCardClick = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleDateToggle = (locationId: string, dateId: string) => {
    const location = formData.locations.find(loc => loc.id === locationId);
    const isExcluded = location?.excludedDates?.includes(dateId);
    
    if (isExcluded) {
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

  const isLocationSelected = (locationId: string) => {
    return formData.locations.some(loc => loc.id === locationId);
  };

  const allAmenities: Amenity[] = ["Parking", "Wheel Chair Access", "Wi-fi"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary-dark">Selected Locations</h2>
      </div>

      <div className="space-y-4">
        {formData.locations.map((location) => (
          <Card 
            key={location.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(location)}
          >
            <div className="flex items-center p-4">
              <MapPin className="w-8 h-8 text-muted-foreground mr-4" />
              <div className="flex-1">
                <h4 className="font-medium">{location.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Rate: ${location.rate}/hour
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Reserved Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.dates.map((date) => {
                      const isExcluded = location.excludedDates?.includes(date.id);
                      return (
                        <Button
                          key={date.id}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateToggle(location.id, date.id);
                          }}
                          className={`flex items-center gap-2 transition-colors ${
                            !isExcluded 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          {!isExcluded ? (
                            <ToggleRight className="w-4 h-4" />
                          ) : (
                            <ToggleLeft className="w-4 h-4" />
                          )}
                          <span>
                            {format(date.date, "MMM d")} ({date.startTime}-{date.endTime})
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleLocationRemove(location.id, e)}
                className="shrink-0"
              >
                <X className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
        {formData.locations.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No locations selected</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-primary-dark">Available Locations</h2>
        
        <div className="flex items-center gap-4">
          <Select
            value={selectedType || "all"}
            onValueChange={(value) => setSelectedType(value as LocationType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Location Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sports Field">Sports Field</SelectItem>
              <SelectItem value="Baseball Diamond">Baseball Diamond</SelectItem>
              <SelectItem value="Gymnasium">Gymnasium</SelectItem>
              <SelectItem value="Classroom">Classroom</SelectItem>
            </SelectContent>
          </Select>
          {selectedType && (
            <button
              onClick={clearTypeSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Amenities
          </Button>
        </div>

        {showFilters && (
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h3 className="font-medium mb-2">Filter by Amenities</h3>
            <div className="flex flex-wrap gap-4">
              {allAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border cursor-pointer hover:shadow-lg transition-shadow`}
              onClick={() => handleCardClick(location)}
            >
              {isLocationSelected(location.id) && (
                <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
              )}
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
                <div className={`text-sm mb-4 ${
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
                <Button
                  onClick={(e) => isLocationSelected(location.id) 
                    ? handleLocationRemove(location.id, e) 
                    : handleLocationSelect(location, e)
                  }
                  variant={isLocationSelected(location.id) ? "destructive" : "default"}
                  className="w-full"
                >
                  {isLocationSelected(location.id) ? "Remove Location" : "Select Location"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog 
        open={selectedLocation !== null} 
        onOpenChange={() => setSelectedLocation(null)}
      >
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLocation?.name}</DialogTitle>
            <DialogDescription>
              Detailed view of the selected location
            </DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <div className="space-y-4">
              <img
                src={selectedLocation.image}
                alt={selectedLocation.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedLocation.name}</h3>
                <p className="text-muted-foreground">Type: {selectedLocation.type}</p>
                <p className="text-muted-foreground">Rate: ${selectedLocation.rate}/hour</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
