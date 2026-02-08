'use client';

/**
 * Activities Page
 * 
 * Main page for viewing and managing activities.
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { MainLayout } from '@/components/layout';
import { Button, Card, Modal, Select } from '@/components/ui';
import { ActivityTimeline, ActivityForm } from '@/components/activities';
import { useData } from '@/contexts/DataContext';
import { Activity, ActivityFormData } from '@/types';
import styles from './page.module.css';

export default function ActivitiesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, user } = useAuth();
    const { activities: allActivities, leads: allLeads, customers: allCustomers, addActivity } = useData();
    const { success } = useToast();

    // Local State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Filter Logic
    const filteredActivities = useMemo(() => {
        return allActivities
            .filter(a => filterType === 'all' || a.type === filterType)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [allActivities, filterType]);

    const handleCreateActivity = (data: ActivityFormData) => {
        let relatedName = 'Unknown';
        if (data.relatedTo.type === 'customer') {
            const customer = allCustomers.find(c => c.id === data.relatedTo.id);
            if (customer) relatedName = customer.name;
        } else if (data.relatedTo.type === 'lead') {
            const lead = allLeads.find(l => l.id === data.relatedTo.id);
            if (lead) relatedName = lead.title;
        }

        addActivity({
            ...data,
            relatedTo: {
                ...data.relatedTo,
                name: relatedName,
            },
            createdBy: user?.id || 'unknown',
            createdByName: user?.name || 'Unknown User',
            isCompleted: false,
        });
        setIsModalOpen(false);
        success('Activity Logged', 'New activity has been added to the timeline.');
    };

    if (authLoading || !isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <MainLayout title="Activities & Tasks">
            <div className={styles.page}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.subtitle}>
                            Track your team's interactions and upcoming tasks.
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                        + Log Activity
                    </Button>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <Select
                        options={[
                            { value: 'all', label: 'All Types' },
                            { value: 'call', label: 'Calls' },
                            { value: 'meeting', label: 'Meetings' },
                            { value: 'email', label: 'Emails' },
                            { value: 'task', label: 'Tasks' },
                        ]}
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    />
                </div>

                {/* Timeline */}
                <Card className={styles.timelineCard}>
                    <ActivityTimeline activities={filteredActivities} />
                </Card>

                {/* Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Log New Activity"
                    size="md"
                >
                    <ActivityForm
                        onSubmit={handleCreateActivity}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </Modal>
            </div>
        </MainLayout>
    );
}
