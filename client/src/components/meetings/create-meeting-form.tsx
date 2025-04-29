import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { MeetingType } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, addMinutes, parse } from "date-fns";
import { generateTimeSlots, getUserTimezone } from "@/lib/utils";

interface CreateMeetingFormProps {
  meetingTypes: MeetingType[];
  onSuccess: () => void;
}

export default function CreateMeetingForm({ meetingTypes, onSuccess }: CreateMeetingFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    meetingTypeId: meetingTypes.length > 0 ? meetingTypes[0].id : 0,
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    attendees: [{ name: "", email: "" }],
    location: "Zoom",
    timezone: getUserTimezone()
  });
  
  // Generate time slots in 15-minute increments
  const timeSlots = generateTimeSlots(15);
  
  const createMeetingMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/meetings", data);
    },
    onSuccess: () => {
      toast({
        title: "Meeting created",
        description: "Your meeting has been scheduled successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error creating your meeting. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleCreateMeeting = () => {
    // Validate required fields
    if (!formData.meetingTypeId || !formData.title || !formData.date || !formData.startTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Find selected meeting type to get duration
    const selectedType = meetingTypes.find(type => type.id === formData.meetingTypeId);
    if (!selectedType) {
      toast({
        title: "Invalid meeting type",
        description: "Please select a valid meeting type.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert date and time strings to Date objects
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const startTime = new Date(formData.date);
    startTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time based on meeting duration
    const endTime = addMinutes(startTime, selectedType.duration);
    
    // Filter out empty attendees
    const filteredAttendees = formData.attendees.filter(att => att.name || att.email);
    
    // Prepare data for API
    const meetingData = {
      meetingTypeId: formData.meetingTypeId,
      title: formData.title,
      description: formData.description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      timezone: formData.timezone,
      location: formData.location || selectedType.location,
      attendees: filteredAttendees.length > 0 ? filteredAttendees : []
    };
    
    createMeetingMutation.mutate(meetingData);
  };
  
  const addAttendee = () => {
    setFormData({
      ...formData,
      attendees: [...formData.attendees, { name: "", email: "" }]
    });
  };
  
  const updateAttendee = (index: number, field: 'name' | 'email', value: string) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index] = {
      ...updatedAttendees[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      attendees: updatedAttendees
    });
  };
  
  const removeAttendee = (index: number) => {
    if (formData.attendees.length === 1) return;
    
    const updatedAttendees = formData.attendees.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attendees: updatedAttendees
    });
  };
  
  // When meeting type changes, update location if available
  const handleMeetingTypeChange = (id: number) => {
    const selectedType = meetingTypes.find(type => type.id === id);
    setFormData({
      ...formData,
      meetingTypeId: id,
      location: selectedType?.location || formData.location,
      title: selectedType?.name || formData.title
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="meeting-type">Meeting Type</Label>
        <Select
          value={formData.meetingTypeId.toString()}
          onValueChange={(val) => handleMeetingTypeChange(parseInt(val))}
        >
          <SelectTrigger id="meeting-type">
            <SelectValue placeholder="Select meeting type" />
          </SelectTrigger>
          <SelectContent>
            {meetingTypes.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name} ({type.duration} min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Enter meeting title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Enter meeting description or agenda"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData({...formData, date})}
                initialFocus
                fromDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Select
            value={formData.startTime}
            onValueChange={(val) => setFormData({...formData, startTime: val})}
          >
            <SelectTrigger id="start-time" className="w-full">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time.split(' ')[0]}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select
          value={formData.location}
          onValueChange={(val) => setFormData({...formData, location: val})}
        >
          <SelectTrigger id="location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Zoom">Zoom</SelectItem>
            <SelectItem value="Google Meet">Google Meet</SelectItem>
            <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
            <SelectItem value="Phone Call">Phone Call</SelectItem>
            <SelectItem value="In Person">In Person</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Attendees</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAttendee}
          >
            Add Attendee
          </Button>
        </div>
        
        {formData.attendees.map((attendee, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 items-center">
            <Input
              value={attendee.name}
              onChange={(e) => updateAttendee(index, 'name', e.target.value)}
              placeholder="Name"
              className="col-span-2"
            />
            <Input
              value={attendee.email}
              onChange={(e) => updateAttendee(index, 'email', e.target.value)}
              placeholder="Email"
              className="col-span-2"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeAttendee(index)}
              disabled={formData.attendees.length === 1}
              className="col-span-1"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        className="w-full bg-[#1C4A1C] hover:bg-[#2C602C]"
        onClick={handleCreateMeeting}
        disabled={createMeetingMutation.isPending}
      >
        {createMeetingMutation.isPending ? "Creating Meeting..." : "Create Meeting"}
      </Button>
    </div>
  );
}
