
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight, Settings, History, Inbox, Home, Voicemail, HelpCircle, ArrowUpRight, ChevronLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/signin");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Helper function to check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <div 
        className={`flex flex-col border-r border-gray-200 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header with logo and toggle */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {!collapsed && (
            <h1 className="text-lg font-medium text-gray-800">Campaign Finance</h1>
          )}
          <button 
            onClick={toggleSidebar}
            className={`ml-auto p-1 rounded-full hover:bg-gray-100 ${collapsed ? "mx-auto" : ""}`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        
        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/dashboard') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <Home size={18} />
                  {!collapsed && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/callbacks" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/callbacks') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <Inbox size={18} />
                  {!collapsed && <span className="ml-3">Callbacks</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/voicemail" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/voicemail') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <Voicemail size={18} />
                  {!collapsed && <span className="ml-3">Voice Mail</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/history" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/history') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <History size={18} />
                  {!collapsed && <span className="ml-3">History</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/settings') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <Settings size={18} />
                  {!collapsed && <span className="ml-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Footer section with upgrade, feedback, FAQ */}
        <div className="border-t border-gray-200 py-4">
          <nav className="px-2">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/upgrade" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/upgrade') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <ArrowUpRight size={18} />
                  {!collapsed && <span className="ml-3">Upgrade</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/feedback') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <ChevronRight size={18} />
                  {!collapsed && <span className="ml-3">Feedback</span>}
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    isActive('/faq') ? 'bg-gray-100 text-[#004838]' : 'text-gray-700'
                  }`}
                >
                  <HelpCircle size={18} />
                  {!collapsed && <span className="ml-3">FAQ</span>}
                </Link>
              </li>
            </ul>
          </nav>
          
          {user && !collapsed && (
            <div className="px-2 mt-4">
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 text-left"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <h1 className="text-lg font-medium">Campaign Finance</h1>
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
