import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarIcon, ClockIcon, UserIcon, VideoIcon, EditIcon, UsersIcon } from "lucide-react";
import { Meeting } from "@shared/schema";

interface UpcomingMeetingsProps {
  meetings: Meeting[];
  timezone: string;
}

export default function UpcomingMeetings({ meetings, timezone }: UpcomingMeetingsProps) {
  // Sort meetings by start time and filter only upcoming ones
  const now = new Date();
  
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3); // Only show the next 3 meetings
  
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-[#1C4A1C] mb-4">Upcoming Meetings</h2>
      
      {upcomingMeetings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingMeetings.map((meeting) => (
            <Card key={meeting.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{meeting.title}</h3>
                  <MeetingTimeLabel startTime={new Date(meeting.startTime)} />
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>
                    {formatDate(new Date(meeting.startTime), "EEE, MMM d")} • {formatTime(new Date(meeting.startTime))} - {formatTime(new Date(meeting.endTime))}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{timezone}</span>
                </div>
                
                {meeting.location && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <VideoIcon className="h-4 w-4 mr-1" />
                    <span>{meeting.location}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>
                    {Array.isArray(meeting.attendees) && meeting.attendees.length > 0
                      ? `${meeting.attendees.length} attendee${meeting.attendees.length > 1 ? 's' : ''}`
                      : 'No attendees'
                    }
                  </span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex">
                  {meeting.location && meeting.location.toLowerCase().includes('zoom') && (
                    <Button variant="outline" size="sm" className="text-[#1C4A1C] mr-2">
                      <VideoIcon className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <EditIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-base font-medium text-gray-600">No upcoming meetings</CardTitle>
            <p className="text-sm text-gray-500">
              Your scheduled meetings will appear here.
            </p>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

function MeetingTimeLabel({ startTime }: { startTime: Date }) {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  
  const isToday = startTime.toDateString() === now.toDateString();
  const isTomorrow = startTime.toDateString() === tomorrow.toDateString();
  
  let label = formatDate(startTime, "MMM d");
  let className = "bg-gray-100 text-gray-700";
  
  if (isToday) {
    label = "Today";
    className = "bg-[#D4E157] bg-opacity-20 text-[#1C4A1C]";
  } else if (isTomorrow) {
    label = "Tomorrow";
    className = "bg-gray-100 text-[#1C4A1C]";
  }
  
  return (
    <span className={`${className} text-xs px-2 py-1 rounded`}>
      {label}
    </span>
  );
}
