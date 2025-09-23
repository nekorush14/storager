import { VALIDATION_PATTERNS, VALIDATION_LIMITS, VALIDATION_MESSAGES } from '../constants/validation';

/**
 * Sanitize and validate color code to prevent XSS attacks
 */
export function sanitizeColorCode(colorCode: string): string | null {
  if (!colorCode || typeof colorCode !== 'string') {
    return null;
  }

  // Remove any whitespace and convert to lowercase
  const cleaned = colorCode.trim().toLowerCase();
  
  // Check if it matches valid hex color pattern
  if (!VALIDATION_PATTERNS.COLOR_CODE.test(cleaned)) {
    return null;
  }

  // Ensure it's properly formatted as 6-digit hex
  if (cleaned.length === 4) {
    // Convert #abc to #aabbcc
    const [, r, g, b] = cleaned;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return cleaned;
}

/**
 * Validate tag name
 */
export function validateTagName(name: string): string | null {
  if (!name || !name.trim()) {
    return VALIDATION_MESSAGES.TAG_NAME_REQUIRED;
  }

  if (name.trim().length > VALIDATION_LIMITS.TAG_NAME_MAX_LENGTH) {
    return VALIDATION_MESSAGES.TAG_NAME_TOO_LONG;
  }

  return null;
}

/**
 * Validate tag description
 */
export function validateTagDescription(description: string): string | null {
  if (description && description.trim().length > VALIDATION_LIMITS.TAG_DESCRIPTION_MAX_LENGTH) {
    return VALIDATION_MESSAGES.TAG_DESCRIPTION_TOO_LONG;
  }

  return null;
}

/**
 * Validate color code
 */
export function validateColorCode(colorCode: string): string | null {
  if (!colorCode) {
    return null; // Color code is optional
  }

  if (!VALIDATION_PATTERNS.COLOR_CODE.test(colorCode)) {
    return VALIDATION_MESSAGES.COLOR_CODE_INVALID;
  }

  return null;
}

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}