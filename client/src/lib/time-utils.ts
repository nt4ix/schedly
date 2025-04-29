import { addMinutes, format, parse, isWithinInterval, addDays, setHours, setMinutes, isBefore, isAfter } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { type Availability } from '@shared/schema';

// Convert time string (HH:MM) to minutes since midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes since midnight to time string (HH:MM)
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Convert time from one timezone to another
export function convertTimeZone(date: Date, fromTimeZone: string, toTimeZone: string): Date {
  // Using the new toZonedTime function
  return toZonedTime(date, toTimeZone);
}

// Format a date for display with timezone consideration
export function formatDateInTimeZone(date: Date, formatStr: string, timeZone: string): string {
  // Using formatInTimeZone which combines toZonedTime and format
  return formatInTimeZone(date, timeZone, formatStr);
}

// Parse a time string to a Date object
export function parseTimeString(timeStr: string, referenceDate: Date): Date {
  const [time, period] = timeStr.split(' ');
  const [hourStr, minuteStr] = time.split(':');
  
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return setMinutes(setHours(referenceDate, hour), minute);
}

// Get availability slots based on user's set availability and booked meetings
export function getAvailableTimeSlots(
  date: Date,
  userAvailability: Availability[],
  bookedMeetings: Array<{ startTime: Date; endTime: Date }>,
  duration: number = 30,
  timezone: string = 'UTC'
): Date[] {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Find availability for this day of week
  const dayAvailability = userAvailability.find(a => a.dayOfWeek === dayOfWeek);
  if (!dayAvailability) return [];
  
  // Convert availability times to Date objects on the selected date
  const startMinutes = timeToMinutes(dayAvailability.startTime);
  const endMinutes = timeToMinutes(dayAvailability.endTime);
  
  // Generate all possible time slots based on availability
  const slots: Date[] = [];
  for (let minute = startMinutes; minute <= endMinutes - duration; minute += duration) {
    const timeStr = minutesToTime(minute);
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create a date object for this slot
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    
    // Convert to the requested timezone
    const zonedSlotDate = toZonedTime(slotDate, timezone);
    
    // Check if this slot overlaps with any booked meetings
    const isBooked = bookedMeetings.some(meeting => {
      const slotEnd = addMinutes(zonedSlotDate, duration);
      return (
        // Meeting starts during the slot
        isWithinInterval(meeting.startTime, {
          start: zonedSlotDate,
          end: slotEnd
        }) ||
        // Meeting ends during the slot
        isWithinInterval(meeting.endTime, {
          start: zonedSlotDate,
          end: slotEnd
        }) ||
        // Meeting completely overlaps the slot
        (isBefore(meeting.startTime, zonedSlotDate) && 
         isAfter(meeting.endTime, slotEnd))
      );
    });
    
    if (!isBooked) {
      slots.push(zonedSlotDate);
    }
  }
  
  return slots;
}

// Generate dates for a calendar view (month)
export function generateCalendarDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from the first day of the week containing the first day of the month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Go up to the last day of the week containing the last day of the month
  const endDate = new Date(lastDay);
  const daysToAdd = 6 - endDate.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);
  
  // Generate all dates in the range
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}
