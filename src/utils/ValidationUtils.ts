
/**
 * Email validation utility function
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation utility function
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Committee validation utility functions
 */
export const validateCommitteeType = (committeeType: string): boolean => {
  return !!committeeType;
};

export const validateOrganization = (committeeType: string, organizationName: string): boolean => {
  return committeeType !== "organization" || !!organizationName;
};

export const validateCandidate = (
  committeeType: string, 
  firstName: string, 
  lastName: string
): boolean => {
  return committeeType !== "candidate" || (!!firstName && !!lastName);
};
