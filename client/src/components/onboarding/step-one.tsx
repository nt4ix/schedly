import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StepOneProps {
  onConnectCalendar: (provider: string) => void;
  onSkip: () => void;
}

export default function StepOne({ onConnectCalendar, onSkip }: StepOneProps) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Connect Your Calendar</h3>
      <p className="text-neutral-dark mb-6">
        Select the calendar service you want to connect with Schedly. This helps us check your availability and prevent double bookings.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card 
          className="flex items-center cursor-pointer p-4 hover:border-[#9ACD32] transition-colors"
          onClick={() => onConnectCalendar("google")}
        >
          <div className="flex items-center w-full">
            <svg className="h-8 w-8 mr-3 text-[#DB4437]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
            <span className="font-semibold">Connect Google Calendar</span>
          </div>
        </Card>
        
        <Card 
          className="flex items-center cursor-pointer p-4 hover:border-[#9ACD32] transition-colors"
          onClick={() => onConnectCalendar("outlook")}
        >
          <div className="flex items-center w-full">
            <svg className="h-8 w-8 mr-3 text-[#0072C6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 0v11.408h11.408V0H0zm12.594 0v11.408H24V0H12.594zM0 12.594V24h11.408V12.594H0zm12.594 0V24H24V12.594H12.594z"/>
            </svg>
            <span className="font-semibold">Connect Outlook</span>
          </div>
        </Card>
        
        <Card 
          className="flex items-center cursor-pointer p-4 hover:border-[#9ACD32] transition-colors md:col-span-2"
          onClick={() => onConnectCalendar("apple")}
        >
          <div className="flex items-center w-full">
            <svg className="h-8 w-8 mr-3 text-[#000]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.0617 17.4634C21.6202 18.5517 21.0451 19.452 20.3364 20.1611C19.3909 21.1342 18.3174 21.6559 17.1183 21.7262C16.3375 21.7789 15.538 21.5681 14.7208 21.094C13.9037 20.6199 13.1667 20.3828 12.5097 20.3828C11.8165 20.3828 11.0619 20.6199 10.2447 21.094C9.4275 21.5681 8.69349 21.7964 8.04258 21.7964C6.90206 21.8315 5.82129 21.2924 4.80021 20.2839C4.05087 19.5395 3.44226 18.5869 2.9744 17.4283C2.47626 16.1815 2.22656 14.982 2.22656 13.8235C2.22656 12.4934 2.56501 11.365 3.23957 10.4385C3.76513 9.71243 4.44905 9.14834 5.29132 8.74626C6.13359 8.34418 7.04559 8.13159 8.0256 8.11403C8.84225 8.11403 9.87631 8.39429 11.138 8.94838C12.3997 9.51027 13.1842 9.78273 13.4916 9.78273C13.7282 9.78273 14.6402 9.45359 16.2414 8.7973C17.7372 8.19308 19.0046 7.94769 20.0555 8.05842C22.1557 8.29601 23.7569 9.24031 24.8466 10.892C23.0058 11.9452 22.0942 13.4194 22.1119 15.314C22.1295 16.769 22.6453 17.9803 23.6586 18.9358C23.1774 19.4722 22.6453 19.9412 22.0617 20.335C22.753 19.3969 23.0235 18.3005 22.8884 17.0888C22.8024 17.2172 22.4551 17.3543 22.0617 17.4634ZM17.1359 0C17.1535 0.1107 17.1711 0.21361 17.1711 0.31651C17.1711 1.56259 16.7358 2.76913 15.8674 3.92613C14.8805 5.24622 13.5956 5.99548 12.1526 5.88475C12.1349 5.76622 12.1261 5.63989 12.1261 5.50577C12.1261 4.30703 12.6177 3.02938 13.4916 1.92203C13.927 1.3601 14.476 0.889844 15.1329 0.511244C15.7886 0.141432 16.4631 -0.0359266 17.1359 0Z" />
            </svg>
            <span className="font-semibold">Connect Apple Calendar</span>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="outline" className="text-neutral-dark hover:bg-neutral-dark hover:text-white mr-2" onClick={onSkip}>
          Skip for now
        </Button>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">Note:</span> You can always connect your calendar later from the Settings page.
          Connecting a calendar lets Schedly check your availability to prevent double bookings.
        </p>
      </div>
    </div>
  );
}
