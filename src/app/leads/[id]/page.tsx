'use client';

/**
 * Lead Detail Page
 * 
 * Shows lead details.
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
    Modal,
} from '@/components/ui';
import { ActivityTimeline, ActivityForm } from '@/components/activities';
import { LeadForm } from '@/components/leads';
import { useData } from '@/contexts/DataContext';
import { LEAD_STATUS_LABELS, LEAD_PRIORITY_LABELS, LeadStatus, LeadPriority, Activity, ActivityFormData } from '@/types';
import { formatDate, formatCurrency } from '@/lib/formatters';
import styles from './page.module.css';

export default function LeadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const { leads: allLeads, customers: allCustomers, activities: allActivities, updateLead, addActivity } = useData();

    // UI State
    const [isEditing, setIsEditing] = React.useState(false);
    const [isActivityModalOpen, setIsActivityModalOpen] = React.useState(false);

    const leadId = params.id as string;

    // Find lead
    const lead = useMemo(() => {
        return allLeads.find((l) => l.id === leadId);
    }, [leadId, allLeads]);

    // Find customer for this lead
    const customer = useMemo(() => {
        if (!lead) return null;
        return allCustomers.find(c => c.id === lead.customerId);
    }, [lead, allCustomers]);

    // Filter activities for this lead
    const leadActivities = useMemo(() => {
        return allActivities
            .filter((a) => a.relatedTo.type === 'lead' && a.relatedTo.id === leadId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }, [leadId, allActivities]);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleEditSubmit = (data: any) => {
        updateLead(leadId, data);
        setIsEditing(false);
    };

    const handleLogActivity = (data: ActivityFormData) => {
        addActivity({
            ...data,
            relatedTo: {
                ...data.relatedTo,
                name: lead?.title || 'Unknown Lead',
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

    if (!lead) {
        return (
            <MainLayout title="Lead Not Found">
                <Card>
                    <CardContent>
                        <p>The lead you&apos;re looking for doesn&apos;t exist.</p>
                        <Button variant="primary" onClick={() => router.push('/leads')}>
                            Back to Pipeline
                        </Button>
                    </CardContent>
                </Card>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Lead Details">
            <div className={styles.page}>
                {/* Back Button */}
                <button className={styles.backButton} onClick={() => router.push('/leads')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Pipeline
                </button>

                {/* Header */}
                <Card className={styles.headerCard}>
                    <div className={styles.header}>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.title}>{lead.title}</h1>
                            <div className={styles.badges}>
                                <Badge variant="primary">{LEAD_STATUS_LABELS[lead.status]}</Badge>
                                <Badge variant="default">{LEAD_PRIORITY_LABELS[lead.priority]} Priority</Badge>
                            </div>
                        </div>
                        <div className={styles.headerActions}>
                            <Button variant="secondary" onClick={() => setIsEditing(true)}>
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
                        {/* Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Deal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Value</span>
                                        <span className={styles.infoValue}>{formatCurrency(lead.value, lead.currency)}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Probability</span>
                                        <span className={styles.infoValue}>{lead.probability}%</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Source</span>
                                        <span className={styles.infoValue}>{lead.source}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Expected Close</span>
                                        <span className={styles.infoValue}>
                                            {lead.expectedCloseDate ? formatDate(lead.expectedCloseDate) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Customer</span>
                                        {customer ? (
                                            <button
                                                className={styles.customerLink}
                                                onClick={() => router.push(`/customers/${customer.id}`)}
                                            >
                                                {customer.name} ({customer.company})
                                            </button>
                                        ) : (
                                            <span className={styles.infoValue}>Unknown Customer</span>
                                        )}
                                    </div>
                                    {lead.tags && lead.tags.length > 0 && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Tags</span>
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                {lead.tags.map(tag => (
                                                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {lead.description && (
                                    <div className={styles.description}>
                                        <span className={styles.infoLabel}>Description</span>
                                        <p>{lead.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {leadActivities.length > 0 ? (
                                    <ActivityTimeline activities={leadActivities} showRelatedTo={false} />
                                ) : (
                                    <p className={styles.emptyActivity}>No activities recorded for this lead.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Lead"
                size="lg"
            >
                <LeadForm
                    initialData={lead}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </Modal>

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
                            type: 'lead',
                            id: leadId,
                        }
                    }}
                    onSubmit={handleLogActivity}
                    onCancel={() => setIsActivityModalOpen(false)}
                />
            </Modal>
        </MainLayout>
    );
}
