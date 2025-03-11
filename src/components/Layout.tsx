
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/signin");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-[#073127] flex-col">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-white">Campaign Finance</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-4">
            <ul className="space-y-2">
              <li>
                <a 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-[#004838]"
                >
                  <span className="ml-2">Dashboard</span>
                </a>
              </li>
              <li>
                <a 
                  href="/campaigns" 
                  className="flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-[#004838]"
                >
                  <span className="ml-2">Campaigns</span>
                </a>
              </li>
              <li>
                <a 
                  href="/reports" 
                  className="flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-[#004838]"
                >
                  <span className="ml-2">Reports</span>
                </a>
              </li>
              <li>
                <a 
                  href="/donors" 
                  className="flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-[#004838]"
                >
                  <span className="ml-2">Donors</span>
                </a>
              </li>
              <li>
                <a 
                  href="/settings" 
                  className="flex items-center px-4 py-2 text-gray-100 rounded-md hover:bg-[#004838]"
                >
                  <span className="ml-2">Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        
        {user && (
          <div className="p-4 border-t border-[#0a4238]">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-white bg-[#004838] rounded-md hover:bg-[#003026] transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <h1 className="text-xl font-semibold">Campaign Finance</h1>
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
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
