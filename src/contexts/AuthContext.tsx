'use client';

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles login, logout, and permission checking.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, ROLE_PERMISSIONS } from '@/types';
import { mockUsers, demoCredentials } from '@/data';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Restore dates
                parsedUser.createdAt = new Date(parsedUser.createdAt);
                if (parsedUser.lastLoginAt) {
                    parsedUser.lastLoginAt = new Date(parsedUser.lastLoginAt);
                }
                setUser(parsedUser);
            } catch {
                localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            }
        }
        setIsLoading(false);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Find matching credentials
            const credential = demoCredentials.find(
                cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
            );

            if (!credential) {
                setIsLoading(false);
                return { success: false, error: 'Invalid email or password' };
            }

            // Find the user
            const foundUser = mockUsers.find(u => u.id === credential.userId);
            if (!foundUser) {
                setIsLoading(false);
                return { success: false, error: 'User not found' };
            }

            // Update last login time
            const authenticatedUser: User = {
                ...foundUser,
                lastLoginAt: new Date(),
            };

            // Store in localStorage
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authenticatedUser));

            setUser(authenticatedUser);
            setIsLoading(false);
            return { success: true };
        } catch {
            setIsLoading(false);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        // Mock success
        return { success: true };
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        // Mock success
        return { success: true };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        setUser(null);
    }, []);

    const hasPermission = useCallback((permission: string) => {
        if (!user) return false;
        const permissions = ROLE_PERMISSIONS[user.role];
        return permissions.includes(permission);
    }, [user]);

    const hasRole = useCallback((role: UserRole | UserRole[]) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        return user.role === role;
    }, [user]);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        resetPassword,
        logout,
        hasPermission,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access authentication context
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * Higher-order component for protected routes
 */
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    requiredPermission?: string
) {
    return function WithAuthComponent(props: P) {
        const { isAuthenticated, isLoading, hasPermission } = useAuth();

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (!isAuthenticated) {
            return null;
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
            return <div>Access denied</div>;
        }

        return <WrappedComponent {...props} />;
    };
}
