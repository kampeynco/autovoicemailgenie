
import React from "react";
import SignUpHeader from "@/components/signup/SignUpHeader";
import SignUpContent from "@/components/signup/SignUpContent";

const SignUp = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left panel with header content */}
      <SignUpHeader />
      
      {/* Right panel with sign up steps */}
      <SignUpContent />
    </div>
  );
};

export default SignUp;
