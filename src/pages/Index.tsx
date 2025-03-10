
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Calendar, BarChart3, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">DailyVoiceGenie</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Automated Daily
            <span className="text-primary"> Voicemail Drops</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-500">
            Schedule recurring voicemail campaigns that deliver automatically. Reach more customers with less effort.
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button size="lg" className="hover-scale">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>

        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Phone,
                  title: "Automated Drops",
                  description: "Set up once, deliver daily",
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description: "Perfect timing, every time",
                },
                {
                  icon: BarChart3,
                  title: "Detailed Analytics",
                  description: "Track your success rates",
                },
                {
                  icon: Zap,
                  title: "High Deliverability",
                  description: "Reliable message delivery",
                },
              ].map((feature) => (
                <div key={feature.title} className="relative p-6 bg-gray-50 rounded-2xl hover-scale">
                  <div className="absolute top-6 left-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
