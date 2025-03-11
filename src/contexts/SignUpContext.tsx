
import React, { createContext, useContext, useState } from "react";

type CommitteeType = "organization" | "candidate";

interface SignUpData {
  // Step 1: Account
  email: string;
  password: string;
  
  // Step 2: Committee
  committeeType: CommitteeType | "";
  organizationName: string;
  candidateFirstName: string;
  candidateMiddleInitial: string;
  candidateLastName: string;
  candidateSuffix: string;
  
  // Step 3: Voicemail
  voicemailPath: string;
}

interface SignUpContextType {
  data: SignUpData;
  updateData: (newData: Partial<SignUpData>) => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetData: () => void;
}

const defaultSignUpData: SignUpData = {
  email: "",
  password: "",
  committeeType: "",
  organizationName: "",
  candidateFirstName: "",
  candidateMiddleInitial: "",
  candidateLastName: "",
  candidateSuffix: "none",
  voicemailPath: "",
};

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const SignUpProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<SignUpData>(defaultSignUpData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (newData: Partial<SignUpData>) => {
    setData(prevData => ({ ...prevData, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.min(Math.max(step, 1), 3));
  };

  const resetData = () => {
    setData(defaultSignUpData);
    setCurrentStep(1);
  };

  return (
    <SignUpContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        resetData,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
};
