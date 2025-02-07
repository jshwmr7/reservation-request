
import { useState } from "react";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, XCircle } from "lucide-react";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { ReservationDate, ReservationType } from "@/types/reservation";

export function ReservationDetailsStep() {
  const { formData, dispatch } = useReservationForm();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [repeatSchedule, setRepeatSchedule] = useState<
    "daily" | "weekly" | "biweekly" | undefined
  >();

  const handleAddDate = () => {
    if (selectedDate) {
      const newDate: ReservationDate = {
        id: nanoid(),
        date: selectedDate,
        endDate: selectedEndDate,
        time: selectedTime,
        repeatSchedule,
      };
      dispatch({ type: "ADD_DATE", payload: newDate });
      setSelectedDate(undefined);
      setSelectedEndDate(undefined);
      setSelectedTime("09:00");
      setRepeatSchedule(undefined);
    }
  };

  const handleRemoveDate = (id: string) => {
    dispatch({ type: "REMOVE_DATE", payload: id });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Reservation Type</label>
        <Select
          value={formData.type}
          onValueChange={(value: ReservationType) =>
            dispatch({ type: "SET_TYPE", payload: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select reservation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vehicle Reservation">Vehicle Reservation</SelectItem>
            <SelectItem value="Facility Rental">Facility Rental</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Date
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Reservation Date</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date (Optional)</label>
                  <Calendar
                    mode="single"
                    selected={selectedEndDate}
                    onSelect={setSelectedEndDate}
                    initialFocus
                    disabled={(date) =>
                      selectedDate ? date < selectedDate : false
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Repeat Schedule</label>
                  <Select
                    value={repeatSchedule}
                    onValueChange={(value: "daily" | "weekly" | "biweekly") =>
                      setRepeatSchedule(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No repeat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddDate}
                  disabled={!selectedDate}
                  className="w-full"
                >
                  Add Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {formData.dates.map((date) => (
            <div
              key={date.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
            >
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(date.date, "PPP")}
                  {date.endDate && ` to ${format(date.endDate, "PPP")}`} at{" "}
                  {date.time}
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
      </div>
    </div>
  );
}
