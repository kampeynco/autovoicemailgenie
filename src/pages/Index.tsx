import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Calendar, BarChart3, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

const Index = () => {
  return <div className="min-h-screen bg-white">
      <header className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-[#004838]">Callback Engine</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth/signin">
              <Button variant="ghost" className="text-[#004838] hover:text-[#004838]/90 hover:bg-[#EBEDE8]">
                Log in
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="bg-[#004838] text-white hover:bg-[#004838]/90">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#073127] sm:text-5xl md:text-6xl">
            Skip Call Time,<br/>
            <span className="text-[#004838]"> Get Same Results</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-[#333F3C]">
            Schedule recurring voicemail campaigns for political fundraising. Reach more donors with less effort.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-[#004838] text-white hover:bg-[#004838]/90 hover-scale">
                Skip Call Time Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-[#004838] text-[#004838] hover:bg-[#EBEDE8]">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="py-16 bg-[#EBEDE8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center text-[#073127] mb-12">
              Features designed for political fundraising campaigns
            </h2>
            <FeaturesSectionWithHoverEffects />
          </div>
        </div>

        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-semibold text-[#073127] mb-6">
                  Why Choose Daily Voicemail Drops?
                </h2>
                <div className="space-y-4">
                  {["Higher response rates than emails or texts", "Personal connection with potential donors", "Set-and-forget system saves campaign staff time", "Proven ROI for political fundraising efforts"].map((point, index) => <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-[#004838] mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-[#333F3C]">{point}</p>
                    </div>)}
                </div>
                <div className="mt-8">
                  <Link to="/signup">
                    <Button className="bg-[#004838] text-white hover:bg-[#004838]/90">
                      Get Started Today
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-[#EBEDE8] p-8 rounded-lg">
                  <h3 className="text-xl font-medium text-[#073127] mb-4">How It Works</h3>
                  <ol className="space-y-4 list-decimal list-inside text-[#333F3C]">
                    <li>Upload your donor contact list or connect your CRM</li>
                    <li>Record or upload your fundraising message</li>
                    <li>Set your daily delivery schedule and rules</li>
                    <li>Our system automatically delivers your voicemails</li>
                    <li>Track results and optimize your fundraising campaigns</li>
                  </ol>
                  <p className="mt-4 text-sm text-[#333F3C]">
                    Built on reliable DropCowboy API for industry-leading deliverability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#004838] py-16 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold mb-8">Ready to boost your fundraising efforts?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get started with Callback Engine today and experience the power of automated voicemail drops for political campaigns.
            </p>
            <Link to="/auth/signup">
              <Button className="bg-[#E2FB6C] text-[#004838] hover:bg-[#E2FB6C]/90 hover-scale">
                Skip Call Time Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#073127] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Callback Engine</h3>
              <p className="text-sm text-gray-300">Automated daily voicemail drops for political fundraising teams.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>TCPA Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-300">
            <p>© 2024 Callback Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
