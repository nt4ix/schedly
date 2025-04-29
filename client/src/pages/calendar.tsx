import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityForm from "@/components/calendar/availability-form";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Availability, CalendarConnection } from "@shared/schema";
import { Calendar, Plus } from "lucide-react";
import { getUserTimezone } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDayOfWeekName } from "@/lib/utils";

export default function CalendarPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();
  const [timezone] = useState(getUserTimezone());
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  // Fetch calendar connections
  const {
    data: calendarConnections,
    isLoading: isConnectionsLoading
  } = useQuery<CalendarConnection[]>({
    queryKey: ["/api/calendar-connections"],
    enabled: !!user,
  });

  // Fetch availability settings
  const {
    data: availabilities,
    isLoading: isAvailabilityLoading
  } = useQuery<Availability[]>({
    queryKey: ["/api/availability"],
    enabled: !!user,
  });

  // Connect calendar mutation
  const connectCalendarMutation = useMutation({
    mutationFn: async (provider: string) => {
      const data = {
        userId: user?.id,
        provider,
        connected: true
      };
      const response = await apiRequest("POST", "/api/calendar-connections", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-connections"] });
      setCalendarOpen(false);
    }
  });

  // Delete calendar connection mutation
  const deleteConnectionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/calendar-connections/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-connections"] });
    }
  });

  // Show loading state
  if (isAuthLoading || isConnectionsLoading || isAvailabilityLoading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
          
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#1C4A1C]">Calendar</h1>
          <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#9ACD32] text-[#1C4A1C] hover:bg-[#D4E157]">
                <Plus className="mr-1 h-4 w-4" />
                Connect Calendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Calendar</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 rounded-lg"
                  onClick={() => connectCalendarMutation.mutate("google")}
                >
                  <svg className="h-6 w-6 mr-3 text-[#DB4437]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  <span className="font-semibold">Google Calendar</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 rounded-lg"
                  onClick={() => connectCalendarMutation.mutate("outlook")}
                >
                  <svg className="h-6 w-6 mr-3 text-[#0072C6]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 0v11.408h11.408V0H0zm12.594 0v11.408H24V0H12.594zM0 12.594V24h11.408V12.594H0zm12.594 0V24H24V12.594H12.594z"/>
                  </svg>
                  <span className="font-semibold">Outlook</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 rounded-lg md:col-span-2"
                  onClick={() => connectCalendarMutation.mutate("apple")}
                >
                  <svg className="h-6 w-6 mr-3 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.0617 17.4634C21.6202 18.5517 21.0451 19.452 20.3364 20.1611C19.3909 21.1342 18.3174 21.6559 17.1183 21.7262C16.3375 21.7789 15.538 21.5681 14.7208 21.094C13.9037 20.6199 13.1667 20.3828 12.5097 20.3828C11.8165 20.3828 11.0619 20.6199 10.2447 21.094C9.4275 21.5681 8.69349 21.7964 8.04258 21.7964C6.90206 21.8315 5.82129 21.2924 4.80021 20.2839C4.05087 19.5395 3.44226 18.5869 2.9744 17.4283C2.47626 16.1815 2.22656 14.982 2.22656 13.8235C2.22656 12.4934 2.56501 11.365 3.23957 10.4385C3.76513 9.71243 4.44905 9.14834 5.29132 8.74626C6.13359 8.34418 7.04559 8.13159 8.0256 8.11403C8.84225 8.11403 9.87631 8.39429 11.138 8.94838C12.3997 9.51027 13.1842 9.78273 13.4916 9.78273C13.7282 9.78273 14.6402 9.45359 16.2414 8.7973C17.7372 8.19308 19.0046 7.94769 20.0555 8.05842C22.1557 8.29601 23.7569 9.24031 24.8466 10.892C23.0058 11.9452 22.0942 13.4194 22.1119 15.314C22.1295 16.769 22.6453 17.9803 23.6586 18.9358C23.1774 19.4722 22.6453 19.9412 22.0617 20.335C22.753 19.3969 23.0235 18.3005 22.8884 17.0888C22.8024 17.2172 22.4551 17.3543 22.0617 17.4634ZM17.1359 0C17.1535 0.1107 17.1711 0.21361 17.1711 0.31651C17.1711 1.56259 16.7358 2.76913 15.8674 3.92613C14.8805 5.24622 13.5956 5.99548 12.1526 5.88475C12.1349 5.76622 12.1261 5.63989 12.1261 5.50577C12.1261 4.30703 12.6177 3.02938 13.4916 1.92203C13.927 1.3601 14.476 0.889844 15.1329 0.511244C15.7886 0.141432 16.4631 -0.0359266 17.1359 0Z" />
                  </svg>
                  <span className="font-semibold">Apple Calendar</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Connected Calendars */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#1C4A1C] mb-4">Connected Calendars</h2>
          
          {calendarConnections && calendarConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {calendarConnections.map((connection) => (
                <Card key={connection.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1C4A1C] text-white flex items-center justify-center mr-4">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{connection.provider}</h3>
                      <p className="text-sm text-gray-500">Connected {new Date(connection.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    onClick={() => deleteConnectionMutation.mutate(connection.id)}
                    disabled={deleteConnectionMutation.isPending}
                  >
                    Disconnect
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center bg-gray-50">
              <p className="text-gray-500 mb-4">No calendars connected yet</p>
              <Button
                className="bg-[#1C4A1C] hover:bg-[#2C602C]"
                onClick={() => setCalendarOpen(true)}
              >
                Connect Your First Calendar
              </Button>
            </Card>
          )}
        </div>

        {/* Availability Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#1C4A1C] mb-4">Availability Settings</h2>
          
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="settings">Weekly Hours</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <Card className="p-6">
                <AvailabilityForm 
                  availabilities={availabilities || []} 
                  timezone={timezone} 
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Your availability (in {timezone})</h3>
                {availabilities && availabilities.length > 0 ? (
                  <div className="space-y-4">
                    {availabilities.map((availability) => (
                      <div key={availability.id} className="flex items-center border-b pb-2">
                        <div className="w-1/3 font-medium">{getDayOfWeekName(availability.dayOfWeek)}</div>
                        <div className="w-2/3">
                          {availability.startTime} - {availability.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No availability set yet. Configure your weekly hours in the settings tab.</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
