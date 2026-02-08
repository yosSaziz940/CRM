'use client';

/**
 * Application Providers
 * 
 * Wraps the application with all necessary context providers.
 */

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <DataProvider>
                <ToastProvider>
                    {children}
                    <ToastContainer />
                </ToastProvider>
            </DataProvider>
        </AuthProvider>
    );
}
