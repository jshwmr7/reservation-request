import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { AdditionalItem, VehicleType, FacilityItemType } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, X, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const vehicleOptions: AdditionalItem[] = [
  {
    id: "truck-1",
    type: "Pick-Up Truck",
    name: "Standard Pick-Up Truck",
    image: "/lovable-uploads/4a7db52c-f46c-4061-9c89-deeb179b255f.png",
    rate: 75,
    quantityAvailable: 3,
  },
  {
    id: "van-1",
    type: "Service Van",
    name: "Cargo Service Van",
    image: "/lovable-uploads/fc19dc02-16dc-4c25-a71e-2c95756892cb.png",
    rate: 65,
    quantityAvailable: 5,
  },
  {
    id: "car-1",
    type: "Commuter Car",
    name: "Economy Commuter Car",
    image: "/lovable-uploads/6823cac9-bf7c-43ba-9e02-b26210b51701.png",
    rate: 45,
    quantityAvailable: 8,
  },
];

const facilityOptions: AdditionalItem[] = [
  {
    id: "chairs-1",
    type: "Chairs",
    name: "Folding Chairs",
    image: "/lovable-uploads/62207bc5-e70c-477a-b5a3-84c093988a64.png",
    rate: 2,
    quantityAvailable: 100,
  },
  {
    id: "tables-1",
    type: "Tables",
    name: "Banquet Tables",
    image: "/lovable-uploads/5f224542-0e18-47a7-914c-55363952f1e2.png",
    rate: 10,
    quantityAvailable: 30,
  },
  {
    id: "mic-1",
    type: "Microphone",
    name: "Wireless Microphone",
    image: "/lovable-uploads/f0e8a1d3-641a-40f4-b8ee-e534db523ddd.png",
    rate: 25,
    quantityAvailable: 10,
  },
  {
    id: "proj-1",
    type: "Projector",
    name: "HD Projector",
    image: "/lovable-uploads/3a25b7fb-55ae-4fbc-b375-f84597b22c3b.png",
    rate: 50,
    quantityAvailable: 5,
  },
];

export function AdditionalNeedsStep() {
  const { formData, dispatch } = useReservationForm();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<AdditionalItem | null>(null);

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
        payload: { ...item, selectedQuantity: quantity, includedDates: formData.dates.map(date => date.id) },
      });
      setSelectedQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  const handleRemoveItem = (itemId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  const handleDateToggle = (itemId: string, dateId: string) => {
    const item = formData.additionalItems.find(item => item.id === itemId);
    const isIncluded = item?.includedDates?.includes(dateId);
    
    if (isIncluded) {
      dispatch({
        type: "REMOVE_DATE_FROM_ITEM",
        payload: { itemId, dateId },
      });
    } else {
      dispatch({
        type: "ADD_DATE_TO_ITEM",
        payload: { itemId, dateId },
      });
    }
  };

  const handleCardClick = (item: AdditionalItem) => {
    setSelectedItem(item);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-primary-dark">Selected Items</h2>
      </div>

      <div className="space-y-4">
        {formData.additionalItems.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick(item)}
          >
            <div className="flex items-center p-4">
              <Package className="w-8 h-8 text-muted-foreground mr-4" />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.selectedQuantity} | ${item.rate}/day each
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Selected Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.dates.map((date) => {
                      const isIncluded = item.includedDates?.includes(date.id);
                      return (
                        <Button 
                          key={date.id}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateToggle(item.id, date.id);
                          }}
                          className={`flex items-center gap-2 transition-colors ${
                            isIncluded 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          {isIncluded ? (
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
                onClick={(e) => handleRemoveItem(item.id, e)}
                className="shrink-0"
              >
                <X className="w-4 h-4 text-destructive" />
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

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
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
          {selectedType !== "all" && (
            <button
              onClick={() => setSelectedType("all")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <h2 className="text-2xl font-semibold text-primary-dark flex-1">Available Items</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(item)}
            >
              <CardHeader className="p-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain"  // Changed from object-cover to object-contain
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
                    onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddItem(item);
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog 
        open={selectedItem !== null} 
        onOpenChange={() => setSelectedItem(null)}
      >
        <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Detailed view of the selected item
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                <p className="text-muted-foreground">Type: {selectedItem.type}</p>
                <p className="text-muted-foreground">Rate: ${selectedItem.rate}/day</p>
                <p className="text-muted-foreground">Available Quantity: {selectedItem.quantityAvailable}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
