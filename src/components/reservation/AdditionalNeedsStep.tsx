
import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { AdditionalItem, VehicleType, FacilityItemType } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { format } from "date-fns"; // Added this import
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, MinusCircle, Package, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleOptions: AdditionalItem[] = [
  {
    id: "truck-1",
    type: "Pick-Up Truck",
    name: "Standard Pick-Up Truck",
    image: "/lovable-uploads/photo-1487887235947-a955ef187fcc.png",
    rate: 75,
    quantityAvailable: 3,
  },
  {
    id: "van-1",
    type: "Service Van",
    name: "Cargo Service Van",
    image: "/lovable-uploads/photo-1485827404703-89b55fcc595e.png",
    rate: 65,
    quantityAvailable: 5,
  },
  {
    id: "car-1",
    type: "Commuter Car",
    name: "Economy Commuter Car",
    image: "/lovable-uploads/photo-1498050108023-c5249f4df085.png",
    rate: 45,
    quantityAvailable: 8,
  },
];

const facilityOptions: AdditionalItem[] = [
  {
    id: "chairs-1",
    type: "Chairs",
    name: "Folding Chairs",
    image: "/lovable-uploads/photo-1498050108023-c5249f4df085.png",
    rate: 2,
    quantityAvailable: 100,
  },
  {
    id: "tables-1",
    type: "Tables",
    name: "Banquet Tables",
    image: "/lovable-uploads/photo-1485827404703-89b55fcc595e.png",
    rate: 10,
    quantityAvailable: 30,
  },
  {
    id: "mic-1",
    type: "Microphone",
    name: "Wireless Microphone",
    image: "/lovable-uploads/photo-1487887235947-a955ef187fcc.png",
    rate: 25,
    quantityAvailable: 10,
  },
  {
    id: "proj-1",
    type: "Projector",
    name: "HD Projector",
    image: "/lovable-uploads/photo-1498050108023-c5249f4df085.png",
    rate: 50,
    quantityAvailable: 5,
  },
];

export function AdditionalNeedsStep() {
  const { formData, dispatch } = useReservationForm();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [selectedType, setSelectedType] = useState<string>("all");

  const availableItems = formData.type === "Vehicle Reservation" ? vehicleOptions : facilityOptions;
  const filteredItems = selectedType === "all" 
    ? availableItems 
    : availableItems.filter(item => item.type === selectedType);

  const itemTypes = formData.type === "Vehicle Reservation" 
    ? ["Pick-Up Truck", "Service Van", "Commuter Car"]
    : ["Chairs", "Tables", "Microphone", "Projector"];

  const handleAddItem = (item: AdditionalItem) => {
    const quantity = selectedQuantities[item.id] || 1;
    if (quantity > 0 && quantity <= item.quantityAvailable) {
      dispatch({
        type: "ADD_ITEM",
        payload: { ...item, selectedQuantity: quantity, excludedDates: [] },
      });
      setSelectedQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const handleRemoveDateFromItem = (itemId: string, dateId: string) => {
    dispatch({
      type: "REMOVE_DATE_FROM_ITEM",
      payload: { itemId, dateId },
    });
  };

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = Math.min(
      Math.max(1, parseInt(value) || 1),
      availableItems.find((item) => item.id === itemId)?.quantityAvailable || 1
    );
    setSelectedQuantities((prev) => ({ ...prev, [itemId]: quantity }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Items</h3>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {itemTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rate: ${item.rate}/day
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available: {item.quantityAvailable}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max={item.quantityAvailable}
                      value={selectedQuantities[item.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">Quantity</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddItem(item)}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Items</h3>
          <div className="space-y-4">
            {formData.additionalItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <Package className="w-8 h-8 text-muted-foreground mr-4" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.selectedQuantity} | ${item.rate}/day each
                    </p>
                    {/* Excluded Dates */}
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Excluded Dates:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.dates.map((date) => {
                          const isExcluded = item.excludedDates?.includes(date.id);
                          return (
                            <Button
                              key={date.id}
                              variant={isExcluded ? "destructive" : "outline"}
                              size="sm"
                              onClick={() =>
                                handleRemoveDateFromItem(item.id, date.id)
                              }
                              className="flex items-center space-x-1"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>{format(date.date, "MMM d")}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <MinusCircle className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
            {formData.additionalItems.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No items selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
