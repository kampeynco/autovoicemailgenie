
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Settings, 
  BarChart3, 
  MessageSquareText,
  Calendar,
  Users,
  Bell,
  LifeBuoy,
  HelpCircle
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

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

  const secondaryNavigation = [
    { name: "Help", href: "/help", icon: HelpCircle },
    { name: "Feedback", href: "/feedback", icon: LifeBuoy },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#EBEDE8]">
      {location.pathname === "/" ? (
        children
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
              <div className="px-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-[#004838] flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-semibold">CE</span>
                </div>
                <Link to="/dashboard" className="flex items-center">
                  <h1 className="text-xl font-semibold text-[#073127]">Callback Engine</h1>
                </Link>
              </div>

              {/* Main navigation */}
              <div className="mt-6 px-3">
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                          location.pathname === item.href
                            ? "bg-[#EBEDE8] text-[#004838] font-medium"
                            : "text-gray-600 hover:bg-[#EBEDE8] hover:text-[#004838]"
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5 mr-3",
                          location.pathname === item.href
                            ? "text-[#004838]"
                            : "text-gray-400 group-hover:text-[#004838]"
                        )} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Navigation */}
              <div className="px-3 mt-auto mb-4">
                <div className="pt-4 border-t border-gray-200 space-y-1">
                  {secondaryNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-[#EBEDE8] hover:text-[#004838]"
                      >
                        <Icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#004838]" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* User profile */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center px-2 py-2">
                    <div className="flex-shrink-0">
                      <Avatar className="h-9 w-9 rounded-full bg-[#004838]">
                        <div className="text-xs font-medium text-white">JD</div>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">John Doe</p>
                      <p className="text-xs font-medium text-gray-500">Admin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top header bar */}
            <div className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex-1">
                {/* Empty header left side */}
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-1 text-gray-400 hover:text-[#004838] rounded-full">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="md:hidden">
                  <Avatar className="h-8 w-8 rounded-full bg-[#004838]">
                    <div className="text-xs font-medium text-white">JD</div>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto bg-[#EBEDE8]">
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
