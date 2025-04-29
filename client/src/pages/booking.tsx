import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formatDate, formatTime, getUserTimezone } from "@/lib/utils";
import { getAvailableTimeSlots } from "@/lib/time-utils";
import { addMinutes, format, subMinutes } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type BookingPageProps = {
  username: string;
  slug: string;
};

interface BookingData {
  user: {
    id: number;
    username: string;
    name?: string;
    email: string;
    timezone: string;
    profilePicture?: string;
  };
  meetingType: {
    id: number;
    userId: number;
    name: string;
    duration: number;
    description?: string;
    color: string;
    location?: string;
    slug: string;
  };
  availabilities: Array<{
    id: number;
    userId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

const bookingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function Booking({ username, slug }: BookingPageProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [userTimezone] = useState(getUserTimezone());
  
  // Form for attendee details
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: "onChange",
  });

  // Fetch booking data
  const {
    data: bookingData,
    isLoading,
    error
  } = useQuery<BookingData>({
    queryKey: [`/api/booking/${username}/${slug}`],
  });

  // Schedule meeting mutation
  const scheduleMeetingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/booking/${username}/${slug}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Meeting scheduled",
        description: "Your meeting has been scheduled successfully!",
      });
      // Move to confirmation step
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Failed to schedule meeting",
        description: "An error occurred while scheduling your meeting. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Generate time slots for selected date
  const availableTimeSlots = selectedDate && bookingData
    ? getAvailableTimeSlots(
        selectedDate,
        bookingData.availabilities,
        [], // Booked meetings would be fetched from API in a real app
        bookingData.meetingType.duration,
        bookingData.user.timezone
      )
    : [];

  // Handle form submission
  const onSubmit = (formData: BookingFormValues) => {
    if (!selectedDate || !selectedTime || !bookingData) return;
    
    const startTime = selectedTime;
    const endTime = addMinutes(startTime, bookingData.meetingType.duration);
    
    scheduleMeetingMutation.mutate({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: [{ name: formData.name, email: formData.email }],
      timezone: userTimezone,
      notes: formData.notes,
    });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time selection when date changes
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-2/3 mx-auto mb-2" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8 p-6">
              <div className="md:w-1/3">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              <div className="md:w-2/3">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-red-500">Booking Not Found</CardTitle>
              <CardDescription className="text-center">
                This booking link may be incorrect or no longer available.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-[#1C4A1C] text-2xl">
              {bookingData.meetingType.name} with {bookingData.user.name || bookingData.user.username}
            </CardTitle>
            <CardDescription className="text-center flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              {bookingData.meetingType.duration} minutes
              {bookingData.meetingType.location && (
                <>
                  <span>•</span>
                  <span>{bookingData.meetingType.location}</span>
                </>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col md:flex-row gap-8 p-6">
            {/* Step 1: Select Date and Time */}
            {step === 1 && (
              <>
                <div className="md:w-1/2 space-y-4">
                  <h3 className="text-lg font-semibold text-[#1C4A1C] flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="border-0"
                      fromDate={new Date()}
                    />
                  </div>
                </div>
                
                <div className="md:w-1/2 space-y-4">
                  <h3 className="text-lg font-semibold text-[#1C4A1C] flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Select Time ({userTimezone})
                  </h3>
                  
                  {selectedDate ? (
                    availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimeSlots.map((slot, i) => (
                          <Button
                            key={i}
                            variant={selectedTime && format(slot, 'HH:mm') === format(selectedTime, 'HH:mm') ? "default" : "outline"}
                            className={selectedTime && format(slot, 'HH:mm') === format(selectedTime, 'HH:mm') 
                              ? "bg-[#1C4A1C] hover:bg-[#2C602C]" 
                              : "hover:border-[#1C4A1C]"
                            }
                            onClick={() => setSelectedTime(slot)}
                          >
                            {format(slot, 'h:mm a')}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-lg p-8 text-center bg-gray-50">
                        <p className="text-gray-500">No available time slots for this date.</p>
                        <p className="text-gray-500 text-sm mt-2">Please select another date.</p>
                      </div>
                    )
                  ) : (
                    <div className="border rounded-lg p-8 text-center bg-gray-50">
                      <p className="text-gray-500">Please select a date first.</p>
                    </div>
                  )}
                  
                  {selectedDate && selectedTime && (
                    <div className="mt-6">
                      <Button 
                        className="w-full bg-[#1C4A1C] hover:bg-[#2C602C]"
                        onClick={() => setStep(2)}
                      >
                        Confirm {format(selectedTime, 'h:mm a')} on {format(selectedDate, 'EEEE, MMMM d')}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Step 2: Enter Details */}
            {step === 2 && (
              <div className="w-full space-y-6">
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">{bookingData.meetingType.name}</span> with {bookingData.user.name || bookingData.user.username}
                  </p>
                  <p className="text-gray-700 flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedDate!, 'EEEE, MMMM d')} • {format(selectedTime!, 'h:mm a')} - {format(addMinutes(selectedTime!, bookingData.meetingType.duration), 'h:mm a')} ({userTimezone})
                  </p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Anything you'd like to share before the meeting..."
                      {...register("notes")}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#1C4A1C] hover:bg-[#2C602C]"
                      disabled={!isValid || scheduleMeetingMutation.isPending}
                    >
                      {scheduleMeetingMutation.isPending ? "Scheduling..." : "Schedule Meeting"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="w-full text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Meeting Scheduled!</h3>
                <p className="text-gray-600 mb-6">
                  You've successfully scheduled a {bookingData.meetingType.duration}-minute meeting with {bookingData.user.name || bookingData.user.username}.
                  A confirmation email has been sent to your inbox.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-8 inline-block mx-auto">
                  <p className="text-gray-700 mb-1 font-medium">{bookingData.meetingType.name}</p>
                  <p className="text-gray-700 flex items-center justify-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {selectedDate && selectedTime ? 
                      `${format(selectedDate, 'EEEE, MMMM d')} • ${format(selectedTime, 'h:mm a')} - ${format(addMinutes(selectedTime, bookingData.meetingType.duration), 'h:mm a')} (${userTimezone})` 
                      : "Date and time information"
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/"}
                >
                  Return to Homepage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
