import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function ExplainerVideo() {
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Video placeholder - in a real app, this would be replaced with an actual video player
  const handlePlayVideo = () => {
    setIsPlaying(true);
  };
  
  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">See Schedly in Action</h2>
        
        <p className="text-center text-lg md:text-xl mb-10 max-w-3xl mx-auto text-foreground/80">
          Watch how Schedly simplifies scheduling across time zones and eliminates the back-and-forth
        </p>
        
        <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
          {/* Video placeholder with play overlay */}
          {!isPlaying ? (
            <div className="relative aspect-video bg-primary/10 flex items-center justify-center overflow-hidden">
              {/* Video thumbnail image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="bg-white/95 rounded-full w-20 h-20 flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform duration-300 hover:bg-white" onClick={handlePlayVideo}>
                  <Play className="h-8 w-8 text-primary ml-1" />
                </div>
              </div>
              
              {/* Video title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-4">
                <h3 className="text-xl font-semibold">Smart Scheduling in Any Time Zone</h3>
                <p className="text-sm text-white/70">Learn the basics of Schedly in under 2 minutes</p>
              </div>
              
              {/* Video preview image */}
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          ) : (
            // Placeholder for actual video player - in real implementation would be an iframe or video component
            <div className="aspect-video bg-black flex items-center justify-center text-white">
              <p className="text-center">Video is playing...</p>
              <p className="text-sm text-white/60">(This is a placeholder - actual video would play here)</p>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            className="bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            onClick={handlePlayVideo}
          >
            Start Scheduling Smarter <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}