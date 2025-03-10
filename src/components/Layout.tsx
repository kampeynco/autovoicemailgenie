
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Settings, 
  BarChart3, 
  Plus 
} from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Campaigns", href: "/campaigns", icon: Plus },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname === "/" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="px-4">
                <Link to="/dashboard" className="flex items-center">
                  <h1 className="text-xl font-bold text-primary">DailyVoiceGenie</h1>
                </Link>
              </div>
              <nav className="flex-1 px-2 mt-8 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                        location.pathname === item.href
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-7xl mx-auto fade-in">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
