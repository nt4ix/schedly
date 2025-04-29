import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateTimeSlots, convertTo24Hour, getDayOfWeekName } from "@/lib/utils";
import { Availability } from "@shared/schema";

interface AvailabilityFormProps {
  availabilities: Availability[];
  timezone: string;
}

export default function AvailabilityForm({ availabilities, timezone }: AvailabilityFormProps) {
  const { toast } = useToast();
  const timeSlots = generateTimeSlots(30);

  // Map the availabilities into state-friendly format
  const initialDays = [
    { dayOfWeek: 0, name: "Sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 1, name: "Monday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 2, name: "Tuesday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 3, name: "Wednesday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 4, name: "Thursday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 5, name: "Friday", enabled: false, startTime: "09:00", endTime: "17:00" },
    { dayOfWeek: 6, name: "Saturday", enabled: false, startTime: "09:00", endTime: "17:00" },
  ];

  // Pre-populate from existing availabilities
  availabilities.forEach(avail => {
    const dayIndex = initialDays.findIndex(d => d.dayOfWeek === avail.dayOfWeek);
    if (dayIndex >= 0) {
      initialDays[dayIndex].enabled = true;
      initialDays[dayIndex].startTime = avail.startTime;
      initialDays[dayIndex].endTime = avail.endTime;
    }
  });

  const [days, setDays] = useState(initialDays);

  // Create/update availability
  const saveMutation = useMutation({
    mutationFn: async (data: { dayOfWeek: number; startTime: string; endTime: string; }) => {
      // Check if availability already exists for this day
      const existing = availabilities.find(a => a.dayOfWeek === data.dayOfWeek);
      
      if (existing) {
        // Update existing
        return await apiRequest("PUT", `/api/availability/${existing.id}`, data);
      } else {
        // Create new
        return await apiRequest("POST", "/api/availability", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({
        title: "Availability saved",
        description: "Your availability settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save availability settings.",
        variant: "destructive",
      });
    }
  });

  // Delete availability
  const deleteMutation = useMutation({
    mutationFn: async (dayOfWeek: number) => {
      const existing = availabilities.find(a => a.dayOfWeek === dayOfWeek);
      if (existing) {
        return await apiRequest("DELETE", `/api/availability/${existing.id}`, undefined);
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability"] });
      toast({
        title: "Availability updated",
        description: "The selected day has been marked as unavailable.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update availability settings.",
        variant: "destructive",
      });
    }
  });

  const toggleDayEnabled = async (index: number) => {
    const day = days[index];
    const newEnabled = !day.enabled;
    
    // Update local state first
    setDays(prevDays => 
      prevDays.map((d, i) => 
        i === index ? { ...d, enabled: newEnabled } : d
      )
    );
    
    // Then update database
    if (newEnabled) {
      // Create/update availability
      await saveMutation.mutateAsync({
        dayOfWeek: day.dayOfWeek,
        startTime: day.startTime,
        endTime: day.endTime
      });
    } else {
      // Delete availability
      await deleteMutation.mutateAsync(day.dayOfWeek);
    }
  };

  const updateTime = async (index: number, field: 'startTime' | 'endTime', value: string) => {
    const day = days[index];
    const time24h = convertTo24Hour(value);
    
    // Update local state
    setDays(prevDays => 
      prevDays.map((d, i) => 
        i === index ? { ...d, [field]: time24h } : d
      )
    );
    
    // Only save to database if day is enabled
    if (day.enabled) {
      await saveMutation.mutateAsync({
        dayOfWeek: day.dayOfWeek,
        startTime: field === 'startTime' ? time24h : day.startTime,
        endTime: field === 'endTime' ? time24h : day.endTime
      });
    }
  };

  const handleCopyToAllWeekdays = async () => {
    // Find first enabled weekday
    const weekday = days.find(d => d.enabled && d.dayOfWeek >= 1 && d.dayOfWeek <= 5);
    
    if (!weekday) {
      toast({
        title: "No weekday schedule",
        description: "Enable at least one weekday schedule first.",
        variant: "destructive",
      });
      return;
    }
    
    // Update all weekdays to match
    const updatedDays = [...days];
    
    for (let i = 0; i < updatedDays.length; i++) {
      const day = updatedDays[i];
      
      // Skip weekends
      if (day.dayOfWeek === 0 || day.dayOfWeek === 6) continue;
      
      // Update day settings
      updatedDays[i] = {
        ...day,
        enabled: true,
        startTime: weekday.startTime,
        endTime: weekday.endTime
      };
      
      // Save to database
      await saveMutation.mutateAsync({
        dayOfWeek: day.dayOfWeek,
        startTime: weekday.startTime,
        endTime: weekday.endTime
      });
    }
    
    // Update local state
    setDays(updatedDays);
    
    toast({
      title: "Weekdays updated",
      description: "Your weekday availability has been copied to all weekdays.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Weekly Availability</h3>
        <div className="text-sm text-gray-500">Timezone: {timezone}</div>
      </div>
      
      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          {days.map((day, index) => (
            <AccordionItem key={day.dayOfWeek} value={`day-${day.dayOfWeek}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center w-full">
                  <div className="flex items-center flex-1">
                    <Switch
                      checked={day.enabled}
                      onCheckedChange={() => toggleDayEnabled(index)}
                      className="mr-3"
                    />
                    <span className={`font-medium ${!day.enabled && "text-gray-400"}`}>
                      {day.name}
                    </span>
                  </div>
                  
                  {day.enabled && (
                    <div className="text-sm text-gray-500 mr-2">
                      {day.startTime} - {day.endTime}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {day.enabled && (
                  <div className="grid grid-cols-2 gap-4 pt-2 px-12">
                    <div>
                      <Label htmlFor={`start-time-${day.dayOfWeek}`} className="text-sm">
                        Start Time
                      </Label>
                      <Select
                        value={timeSlots.find(slot => convertTo24Hour(slot) === day.startTime)}
                        onValueChange={(val) => updateTime(index, 'startTime', val)}
                        disabled={!day.enabled || saveMutation.isPending}
                      >
                        <SelectTrigger id={`start-time-${day.dayOfWeek}`}>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={`start-${day.dayOfWeek}-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`end-time-${day.dayOfWeek}`} className="text-sm">
                        End Time
                      </Label>
                      <Select
                        value={timeSlots.find(slot => convertTo24Hour(slot) === day.endTime)}
                        onValueChange={(val) => updateTime(index, 'endTime', val)}
                        disabled={!day.enabled || saveMutation.isPending}
                      >
                        <SelectTrigger id={`end-time-${day.dayOfWeek}`}>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={`end-${day.dayOfWeek}-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleCopyToAllWeekdays}
          disabled={saveMutation.isPending}
        >
          Copy to All Weekdays
        </Button>
      </div>
    </div>
  );
}
