import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateTimeSlots, convertTo24Hour, getDayOfWeekName } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface StepTwoProps {
  onNext: () => void;
  onPrevious: () => void;
  onAvailabilitySet: () => void;
}

interface DayAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export default function StepTwo({ onNext, onPrevious, onAvailabilitySet }: StepTwoProps) {
  // Generate time slots in 30-minute increments
  const timeSlots = generateTimeSlots(30);
  
  // Initialize availability for each day of the week
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>([
    { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", enabled: true }, // Monday
    { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", enabled: true }, // Tuesday
    { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", enabled: true }, // Wednesday
    { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", enabled: true }, // Thursday
    { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", enabled: true }, // Friday
    { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", enabled: false }, // Saturday
    { dayOfWeek: 0, startTime: "10:00", endTime: "15:00", enabled: false }, // Sunday
  ]);

  // Mutation to save availability settings
  const saveAvailabilityMutation = useMutation({
    mutationFn: async (data: Omit<DayAvailability, "enabled">) => {
      return await apiRequest("POST", "/api/availability", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
    },
  });

  // Toggle day availability
  const toggleDayEnabled = (dayIndex: number) => {
    setAvailabilities(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  // Update start time for a day
  const updateStartTime = (dayIndex: number, time: string) => {
    setAvailabilities(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, startTime: convertTo24Hour(time) } : day
      )
    );
  };

  // Update end time for a day
  const updateEndTime = (dayIndex: number, time: string) => {
    setAvailabilities(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, endTime: convertTo24Hour(time) } : day
      )
    );
  };

  // Save availability settings
  const saveAvailability = async () => {
    // Filter only enabled days
    const enabledAvailabilities = availabilities.filter(day => day.enabled);
    
    // Save each enabled day's availability
    for (const availability of enabledAvailabilities) {
      const { enabled, ...availabilityData } = availability;
      await saveAvailabilityMutation.mutateAsync(availabilityData);
    }
    
    onAvailabilitySet();
    onNext();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Set Your Availability</h3>
      <p className="text-neutral-dark mb-6">
        Configure when you're available for meetings during the week. This helps others schedule time with you during your preferred hours.
      </p>
      
      <div className="space-y-6 mb-8">
        {availabilities.map((day, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`day-${index}`}
                  checked={day.enabled}
                  onChange={() => toggleDayEnabled(index)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1C4A1C] focus:ring-[#1C4A1C]"
                />
                <Label htmlFor={`day-${index}`} className="ml-2 font-medium">
                  {getDayOfWeekName(day.dayOfWeek)}
                </Label>
              </div>
              
              {!day.enabled && (
                <span className="text-sm text-gray-500">Unavailable</span>
              )}
            </div>
            
            {day.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start-${index}`} className="text-sm block mb-1">
                    Start Time
                  </Label>
                  <Select 
                    onValueChange={(val) => updateStartTime(index, val)}
                    defaultValue={timeSlots.find(slot => convertTo24Hour(slot) === day.startTime)}
                  >
                    <SelectTrigger id={`start-${index}`}>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time, i) => (
                        <SelectItem key={i} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`end-${index}`} className="text-sm block mb-1">
                    End Time
                  </Label>
                  <Select 
                    onValueChange={(val) => updateEndTime(index, val)}
                    defaultValue={timeSlots.find(slot => convertTo24Hour(slot) === day.endTime)}
                  >
                    <SelectTrigger id={`end-${index}`}>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time, i) => (
                        <SelectItem key={i} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          className="bg-[#1C4A1C] hover:bg-[#2C602C]"
          onClick={saveAvailability}
          disabled={saveAvailabilityMutation.isPending}
        >
          {saveAvailabilityMutation.isPending ? "Saving..." : "Save and Continue"}
        </Button>
      </div>
    </div>
  );
}
