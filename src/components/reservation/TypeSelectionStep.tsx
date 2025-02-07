
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";
import { Building2, Car } from "lucide-react";

export function TypeSelectionStep() {
  const { formData, dispatch } = useReservationForm();

  const handleTypeSelect = (type: ReservationType) => {
    dispatch({ type: "SET_TYPE", payload: type });
    // The parent component will handle the step advancement based on type being set
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          onClick={() => handleTypeSelect("Vehicle Reservation")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.type === "Vehicle Reservation"
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <Car className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Vehicle Reservation</h3>
              <p className="text-sm text-muted-foreground">
                Reserve company vehicles for business use
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => handleTypeSelect("Facility Rental")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.type === "Facility Rental" ? "border-2 border-primary" : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <Building2 className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Facility Rental</h3>
              <p className="text-sm text-muted-foreground">
                Book facilities and spaces for events
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
