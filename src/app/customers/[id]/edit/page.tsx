'use client';

/**
 * Customer Edit Page
 * 
 * Edit an existing customer.
 */

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { CustomerForm } from '@/components/customers';
import { CustomerFormData } from '@/types';
import styles from './page.module.css';

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { customers, updateCustomer } = useData();
    const { success, error } = useToast();

    const customerId = params.id as string;

    // Find the customer to edit
    const customer = useMemo(() => {
        return customers.find((c) => c.id === customerId);
    }, [customerId, customers]);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = (data: CustomerFormData) => {
        if (!customer) {
            error('Error', 'Customer not found');
            return;
        }

        updateCustomer(customerId, data);
        success('Customer updated', `${data.name} has been updated successfully.`);
        router.push(`/customers/${customerId}`);
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!customer) {
        return (
            <MainLayout title="Customer Not Found">
                <Card>
                    <CardContent>
                        <p>The customer you&apos;re looking for doesn&apos;t exist.</p>
                        <Button variant="primary" onClick={() => router.push('/customers')}>
                            Back to Customers
                        </Button>
                    </CardContent>
                </Card>
            </MainLayout>
        );
    }

    // Prepare initial data for the form
    const initialData: Partial<CustomerFormData> = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        position: customer.position,
        status: customer.status,
        source: customer.source,
        tags: customer.tags,
        notes: customer.notes,
    };

    return (
        <MainLayout title="Edit Customer">
            <div className={styles.page}>
                {/* Back Button */}
                <button className={styles.backButton} onClick={() => router.push(`/customers/${customerId}`)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Customer
                </button>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Customer: {customer.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomerForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push(`/customers/${customerId}`)}
                        />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
