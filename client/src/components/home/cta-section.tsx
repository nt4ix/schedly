import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1C4A1C] mb-4">
          Ready to Schedule Without the Stress?
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Thousands have upgraded their scheduling — now it’s your turn..
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button className="bg-[#1C4A1C] text-white font-bold px-8 py-4 rounded-md text-center hover:bg-[#2C602C] transition-colors w-full sm:w-auto">
              Start Your Free Trial
            </Button>
          </Link>
          <Link href="#contact">
            <Button variant="outline" className="bg-white text-[#1C4A1C] font-semibold px-8 py-4 rounded-md text-center border border-[#1C4A1C] hover:bg-gray-100 transition-colors w-full sm:w-auto">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
