'use client';

/**
 * New Customer Page
 * 
 * Create a new customer.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { CustomerForm } from '@/components/customers';
import { CustomerFormData } from '@/types';
import styles from './page.module.css';

export default function NewCustomerPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { addCustomer } = useData();
    const { success } = useToast();

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = (data: CustomerFormData) => {
        addCustomer(data);
        success('Customer created', `${data.name} has been added to your customers.`);
        router.push('/customers');
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <MainLayout title="New Customer">
            <div className={styles.page}>
                {/* Back Button */}
                <button className={styles.backButton} onClick={() => router.push('/customers')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Customers
                </button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomerForm
                            onSubmit={handleSubmit}
                            onCancel={() => router.push('/customers')}
                        />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
