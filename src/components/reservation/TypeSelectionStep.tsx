
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Card } from "@/components/ui/card";
import { ReservationType } from "@/types/reservation";

export function TypeSelectionStep() {
  const { formData, dispatch } = useReservationForm();

  const handleTypeSelect = (type: ReservationType) => {
    dispatch({ type: "SET_TYPE", payload: type });
  };

  const types = formData.module === "Schedule Requests" 
    ? [
        { id: "athletics", label: "Athletics", type: "Athletics" as ReservationType },
        { id: "meeting", label: "Meeting", type: "Meeting" as ReservationType }
      ]
    : [
        { id: "field-trip", label: "Field Trip", type: "Field Trip" as ReservationType },
        { id: "staff-vehicle", label: "Staff Vehicle", type: "Staff Vehicle" as ReservationType }
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        {types.map((option) => (
          <Card
            key={option.id}
            onClick={() => handleTypeSelect(option.type)}
            className={`p-6 cursor-pointer transition-all hover:border-primary ${
              formData.type === option.type ? "border-2 border-primary" : ""
            }`}
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <div>
                <h3 className="text-lg font-semibold">{option.label}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
