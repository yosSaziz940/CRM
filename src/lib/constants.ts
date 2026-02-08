/**
 * Application Constants
 */

export const APP_NAME = 'CRM Pro';
export const APP_VERSION = '1.0.0';

/**
 * Navigation items for sidebar
 */
export const NAVIGATION_ITEMS = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
    },
    {
        id: 'customers',
        label: 'Customers',
        href: '/customers',
        icon: 'customers',
    },
    {
        id: 'leads',
        label: 'Leads & Pipeline',
        href: '/leads',
        icon: 'leads',
    },
    {
        id: 'activities',
        label: 'Activities',
        href: '/activities',
        icon: 'activities',
    },
] as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * Date format strings
 */
export const DATE_FORMATS = {
    SHORT: 'MMM d, yyyy',
    LONG: 'MMMM d, yyyy',
    WITH_TIME: 'MMM d, yyyy h:mm a',
    TIME_ONLY: 'h:mm a',
    ISO: 'yyyy-MM-dd',
} as const;

/**
 * Currency configuration
 */
export const CURRENCIES = {
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
} as const;

export const DEFAULT_CURRENCY = 'USD';

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'crm_auth_token',
    USER_DATA: 'crm_user_data',
    THEME: 'crm_theme',
    SIDEBAR_COLLAPSED: 'crm_sidebar_collapsed',
    PREFERENCES: 'crm_preferences',
} as const;
