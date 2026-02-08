/**
 * User and Authentication Types
 */

export type UserRole = 'admin' | 'manager' | 'sales';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

/**
 * Role-based permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    admin: [
        'users:read',
        'users:write',
        'users:delete',
        'customers:read',
        'customers:write',
        'customers:delete',
        'leads:read',
        'leads:write',
        'leads:delete',
        'activities:read',
        'activities:write',
        'activities:delete',
        'reports:read',
        'settings:read',
        'settings:write',
    ],
    manager: [
        'customers:read',
        'customers:write',
        'leads:read',
        'leads:write',
        'activities:read',
        'activities:write',
        'reports:read',
        'settings:read',
    ],
    sales: [
        'customers:read',
        'customers:write',
        'leads:read',
        'leads:write',
        'activities:read',
        'activities:write',
    ],
};
