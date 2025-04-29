import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users, Link as LinkIcon, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Timezone smart. Always accurate.",
    description: "Our system intelligently tracks time zone differences, providing accurate timing for meetings every time.",
    animate: "slide-up",
    delay: 100
  },
  {
    icon: <LinkIcon className="h-6 w-6" />,
    title: "Share a link, skip the chaos.",
    description: "With just one shared link, Schedly manages scheduling conflicts and availability preferences automatically.",
    animate: "slide-up",
    delay: 200
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Stay aligned. Stay organized.",
    description: "Stay perfectly aligned with your team or clients, keeping all your appointments and meetings organized across multiple platforms.",
    animate: "slide-up",
    delay: 300
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Find a time for everyone.",
    description: "Effortlessly coordinate schedules with Schedly, ensuring that all attendees find a suitable time with minimal effort and no unnecessary emails.",
    animate: "slide-up",
    delay: 400
  }
];

export default function FeaturesPreview() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose Schedly?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
            Smart scheduling that eliminates the frustration of coordinating meetings across time zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.animate} delay-${feature.delay} bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10 hover:border-primary/30 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 ${activeFeature === index ? 'bg-primary text-white pulse' : 'bg-primary/10 text-primary'} rounded-lg flex items-center justify-center mb-5 transition-colors duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/features">
            <Button 
              variant="outline" 
              className="group bg-transparent border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Explore All Features
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
