/**
 * Validation Utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Check if a string is not empty
 */
export function isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
}

/**
 * Check if a value is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Validate a URL
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Form validation helper
 */
export interface ValidationRule {
    validate: (value: unknown) => boolean;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export function validateForm<T extends Record<string, unknown>>(
    data: T,
    rules: Record<keyof T, ValidationRule[]>
): ValidationResult {
    const errors: Record<string, string> = {};

    for (const field in rules) {
        const fieldRules = rules[field];
        const value = data[field];

        for (const rule of fieldRules) {
            if (!rule.validate(value)) {
                errors[field] = rule.message;
                break;
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Common validation rules factory
 */
export const ValidationRules = {
    required: (message = 'This field is required'): ValidationRule => ({
        validate: (value) => {
            if (typeof value === 'string') return value.trim().length > 0;
            return value !== null && value !== undefined;
        },
        message,
    }),

    email: (message = 'Please enter a valid email'): ValidationRule => ({
        validate: (value) => typeof value === 'string' && isValidEmail(value),
        message,
    }),

    phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
        validate: (value) => typeof value === 'string' && isValidPhone(value),
        message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
        validate: (value) => typeof value === 'string' && value.length >= min,
        message: message || `Must be at least ${min} characters`,
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
        validate: (value) => typeof value === 'string' && value.length <= max,
        message: message || `Must be no more than ${max} characters`,
    }),

    min: (min: number, message?: string): ValidationRule => ({
        validate: (value) => typeof value === 'number' && value >= min,
        message: message || `Must be at least ${min}`,
    }),

    max: (max: number, message?: string): ValidationRule => ({
        validate: (value) => typeof value === 'number' && value <= max,
        message: message || `Must be no more than ${max}`,
    }),
};
