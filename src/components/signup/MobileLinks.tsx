
import React from "react";
import { Link } from "react-router-dom";

const MobileLinks = () => {
  return (
    <>
      {/* Mobile-only logo and header */}
      <div className="block md:hidden text-center">
        <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
          <h1 className="text-2xl font-semibold text-[#004838] mb-6">Callback Engine</h1>
        </Link>
      </div>
      
      {/* Mobile-only "Sign in" link */}
      <div className="mt-6 text-center block md:hidden">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="font-medium text-[#004838] hover:text-[#003026]">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default MobileLinks;
