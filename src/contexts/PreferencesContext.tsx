'use client';

/**
 * Preferences Context
 * 
 * Manages user preferences with localStorage persistence.
 * Handles theme, language, and notification settings.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr';

export interface UserPreferences {
    theme: Theme;
    language: Language;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    pushNotifications: true,
};

interface PreferencesContextType {
    preferences: UserPreferences;
    updatePreferences: (updates: Partial<UserPreferences>) => void;
    resetPreferences: () => void;
    isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

/**
 * Apply theme to document root
 */
function applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    let effectiveTheme = theme;

    if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', effectiveTheme);

    // Apply CSS variables
    if (effectiveTheme === 'dark') {
        root.style.setProperty('--color-background', '#0f172a');
        root.style.setProperty('--color-background-secondary', '#1e293b');
        root.style.setProperty('--color-background-tertiary', '#334155');
        root.style.setProperty('--color-text-primary', '#f1f5f9');
        root.style.setProperty('--color-text-secondary', '#94a3b8');
        root.style.setProperty('--color-text-muted', '#64748b');
        root.style.setProperty('--color-border', '#334155');
        root.style.setProperty('--color-border-light', '#1e293b');
    } else {
        root.style.setProperty('--color-background', '#ffffff');
        root.style.setProperty('--color-background-secondary', '#f8fafc');
        root.style.setProperty('--color-background-tertiary', '#f1f5f9');
        root.style.setProperty('--color-text-primary', '#0f172a');
        root.style.setProperty('--color-text-secondary', '#475569');
        root.style.setProperty('--color-text-muted', '#94a3b8');
        root.style.setProperty('--color-border', '#e2e8f0');
        root.style.setProperty('--color-border-light', '#f1f5f9');
    }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);

    // Load preferences from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
                applyTheme(parsed.theme || DEFAULT_PREFERENCES.theme);
            } catch {
                console.error('Failed to parse stored preferences');
            }
        }
        setIsLoading(false);
    }, []);

    // Listen for system theme changes when using 'system' theme
    useEffect(() => {
        if (preferences.theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [preferences.theme]);

    const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
        setPreferences(prev => {
            const newPrefs = { ...prev, ...updates };
            localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(newPrefs));

            // Apply theme immediately if it changed
            if (updates.theme) {
                applyTheme(updates.theme);
            }

            return newPrefs;
        });
    }, []);

    const resetPreferences = useCallback(() => {
        setPreferences(DEFAULT_PREFERENCES);
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
        applyTheme(DEFAULT_PREFERENCES.theme);
    }, []);

    return (
        <PreferencesContext.Provider value={{
            preferences,
            updatePreferences,
            resetPreferences,
            isLoading,
        }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
}
