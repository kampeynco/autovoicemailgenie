
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
