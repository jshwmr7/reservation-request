
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { ModuleType } from "@/types/reservation";
import { FileText, Tool } from "lucide-react";

export function ModuleSelectionStep() {
  const { formData, dispatch } = useReservationForm();

  const handleModuleSelect = (module: ModuleType) => {
    dispatch({ type: "SET_MODULE", payload: module });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          onClick={() => handleModuleSelect("Reservation Request")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.module === "Reservation Request"
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <FileText className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Reservation Request</h3>
              <p className="text-sm text-muted-foreground">
                Request facilities or vehicles for your needs
              </p>
            </div>
          </div>
        </Card>

        <Card
          onClick={() => handleModuleSelect("Maintenance Request")}
          className={`p-6 cursor-pointer transition-all hover:border-primary ${
            formData.module === "Maintenance Request"
              ? "border-2 border-primary"
              : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <Tool className="w-12 h-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Maintenance Request</h3>
              <p className="text-sm text-muted-foreground">
                Submit maintenance requests for facilities or vehicles
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
