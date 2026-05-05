/**
 * OTP (One-Time Password) utility functions
 * For mobile number verification
 */

interface OTPRecord {
  otp: string;
  phoneNumber: string;
  expiresAt: number;
  attempts: number;
}

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 3;
const OTP_LENGTH = 6;

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in sessionStorage with expiration
 */
export const storeOTP = (phoneNumber: string, otp: string): void => {
  const record: OTPRecord = {
    otp,
    phoneNumber,
    expiresAt: Date.now() + OTP_EXPIRY_TIME,
    attempts: 0,
  };
  sessionStorage.setItem(`otp_${phoneNumber}`, JSON.stringify(record));
};

/**
 * Get OTP record from sessionStorage
 */
const getOTPRecord = (phoneNumber: string): OTPRecord | null => {
  const stored = sessionStorage.getItem(`otp_${phoneNumber}`);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = (phoneNumber: string, inputOTP: string): {
  isValid: boolean;
  error?: string;
} => {
  const record = getOTPRecord(phoneNumber);

  if (!record) {
    return {
      isValid: false,
      error: "OTP not found. Please request a new OTP.",
    };
  }

  // Check if OTP has expired
  if (Date.now() > record.expiresAt) {
    sessionStorage.removeItem(`otp_${phoneNumber}`);
    return {
      isValid: false,
      error: "OTP has expired. Please request a new OTP.",
    };
  }

  // Check if max attempts exceeded
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    sessionStorage.removeItem(`otp_${phoneNumber}`);
    return {
      isValid: false,
      error: "Maximum verification attempts exceeded. Please request a new OTP.",
    };
  }

  // Increment attempts
  record.attempts++;
  sessionStorage.setItem(`otp_${phoneNumber}`, JSON.stringify(record));

  // Verify OTP
  if (record.otp !== inputOTP) {
    const remainingAttempts = MAX_OTP_ATTEMPTS - record.attempts;
    return {
      isValid: false,
      error: `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.` : 'Please request a new OTP.'}`,
    };
  }

  // OTP is valid - remove it from storage
  sessionStorage.removeItem(`otp_${phoneNumber}`);

  return { isValid: true };
};

/**
 * Send OTP to phone number (mock implementation)
 * In production, this would integrate with an SMS service like Twilio, AWS SNS, etc.
 */
export const sendOTP = async (phoneNumber: string): Promise<{
  success: boolean;
  error?: string;
}> => {
  // Validate phone number
  if (!phoneNumber || phoneNumber.length < 10) {
    return {
      success: false,
      error: "Invalid phone number",
    };
  }

  // Generate OTP
  const otp = generateOTP();

  // Store OTP
  storeOTP(phoneNumber, otp);

  // In a real application, you would send the OTP via SMS here
  // For demo purposes, we'll log it to console and show it in an alert
  console.log(`OTP for ${phoneNumber}: ${otp}`);

  // In development, you might want to show the OTP in a toast/alert
  // For production, remove this and integrate with actual SMS service
  if (process.env.NODE_ENV === 'development') {
    // This will be handled by the component showing a toast
    return {
      success: true,
      // Include OTP in dev mode for testing
      ...(process.env.NODE_ENV === 'development' && { devOTP: otp }),
    } as any;
  }

  return { success: true };
};

/**
 * Check if phone number is verified (has a valid OTP session)
 */
export const isPhoneVerified = (phoneNumber: string): boolean => {
  const record = getOTPRecord(phoneNumber);
  if (!record) return false;
  return Date.now() <= record.expiresAt;
};

/**
 * Clear OTP for a phone number
 */
export const clearOTP = (phoneNumber: string): void => {
  sessionStorage.removeItem(`otp_${phoneNumber}`);
};

/**
 * Get remaining time for OTP expiry (in seconds)
 */
export const getOTPRemainingTime = (phoneNumber: string): number => {
  const record = getOTPRecord(phoneNumber);
  if (!record) return 0;
  const remaining = record.expiresAt - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
};
