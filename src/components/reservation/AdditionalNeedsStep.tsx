import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { AdditionalItem, VehicleType, FacilityItemType } from "@/types/reservation";
import { Button } from "@/components/ui/button";
import { Check, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const MOCK_FACILITY_ITEMS: AdditionalItem[] = [
  {
    id: "1",
    type: "Chairs",
    name: "Folding Chairs",
    image: "/placeholder.svg",
    rate: 5,
    quantityAvailable: 100
  },
  {
    id: "2",
    type: "Tables",
    name: "Banquet Tables",
    image: "/placeholder.svg",
    rate: 15,
    quantityAvailable: 20
  },
  {
    id: "3",
    type: "Microphone",
    name: "Wireless Microphone",
    image: "/placeholder.svg",
    rate: 25,
    quantityAvailable: 5
  },
  {
    id: "4",
    type: "Projector",
    name: "HD Projector",
    image: "/placeholder.svg",
    rate: 50,
    quantityAvailable: 3
  },
];

const MOCK_VEHICLES: AdditionalItem[] = [
  {
    id: "v1",
    type: "Pick-Up Truck",
    name: "Ford F-150",
    image: "/placeholder.svg",
    rate: 75,
    quantityAvailable: 2
  },
  {
    id: "v2",
    type: "Service Van",
    name: "Ford Transit",
    image: "/placeholder.svg",
    rate: 100,
    quantityAvailable: 1
  },
  {
    id: "v3",
    type: "Commuter Car",
    name: "Toyota Prius",
    image: "/placeholder.svg",
    rate: 50,
    quantityAvailable: 3
  },
];

export function AdditionalNeedsStep() {
  const { formData, dispatch } = useReservationForm();
  const [selectedTypes, setSelectedTypes] = useState<(VehicleType | FacilityItemType)[]>([]);

  const handleItemSelect = (item: AdditionalItem) => {
    if (formData.additionalItems.some(i => i.id === item.id)) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: item.id,
      });
    } else {
      dispatch({
        type: "ADD_ITEM",
        payload: { ...item, selectedQuantity: 1 },
      });
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    dispatch({
      type: "UPDATE_ITEM_QUANTITY",
      payload: { id, quantity },
    });
  };

  const handleDateToggle = (itemId: string, dateId: string) => {
    const item = formData.additionalItems.find(i => i.id === itemId);
    if (item?.includedDates?.includes(dateId)) {
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

  const isItemSelected = (itemId: string) => {
    return formData.additionalItems.some(item => item.id === itemId);
  };

  const getSelectedQuantity = (itemId: string) => {
    const item = formData.additionalItems.find(item => item.id === itemId);
    return item?.selectedQuantity || 0;
  };

  const isDateIncluded = (itemId: string, dateId: string) => {
    const item = formData.additionalItems.find(i => i.id === itemId);
    return item?.includedDates?.includes(dateId) || false;
  };

  const showVehicles = formData.type === "Staff Vehicle" || formData.type === "Field Trip" || formData.module === "Transportation Requests";
  const items = showVehicles ? MOCK_VEHICLES : MOCK_FACILITY_ITEMS;
  
  const allTypes = Array.from(new Set(items.map(item => item.type)));

  const toggleType = (type: VehicleType | FacilityItemType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredItems = items.filter(item => 
    selectedTypes.length === 0 || selectedTypes.includes(item.type)
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Type Filters
        </h3>
        <div className="flex flex-wrap gap-2">
          {allTypes.map((type) => (
            <Button
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="p-6"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Rate: ${item.rate} / day | Available: {item.quantityAvailable}
                </p>
                <Button
                  onClick={() => handleItemSelect(item)}
                  variant={isItemSelected(item.id) ? "secondary" : "outline"}
                  className="mt-4 w-full"
                >
                  {isItemSelected(item.id) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Selected
                    </>
                  ) : (
                    "Select Item"
                  )}
                </Button>
                {isItemSelected(item.id) && (
                  <>
                    <div className="flex items-center justify-center mt-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, getSelectedQuantity(item.id) - 1);
                        }}
                        disabled={getSelectedQuantity(item.id) <= 0}
                        variant="outline"
                        size="sm"
                      >
                        -
                      </Button>
                      <span className="mx-4">{getSelectedQuantity(item.id)}</span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, getSelectedQuantity(item.id) + 1);
                        }}
                        disabled={getSelectedQuantity(item.id) >= item.quantityAvailable}
                        variant="outline"
                        size="sm"
                      >
                        +
                      </Button>
                    </div>
                    {formData.dates.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium mb-2">Selected Dates:</p>
                        <div className="space-y-2">
                          {formData.dates.map((date) => (
                            <div
                              key={date.id}
                              onClick={() => handleDateToggle(item.id, date.id)}
                              className={`text-sm p-2 rounded cursor-pointer ${
                                isDateIncluded(item.id, date.id)
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {format(date.date, "MMM d, yyyy")} ({date.startTime} - {date.endTime})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
