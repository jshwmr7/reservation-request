
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { ModuleType } from "@/types/reservation";
import { Clock, Bus } from "lucide-react";

export function ModuleSelectionStep() {
  const { formData, dispatch } = useReservationForm();

  const handleModuleSelect = (module: ModuleType) => {
    dispatch({ type: "SET_MODULE", payload: module });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          onClick={() => handleModuleSelect("Schedule Requests")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.module === "Schedule Requests"
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <Clock className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Schedule Requests</h3>
              <p className="text-sm text-muted-foreground">
                Request facilities for athletics and meetings
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => handleModuleSelect("Transportation Requests")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.module === "Transportation Requests"
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <Bus className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Transportation Requests</h3>
              <p className="text-sm text-muted-foreground">
                Request vehicles for field trips and staff use
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
