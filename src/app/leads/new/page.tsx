'use client';

/**
 * New Lead Page
 * 
 * Create a new sales lead.
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { LeadForm } from '@/components/leads';
import { LeadFormData } from '@/types';
import styles from './page.module.css';

export default function NewLeadPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { addLead } = useData();
    const { success } = useToast();

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = (data: LeadFormData) => {
        addLead(data);
        success('Lead created', `${data.title} has been added to the pipeline.`);
        router.push('/leads');
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <MainLayout title="New Lead">
            <div className={styles.page}>
                <button className={styles.backButton} onClick={() => router.push('/leads')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Pipeline
                </button>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Lead</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LeadForm
                            onSubmit={handleSubmit}
                            onCancel={() => router.push('/leads')}
                        />
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
