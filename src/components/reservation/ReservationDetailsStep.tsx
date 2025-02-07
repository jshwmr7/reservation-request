
import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, XCircle } from "lucide-react";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { ReservationDate } from "@/types/reservation";

interface DateFieldProps {
  onAdd: (date: ReservationDate) => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

const DateField = ({ onAdd, onRemove, showRemoveButton }: DateFieldProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedStartTime, setSelectedStartTime] = useState<string>("09:00");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("17:00");
  const [repeatSchedule, setRepeatSchedule] = useState<
    "daily" | "weekly" | "biweekly" | undefined
  >();

  const handleAddDate = () => {
    if (selectedDate) {
      const newDate: ReservationDate = {
        id: nanoid(),
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        repeatSchedule,
      };
      onAdd(newDate);
      setSelectedDate(undefined);
      setSelectedStartTime("09:00");
      setSelectedEndTime("17:00");
      setRepeatSchedule(undefined);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Time</label>
        <input
          type="time"
          value={selectedStartTime}
          onChange={(e) => setSelectedStartTime(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">End Time</label>
        <input
          type="time"
          value={selectedEndTime}
          onChange={(e) => setSelectedEndTime(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Repeat Schedule</label>
        <select
          value={repeatSchedule || ""}
          onChange={(e) =>
            setRepeatSchedule(
              e.target.value as "daily" | "weekly" | "biweekly" | undefined
            )
          }
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">No repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
        </select>
      </div>
      {showRemoveButton ? (
        <Button variant="ghost" size="sm" onClick={onRemove} className="w-full">
          <XCircle className="w-4 h-4 mr-2" />
          Remove Date
        </Button>
      ) : (
        <Button
          onClick={handleAddDate}
          disabled={!selectedDate}
          className="w-full"
          variant="secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add This Date
        </Button>
      )}
    </div>
  );
};

export function ReservationDetailsStep() {
  const { formData, dispatch } = useReservationForm();
  const [dateFields, setDateFields] = useState([nanoid()]);

  const handleAddDate = (date: ReservationDate) => {
    dispatch({ type: "ADD_DATE", payload: date });
  };

  const handleRemoveDate = (id: string) => {
    dispatch({ type: "REMOVE_DATE", payload: id });
  };

  const addNewDateField = () => {
    setDateFields((prev) => [...prev, nanoid()]);
  };

  const removeDateField = (index: number) => {
    setDateFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
          placeholder="Enter reservation details..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Reservation Dates</label>
          <Button variant="outline" size="sm" onClick={addNewDateField}>
            <Plus className="w-4 h-4 mr-2" />
            Add Another Date
          </Button>
        </div>

        <div className="space-y-4">
          {dateFields.map((fieldId, index) => (
            <DateField
              key={fieldId}
              onAdd={handleAddDate}
              onRemove={() => removeDateField(index)}
              showRemoveButton={dateFields.length > 1}
            />
          ))}
        </div>

        {formData.dates.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Dates</label>
            {formData.dates.map((date) => (
              <div
                key={date.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(date.date, "PPP")} from {date.startTime} to{" "}
                    {date.endTime}
                    {date.repeatSchedule && ` (Repeats ${date.repeatSchedule})`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDate(date.id)}
                >
                  <XCircle className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
