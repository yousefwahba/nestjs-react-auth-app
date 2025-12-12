export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please provide a valid email address';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  if (name.length < 3) {
    return 'Name must be at least 3 characters long';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[\W_]/.test(password);
  
  if (!hasLetter || !hasNumber || !hasSpecial) {
    return 'Password must contain at least one letter, one number, and one special character';
  }
  return null;
};

export const validateLoginForm = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return errors;
};

export const validateSignupForm = (
  email: string,
  name: string,
  password: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }
  
  const nameError = validateName(name);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }
  
  return errors;
};
