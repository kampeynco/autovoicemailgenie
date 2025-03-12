
import React from "react";
import { Link } from "react-router-dom";

const SignUpHeader = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-[#004838] text-white flex-col justify-center px-12">
      <div className="mb-8">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <h1 className="font-semibold text-white text-4xl">Callback Engine</h1>
        </Link>
      </div>
      <h2 className="text-4xl font-bold mb-4">Create an account</h2>
      <p className="text-lg mb-12">
        Join Callback Engine to skip endless fundraising calls and reach more donors with less effort.
      </p>
      <div>
        <p className="text-white/90">
          Already have an account?{" "}
          <Link to="/auth/signin" className="underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpHeader;
