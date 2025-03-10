
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Settings, 
  BarChart3, 
  MessageSquareText,
  Calendar,
  Users
} from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Campaigns", href: "/campaigns", icon: MessageSquareText },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#EBEDE8]">
      {location.pathname === "/" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-[#004838] border-r">
              <div className="px-4">
                <Link to="/dashboard" className="flex items-center">
                  <h1 className="text-xl font-semibold text-white">DailyVoiceGenie</h1>
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
                          ? "bg-[#073127] text-[#E2FB6C]"
                          : "text-white hover:bg-[#073127] hover:text-[#E2FB6C]"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 mt-auto mb-4">
                <div className="rounded-md bg-[#073127] p-3 text-white text-xs">
                  <p className="font-medium mb-1">Daily Drop Status</p>
                  <p className="text-[#E2FB6C]">All systems operational</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 bg-[#EBEDE8]">
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
