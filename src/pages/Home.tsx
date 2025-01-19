import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart2, Clock } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Announcement Banner */}
      <div className="bg-black text-white py-2 px-4 text-center text-sm">
        <p className="animate-marquee whitespace-nowrap">
          Try risk-free with our guarantee: increase your traffic in 12 weeks or we work for free!
        </p>
      </div>

      {/* Hero Section */}
      <section className="bg-neutral-50 pt-16 pb-24">
        <div className="main-container">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-neutral-600 mb-4">WELCOME TO ELECTRIC AI</p>
            <h1 className="h1 mb-6">
              Effortless Social Media for Estate Agents
            </h1>
            <p className="subtitle mb-8">
              We turn your property listings into stunning posts, captions, and videos
              for Instagram, Facebook, LinkedIn, and X (Twitter) —all automatically.
            </p>
            <div className="flex gap-4">
              <Button className="button-primary" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="section-sm bg-white border-y border-neutral-200">
        <div className="main-container">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-heading font-bold">4.9</div>
              <div className="flex flex-col">
                <div className="text-orange-500">★★★★★</div>
                <div className="text-sm text-neutral-600">Based on 100+ reviews</div>
              </div>
            </div>
            <div className="flex flex-col max-w-md">
              <p className="text-neutral-600 italic">
                "Electric AI has saved me tons of stress and tripled visits to our socials. 
                We're getting more inquiries and I no longer have to check Instagram!"
              </p>
              <div className="mt-2">
                <p className="font-medium">Mark A.</p>
                <p className="text-sm text-neutral-600">Estate Agent, Manchester</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="section bg-white">
        <div className="main-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="h2 mb-4">The Challenges You Face With Social Media</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card feature-card-purple">
              <div className="h-48 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/429468d3-b9fc-4d7e-adea-2fc58114fb96.png" 
                  alt="Stand Out Challenge" 
                  className="w-32"
                />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">It's Hard to Stand Out</h3>
              <p className="text-neutral-600">Most posts look the same in a saturated market.</p>
            </div>
            <div className="feature-card feature-card-green">
              <div className="h-48 flex items-center justify-center">
                <BarChart2 className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">You Get Limited Results</h3>
              <p className="text-neutral-600">Social media feels like more effort than it's worth.</p>
            </div>
            <div className="feature-card feature-card-peach">
              <div className="h-48 flex items-center justify-center">
                <Clock className="w-32 h-32 text-orange-500" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">You Have No Time</h3>
              <p className="text-neutral-600">Managing socials takes hours you don't have. It's a full-time job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-light">
        <div className="main-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-6">
              Book a free 20 minute demo and we'll explain how Electric AI can help your estate agency
            </h2>
            <Button className="button-primary" size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;