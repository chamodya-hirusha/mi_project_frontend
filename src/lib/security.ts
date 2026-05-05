/**
 * Security utilities for TradeHub.lk
 * Implements input sanitization, rate limiting, and security best practices
 */

// XSS Protection - Sanitize HTML input
export const sanitizeHtml = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

// Sanitize user input for display
export const sanitizeInput = (input: string): string => {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone number validation (Sri Lankan format)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password strength validation
export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Simple password hashing (for demo - use proper hashing in production)
export const hashPassword = (password: string): string => {
    // This is a simple hash for demonstration
    // In production, use bcrypt or similar on the backend
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

// Rate limiting for login attempts
class RateLimiter {
    private attempts: Map<string, { count: number; timestamp: number }>;
    private readonly maxAttempts: number;
    private readonly windowMs: number;

    constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        this.attempts = new Map();
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    check(identifier: string): { allowed: boolean; remainingAttempts: number } {
        const now = Date.now();
        const record = this.attempts.get(identifier);

        if (!record) {
            this.attempts.set(identifier, { count: 1, timestamp: now });
            return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
        }

        if (now - record.timestamp > this.windowMs) {
            this.attempts.set(identifier, { count: 1, timestamp: now });
            return { allowed: true, remainingAttempts: this.maxAttempts - 1 };
        }

        if (record.count >= this.maxAttempts) {
            return { allowed: false, remainingAttempts: 0 };
        }

        record.count++;
        return { allowed: true, remainingAttempts: this.maxAttempts - record.count };
    }

    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// CSRF Token generation (for future API integration)
export const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Content Security Policy headers (for future use)
export const getCSPHeaders = () => ({
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self'",
    ].join('; '),
});

// Validate file upload
export const validateImageUpload = (file: File): {
    isValid: boolean;
    error?: string;
} => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Invalid file type. Please upload JPG, PNG, GIF, or WebP images only.'
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'File size exceeds 10MB limit.'
        };
    }

    return { isValid: true };
};

// Sanitize URL parameters
export const sanitizeUrlParam = (param: string): string => {
    return param.replace(/[^a-zA-Z0-9-_]/g, '');
};

// Check for suspicious patterns
export const checkSuspiciousContent = (content: string): boolean => {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /onerror=/i,
        /onclick=/i,
        /onload=/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(content));
};
