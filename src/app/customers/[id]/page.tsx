'use client';

/**
 * Customer Detail Page
 * 
 * Shows customer profile with activities and notes.
 */

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout';
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Badge,
    Avatar,
    Modal,
} from '@/components/ui';
import { ActivityTimeline, ActivityForm } from '@/components/activities';
import { useData } from '@/contexts/DataContext';
import { CUSTOMER_STATUS_LABELS, CustomerStatus, Activity, ActivityFormData } from '@/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import styles from './page.module.css';

const STATUS_VARIANT: Record<CustomerStatus, 'success' | 'default' | 'info'> = {
    active: 'success',
    inactive: 'default',
    prospect: 'info',
};

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const { customers: allCustomers, leads: allLeads, activities: allActivities, addActivity } = useData();

    // UI State
    const [isActivityModalOpen, setIsActivityModalOpen] = React.useState(false);

    const customerId = params.id as string;

    // Find customer
    const customer = useMemo(() => {
        return allCustomers.find((c) => c.id === customerId);
    }, [customerId, allCustomers]);

    // Filter activities for this customer
    const customerActivities = useMemo(() => {
        return allActivities
            .filter((a) => a.relatedTo.type === 'customer' && a.relatedTo.id === customerId)
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    }, [customerId, allActivities]);

    // Get customer's leads
    const customerLeads = useMemo(() => {
        return allLeads.filter((l) => l.customerId === customerId);
    }, [customerId, allLeads]);

    const totalLeadValue = customerLeads.reduce((sum, l) => sum + l.value, 0);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogActivity = (data: ActivityFormData) => {
        addActivity({
            ...data,
            relatedTo: {
                ...data.relatedTo,
                name: customer?.name || 'Unknown Customer',
            },
            createdBy: user?.id || 'unknown',
            createdByName: user?.name || 'Unknown User',
            isCompleted: false,
        });
        setIsActivityModalOpen(false);
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

    return (
        <MainLayout title="Customer Details">
            <div className={styles.page}>
                {/* Back Button */}
                <button className={styles.backButton} onClick={() => router.push('/customers')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Customers
                </button>

                {/* Profile Header */}
                <Card className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <Avatar name={customer.name} size="xl" />
                        <div className={styles.profileInfo}>
                            <div className={styles.profileName}>
                                <h2>{customer.name}</h2>
                                <Badge variant={STATUS_VARIANT[customer.status]} dot>
                                    {CUSTOMER_STATUS_LABELS[customer.status]}
                                </Badge>
                            </div>
                            <p className={styles.profilePosition}>
                                {customer.position} at {customer.company}
                            </p>
                        </div>
                        <div className={styles.profileActions}>
                            <Button variant="secondary" onClick={() => router.push(`/customers/${customer.id}/edit`)}>
                                Edit
                            </Button>
                            <Button variant="primary" onClick={() => setIsActivityModalOpen(true)}>
                                + Add Activity
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        {/* Contact Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Email</span>
                                        <a href={`mailto:${customer.email}`} className={styles.infoValue}>
                                            {customer.email}
                                        </a>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Phone</span>
                                        <a href={`tel:${customer.phone}`} className={styles.infoValue}>
                                            {customer.phone}
                                        </a>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Company</span>
                                        <span className={styles.infoValue}>{customer.company}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Source</span>
                                        <span className={styles.infoValue}>{customer.source || 'N/A'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Created</span>
                                        <span className={styles.infoValue}>{formatDate(customer.createdAt)}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Last Updated</span>
                                        <span className={styles.infoValue}>{formatDate(customer.updatedAt)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {customer.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={styles.notes}>{customer.notes}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tags */}
                        {customer.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={styles.tags}>
                                        {customer.tags.map((tag) => (
                                            <Badge key={tag} variant="default">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumn}>
                        {/* Leads Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deals & Leads</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={styles.dealsSummary}>
                                    <div className={styles.dealStat}>
                                        <span className={styles.dealStatValue}>{customerLeads.length}</span>
                                        <span className={styles.dealStatLabel}>Total Leads</span>
                                    </div>
                                    <div className={styles.dealStat}>
                                        <span className={styles.dealStatValue}>{formatCurrency(totalLeadValue)}</span>
                                        <span className={styles.dealStatLabel}>Pipeline Value</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {customerActivities.length > 0 ? (
                                    <ActivityTimeline activities={customerActivities} showRelatedTo={false} />
                                ) : (
                                    <p className={styles.emptyActivity}>No activities recorded yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Activity Modal */}
            <Modal
                isOpen={isActivityModalOpen}
                onClose={() => setIsActivityModalOpen(false)}
                title="Log Activity"
                size="md"
            >
                <ActivityForm
                    initialData={{
                        relatedTo: {
                            type: 'customer',
                            id: customerId,
                        }
                    }}
                    onSubmit={handleLogActivity}
                    onCancel={() => setIsActivityModalOpen(false)}
                />
            </Modal>
        </MainLayout>
    );
}
