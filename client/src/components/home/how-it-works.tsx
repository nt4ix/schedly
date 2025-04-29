import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    title: "Connect Your Calendar",
    description: "Link Google Calendar, Outlook, or your favorite calendar service.",
    image: "https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?w=400&h=300&fit=crop"
  },
  {
    number: 2,
    title: "Set Your Availability",
    description: "Define when you're free to meet across your work week.",
    image: "https://images.unsplash.com/photo-1517164850305-99a27ae571ea?w=400&h=300&fit=crop"
  },
  {
    number: 3,
    title: "Share Your Link",
    description: "Send your personal scheduling link to anyone who needs to book time.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-100" id="how-it-works">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1C4A1C] mb-4">
          How Schedly Works
        </h2>
        <p className="text-lg text-card-foreground/80 text-center mb-12 max-w-2xl mx-auto">
        Get started in minutes with our simple setup process.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="w-12 h-12 rounded-full bg-[#1C4A1C] text-white flex items-center justify-center font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-[#1C4A1C] mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              <div className="rounded-lg shadow-md overflow-hidden">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/signup">
            <Button className="bg-primary text-white font-bold px-8 py-6 rounded-md text-lg inline-block hover:bg-primary/90 transition-all hover-lift">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
