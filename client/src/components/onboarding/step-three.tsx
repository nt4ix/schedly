import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { slugify } from "@/lib/utils";

interface StepThreeProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function StepThree({ onNext, onPrevious }: StepThreeProps) {
  const [meetingTypes, setMeetingTypes] = useState([
    {
      name: "30 Minute Meeting",
      duration: 30,
      location: "Zoom",
      description: "A short 30-minute meeting or consultation",
      slug: "30min",
      color: "#1C4A1C"
    }
  ]);
  
  const [currentEdit, setCurrentEdit] = useState({
    name: "",
    duration: 30,
    location: "Zoom",
    description: "",
    slug: "",
    color: "#1C4A1C"
  });
  
  const [isAdding, setIsAdding] = useState(false);
  
  const createMeetingTypeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/meeting-types", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meeting-types"] });
    },
  });
  
  const handleAddMeetingType = () => {
    setIsAdding(true);
    setCurrentEdit({
      name: "",
      duration: 30,
      location: "Zoom",
      description: "",
      slug: "",
      color: "#1C4A1C"
    });
  };
  
  const handleSaveMeetingType = async () => {
    if (!currentEdit.name) return;
    
    // Generate slug if empty
    if (!currentEdit.slug) {
      currentEdit.slug = slugify(currentEdit.name);
    }
    
    // Save to database
    await createMeetingTypeMutation.mutateAsync(currentEdit);
    
    // Update local state
    setMeetingTypes([...meetingTypes, currentEdit]);
    setIsAdding(false);
  };
  
  const handleCancelAdd = () => {
    setIsAdding(false);
  };
  
  const handleUpdateName = (name: string) => {
    setCurrentEdit({
      ...currentEdit,
      name,
      slug: slugify(name)
    });
  };
  
  const saveMeetingPreferences = async () => {
    // Handle case where user hasn't saved yet
    if (isAdding && currentEdit.name) {
      await handleSaveMeetingType();
    }
    onNext();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Meeting Preferences</h3>
      <p className="text-neutral-dark mb-6">
        Create different meeting types that others can book with you. Define the duration, location, and other details.
      </p>
      
      <div className="space-y-4 mb-6">
        {meetingTypes.map((type, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{type.name}</h4>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">{type.duration} minutes</span>
                  <span className="mr-2">•</span>
                  <span>{type.location}</span>
                </div>
                {type.description && (
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                )}
              </div>
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: type.color }}
              ></div>
            </div>
          </Card>
        ))}
        
        {isAdding && (
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <div>
                <Label htmlFor="meeting-name">Meeting Name</Label>
                <Input
                  id="meeting-name"
                  value={currentEdit.name}
                  onChange={(e) => handleUpdateName(e.target.value)}
                  placeholder="e.g., Initial Consultation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meeting-duration">Duration</Label>
                  <Select
                    value={currentEdit.duration.toString()}
                    onValueChange={(val) => setCurrentEdit({...currentEdit, duration: parseInt(val)})}
                  >
                    <SelectTrigger id="meeting-duration">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="meeting-location">Location</Label>
                  <Select
                    value={currentEdit.location}
                    onValueChange={(val) => setCurrentEdit({...currentEdit, location: val})}
                  >
                    <SelectTrigger id="meeting-location">
                      <SelectValue placeholder="Location" />
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
              </div>
              
              <div>
                <Label htmlFor="meeting-description">Description (Optional)</Label>
                <Input
                  id="meeting-description"
                  value={currentEdit.description}
                  onChange={(e) => setCurrentEdit({...currentEdit, description: e.target.value})}
                  placeholder="Briefly describe this meeting type"
                />
              </div>
              
              <div>
                <Label htmlFor="meeting-slug">URL Slug</Label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">schedly.com/username/</span>
                  <Input
                    id="meeting-slug"
                    value={currentEdit.slug}
                    onChange={(e) => setCurrentEdit({...currentEdit, slug: e.target.value})}
                    placeholder="url-slug"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelAdd}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#1C4A1C] hover:bg-[#2C602C]"
                  onClick={handleSaveMeetingType}
                  disabled={!currentEdit.name || createMeetingTypeMutation.isPending}
                >
                  {createMeetingTypeMutation.isPending ? "Saving..." : "Save Meeting Type"}
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {!isAdding && (
          <Button 
            variant="outline" 
            className="w-full py-6 border-dashed"
            onClick={handleAddMeetingType}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Meeting Type
          </Button>
        )}
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
          onClick={saveMeetingPreferences}
          disabled={createMeetingTypeMutation.isPending}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
