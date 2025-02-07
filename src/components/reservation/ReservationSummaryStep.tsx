
import React, { useMemo } from 'react';
import { format } from "date-fns";
import { useReservationForm } from "@/contexts/ReservationFormContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, MapPin, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ReservationSummaryStep() {
  const { formData } = useReservationForm();

  const costBreakdown = useMemo(() => {
    return formData.dates.map(date => {
      const locationCosts = formData.locations.map(location => {
        const isDateExcluded = location.excludedDates?.includes(date.id);
        if (isDateExcluded) return null;

        // Calculate hours difference
        const startTime = new Date(`2000-01-01T${date.startTime}`);
        const endTime = new Date(`2000-01-01T${date.endTime}`);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        return {
          name: location.name,
          cost: location.rate * hours
        };
      }).filter(Boolean);

      const itemCosts = formData.additionalItems.map(item => {
        const isDateIncluded = item.includedDates?.includes(date.id);
        if (!isDateIncluded) return null;

        return {
          name: item.name,
          cost: item.rate * (item.selectedQuantity || 1)
        };
      }).filter(Boolean);

      return {
        date,
        locationCosts,
        itemCosts,
        totalCost: [
          ...locationCosts,
          ...itemCosts
        ].reduce((sum, item) => sum + item.cost, 0)
      };
    });
  }, [formData]);

  const totalCost = useMemo(() => {
    return costBreakdown.reduce((sum, day) => sum + day.totalCost, 0);
  }, [costBreakdown]);

  if (!formData.type || !formData.dates.length) {
    return (
      <div className="text-center text-muted-foreground">
        Please complete the previous steps first.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Reservation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Type:</strong> {formData.type}</p>
            <p><strong>Description:</strong> {formData.description || 'No description provided'}</p>
          </div>
        </CardContent>
      </Card>

      {costBreakdown.map((dayBreakdown, index) => (
        <Card key={dayBreakdown.date.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(dayBreakdown.date.date, "MMMM d, yyyy")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {dayBreakdown.date.startTime} - {dayBreakdown.date.endTime}
              {dayBreakdown.date.repeatSchedule && ` (Repeats ${dayBreakdown.date.repeatSchedule})`}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {dayBreakdown.locationCosts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4" />
                  Locations
                </div>
                {dayBreakdown.locationCosts.map((loc, i) => (
                  <div key={i} className="flex justify-between text-sm pl-6">
                    <span>{loc.name}</span>
                    <span>${loc.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {dayBreakdown.itemCosts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Package className="w-4 h-4" />
                  Additional Items
                </div>
                {dayBreakdown.itemCosts.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm pl-6">
                    <span>{item.name}</span>
                    <span>${item.cost.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Day Total</span>
                <span>${dayBreakdown.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Reservation Cost</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
