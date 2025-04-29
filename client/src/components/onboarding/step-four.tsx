import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { getInitials } from "@/lib/utils";

interface StepFourProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
}

export default function StepFour({ onNext, onPrevious, onComplete }: StepFourProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    timezone: user?.timezone || "UTC",
    profilePicture: user?.profilePicture || ""
  });
  
  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Singapore",
    "Australia/Sydney",
    "Pacific/Auckland"
  ];
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", `/api/users/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      onComplete();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleComplete = () => {
    updateProfileMutation.mutate(profileData);
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Personalize Your Account</h3>
      <p className="text-neutral-dark mb-6">
        Complete your profile to help others recognize you when booking meetings.
      </p>
      
      <div className="space-y-6 mb-8">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileData.profilePicture} alt={profileData.name} />
            <AvatarFallback className="bg-[#1C4A1C] text-white text-lg">
              {getInitials(profileData.name || user?.username || "")}
            </AvatarFallback>
          </Avatar>
          
          <Button variant="outline" size="sm">
            Upload Photo
          </Button>
          <p className="text-xs text-gray-500">
            Recommended: Square image, at least 400x400 pixels
          </p>
        </div>
        
        <div>
          <Label htmlFor="profile-name">Full Name</Label>
          <Input
            id="profile-name"
            value={profileData.name}
            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <Label htmlFor="profile-timezone">Timezone</Label>
          <Select
            value={profileData.timezone}
            onValueChange={(val) => setProfileData({...profileData, timezone: val})}
          >
            <SelectTrigger id="profile-timezone">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Your timezone is used to display meeting times correctly for you and your invitees.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <h4 className="font-medium text-green-800 mb-2">Almost Done!</h4>
          <p className="text-sm text-green-700">
            After completing this step, you'll be taken to your dashboard where you can start creating and sharing your booking links.
          </p>
        </div>
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
          onClick={handleComplete}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? "Saving..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
