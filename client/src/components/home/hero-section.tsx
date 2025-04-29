import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Clock, Users, Calendar, Globe } from "lucide-react";

export default function HeroSection() {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16">
          {/* Left Section - Text Content */}
          <div className="w-full lg:w-1/2 md:pr-8 slide-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Global Scheduling.
              <span className="relative inline-block ml-3">
                <span className="relative z-10"></span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-white/30 rounded-full -z-0"></span>
              </span>
              <br />
              <span className="text-white">Local Simplicity.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8 slide-right delay-100">
              Smart scheduling made simple — No confusion, no missed meetings, just seamless bookings across the globe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 slide-right delay-200">
              <Link href="/signup">
                <Button size="lg" className="bg-white hover:bg-white/90 text-primary font-bold px-8 py-6 rounded-md text-lg transition-all w-full sm:w-auto hover-lift">
                  Try Schedly for Free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-6 rounded-md text-lg transition-all border-white/40 w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            {/* Feature Badges */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 slide-up delay-300">
              <div className="flex items-center bg-white/15 rounded-full px-3 py-1.5 text-white text-sm">
                <Clock className="h-4 w-4 mr-2 text-white" />
                <span>Timezone Auto-detect</span>
              </div>
              <div className="flex items-center bg-white/15 rounded-full px-3 py-1.5 text-white text-sm">
                <Users className="h-4 w-4 mr-2 text-white" />
                <span>Team Scheduling</span>
              </div>
              <div className="flex items-center bg-white/15 rounded-full px-3 py-1.5 text-white text-sm">
                <Calendar className="h-4 w-4 mr-2 text-white" />
                <span>Calendar Sync</span>
              </div>
              <div className="flex items-center bg-white/15 rounded-full px-3 py-1.5 text-white text-sm">
                <Globe className="h-4 w-4 mr-2 text-white" />
                <span>Global Availability</span>
              </div>
            </div>
          </div>
          
          {/* Right Section - Dashboard Preview */}
          <div className="w-full lg:w-1/2 flex justify-center items-center slide-left delay-300">
            <div className="relative w-full max-w-lg">
              {/* Main Dashboard Animation */}
              <div className="bg-card rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                {/* Dashboard Header */}
                <div className="bg-primary/80 p-4 flex items-center border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-white/40 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-white/40 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-white/40 mr-auto"></div>
                  <div className="text-white font-medium">Schedly Dashboard</div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-gradient-to-b from-card to-card/90 p-5">
                  {/* User Info Card */}
                  <div className="bg-white rounded-lg p-4 mb-4 flex items-start shadow-md">
                    <div className="rounded-full w-12 h-12 bg-primary flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">JD</div>
                    <div>
                      <h3 className="font-bold text-card-foreground">Jane Doe</h3>
                      <p className="text-sm text-card-foreground/70">Marketing Director</p>
                      <div className="flex items-center mt-2 text-xs text-primary font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>PST (UTC-8)</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto text-xs mt-2 text-primary border-primary/50">
                      Copy Link
                    </Button>
                  </div>
                  
                  {/* Calendar Preview */}
                  <div className="bg-white rounded-lg p-3 shadow-md mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-card-foreground">Available Times</h4>
                      <div className="text-xs text-card-foreground/60">May 2023</div>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-xs text-card-foreground/60">{day}</div>
                      ))}
                      
                      {[...Array(31)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`text-center text-xs p-1 rounded-full ${
                            [2, 8, 15, 18, 25].includes(i) 
                              ? 'bg-primary/20 text-primary' 
                              : 'text-card-foreground/80'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Meeting Request */}
                  <div className={`bg-primary/10 border border-primary/30 rounded-lg p-3 transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex items-center">
                      <div className="rounded-full w-8 h-8 bg-card-foreground/10 flex items-center justify-center text-sm mr-3">AJ</div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">Product Demo</p>
                        <p className="text-xs text-card-foreground/70">Alex Johnson requested a meeting</p>
                      </div>
                      <Button size="sm" className="ml-auto bg-primary text-white text-xs">Accept</Button>
                    </div>
                    <div className="mt-2 bg-white rounded p-2 text-xs flex justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-primary" />
                        <span>May 15, 2023</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-primary" />
                        <span>3:00 PM (PST)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 md:-right-12 bg-white p-3 rounded-lg shadow-lg transform rotate-6 bounce-in delay-400 z-10">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  <span className="font-semibold text-sm">Timezone Smart</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 md:-left-12 bg-white p-3 rounded-lg shadow-lg transform -rotate-6 bounce-in delay-500 z-10">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="font-semibold text-sm">Group Scheduling</span>
                </div>
              </div>
              
              {/* Background decorative elements */}
              <div className="absolute -z-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl top-10 -right-20"></div>
              <div className="absolute -z-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl -bottom-20 -left-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
