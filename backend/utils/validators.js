export function isEmail(value) { return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
export function isName(value, maxLength = 100) { return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength; }
