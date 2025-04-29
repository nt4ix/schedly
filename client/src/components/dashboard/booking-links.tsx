import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, CopyIcon, LinkIcon, ExternalLinkIcon, EditIcon } from "lucide-react";
import { MeetingType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { slugify } from "@/lib/utils";

interface BookingLinksProps {
  meetingTypes: MeetingType[];
  username: string;
}

export default function BookingLinks({ meetingTypes, username }: BookingLinksProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    description: "",
    slug: "",
    color: "#1C4A1C",
    location: "Zoom"
  });

  const createMeetingTypeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/meeting-types", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meeting-types"] });
      setDialogOpen(false);
      toast({
        title: "Link created",
        description: "Your booking link has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error creating your booking link. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Booking link copied to clipboard.",
    });
  };

  const handleCreateLink = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your booking link.",
        variant: "destructive",
      });
      return;
    }

    // Generate slug if not provided
    if (!formData.slug) {
      formData.slug = slugify(formData.name);
    }

    createMeetingTypeMutation.mutate(formData);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name)
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-[#1C4A1C]">Your Booking Links</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-[#1C4A1C] border-[#1C4A1C]">
              <PlusIcon className="h-4 w-4 mr-1" />
              Create New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Booking Link</DialogTitle>
              <DialogDescription>
                Create a new booking link that you can share with others.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meeting Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., 30-Minute Consultation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(val) => setFormData({...formData, duration: parseInt(val)})}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this meeting type"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Link URL</Label>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">{window.location.origin}/{username}/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="your-link-slug"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#1C4A1C] hover:bg-[#2C602C]"
                onClick={handleCreateLink}
                disabled={createMeetingTypeMutation.isPending}
              >
                {createMeetingTypeMutation.isPending ? "Creating..." : "Create Link"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {meetingTypes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {meetingTypes.map((linkType) => (
            <Card key={linkType.id} className="border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: linkType.color || "#1C4A1C" }}
                    ></div>
                    <h3 className="font-semibold">{linkType.name}</h3>
                  </div>
                  <div className="flex text-sm text-gray-500 mt-1">
                    <span className="mr-2">{linkType.duration} min</span>
                    {linkType.location && (
                      <>
                        <span className="mr-2">•</span>
                        <span>{linkType.location}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    {window.location.origin}/{username}/{linkType.slug}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(`/${username}/${linkType.slug}`, '_blank')}
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                    <span className="sr-only">Open link</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyLink(linkType.slug)}
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy link</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                  >
                    <EditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit link</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border border-gray-200 p-6 text-center">
          <div className="mb-4">
            <LinkIcon className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No booking links yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first booking link to share with others.
          </p>
          <Button 
            className="bg-[#1C4A1C] hover:bg-[#2C602C]"
            onClick={() => setDialogOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First Link
          </Button>
        </Card>
      )}
    </div>
  );
}
