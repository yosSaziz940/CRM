'use client';

/**
 * Leads Pipeline Page
 * 
 * Kanban board view of the sales pipeline.
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { MainLayout } from '@/components/layout';
import { Button, Card, Select, Modal, Badge, Skeleton } from '@/components/ui';
import { PipelineBoard, LeadTable } from '@/components/leads';
import { mockLeads } from '@/data';
import { Lead, LeadStatus, LEAD_STATUS_LABELS, LEAD_PRIORITY_LABELS } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import styles from './page.module.css';

export default function LeadsPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();
    const { leads: allLeads, updateLead } = useData();
    const { success } = useToast();

    // Filter leads based on role
    const roleFilteredLeads = useMemo(() => {
        if (user?.role === 'sales') {
            return allLeads.filter(l => l.id.includes('1') || l.id.includes('3'));
        }
        return allLeads;
    }, [user, allLeads]);
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Filter leads
    const filteredLeads = useMemo(() => {
        return roleFilteredLeads.filter(lead => {
            const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
            return matchesPriority;
        });
    }, [roleFilteredLeads, priorityFilter]);

    // Calculate summary
    const summary = useMemo(() => {
        const activeLeads = roleFilteredLeads.filter(l => !['won', 'lost'].includes(l.status));
        const pipelineValue = activeLeads.reduce((sum, l) => sum + l.value, 0);
        const wonValue = roleFilteredLeads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.value, 0);
        return { activeCount: activeLeads.length, pipelineValue, wonValue };
    }, [roleFilteredLeads]);

    const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
        updateLead(leadId, { status: newStatus });
        const lead = roleFilteredLeads.find(l => l.id === leadId);
        if (lead) {
            success('Lead updated', `${lead.title} moved to ${LEAD_STATUS_LABELS[newStatus]}`);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <MainLayout title="Leads & Pipeline">
                <div className={styles.page}>
                    {/* Header Skeleton */}
                    <div className={styles.header}>
                        <div><Skeleton height={24} width={300} /></div>
                        <Skeleton height={40} width={120} />
                    </div>

                    {/* Summary Skeleton */}
                    <div className={styles.summaryGrid}>
                        <Card><div style={{ padding: '1rem' }}><Skeleton height={50} /></div></Card>
                        <Card><div style={{ padding: '1rem' }}><Skeleton height={50} /></div></Card>
                        <Card><div style={{ padding: '1rem' }}><Skeleton height={50} /></div></Card>
                    </div>

                    {/* Filters Skeleton */}
                    <div className={styles.filters}>
                        <Skeleton height={40} width={200} />
                        <Skeleton height={40} width={100} />
                    </div>

                    {/* Board Skeleton */}
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ minWidth: 300, flex: 1 }}>
                                <Skeleton height={40} className={styles.mb4} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <Card><div style={{ padding: '1rem', height: 120 }}><Skeleton height="100%" /></div></Card>
                                    <Card><div style={{ padding: '1rem', height: 120 }}><Skeleton height="100%" /></div></Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Leads & Pipeline">
            <div className={styles.page}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.subtitle}>
                            Manage your sales pipeline and track leads through stages.
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => router.push('/leads/new')}>
                        + New Lead
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <Card padding="sm" className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Active Leads</div>
                        <div className={styles.summaryValue}>{summary.activeCount}</div>
                    </Card>
                    <Card padding="sm" className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Pipeline Value</div>
                        <div className={styles.summaryValue}>{formatCurrency(summary.pipelineValue)}</div>
                    </Card>
                    <Card padding="sm" className={styles.summaryCard}>
                        <div className={styles.summaryLabel}>Won This Period</div>
                        <div className={styles.summaryValue}>{formatCurrency(summary.wonValue)}</div>
                    </Card>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <Select
                        options={[
                            { value: 'all', label: 'All Priorities' },
                            { value: 'high', label: 'High Priority' },
                            { value: 'medium', label: 'Medium Priority' },
                            { value: 'low', label: 'Low Priority' },
                        ]}
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    />

                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'kanban' ? styles.activeView : ''}`}
                            onClick={() => setViewMode('kanban')}
                            title="Kanban View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="18" rx="1" />
                                <rect x="14" y="3" width="7" height="18" rx="1" />
                            </svg>
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="8" y1="6" x2="21" y2="6" />
                                <line x1="8" y1="12" x2="21" y2="12" />
                                <line x1="8" y1="18" x2="21" y2="18" />
                                <line x1="3" y1="6" x2="3.01" y2="6" />
                                <line x1="3" y1="12" x2="3.01" y2="12" />
                                <line x1="3" y1="18" x2="3.01" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Pipeline Board */}
                {viewMode === 'kanban' ? (
                    <PipelineBoard
                        leads={filteredLeads}
                        onLeadClick={(lead) => setSelectedLead(lead)}
                        onStatusChange={handleStatusChange}
                    />
                ) : (
                    <LeadTable
                        leads={filteredLeads}
                        onLeadClick={(lead) => setSelectedLead(lead)}
                    />
                )}
            </div>

            {/* Lead Detail Modal */}
            <Modal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title={selectedLead?.title}
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedLead(null)}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (selectedLead) {
                                    router.push(`/leads/${selectedLead.id}`);
                                }
                            }}
                        >
                            View Details
                        </Button>
                    </>
                }
            >
                {selectedLead && (
                    <div className={styles.leadDetail}>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Customer</span>
                            <span className={styles.leadDetailValue}>{selectedLead.customerName}</span>
                        </div>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Value</span>
                            <span className={styles.leadDetailValue}>{formatCurrency(selectedLead.value)}</span>
                        </div>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Status</span>
                            <Badge variant="primary">{LEAD_STATUS_LABELS[selectedLead.status]}</Badge>
                        </div>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Priority</span>
                            <span className={styles.leadDetailValue}>{LEAD_PRIORITY_LABELS[selectedLead.priority]}</span>
                        </div>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Probability</span>
                            <span className={styles.leadDetailValue}>{selectedLead.probability}%</span>
                        </div>
                        <div className={styles.leadDetailRow}>
                            <span className={styles.leadDetailLabel}>Expected Close</span>
                            <span className={styles.leadDetailValue}>
                                {selectedLead.expectedCloseDate
                                    ? formatDate(selectedLead.expectedCloseDate)
                                    : 'Not set'}
                            </span>
                        </div>
                        {selectedLead.description && (
                            <div className={styles.leadDescription}>
                                <span className={styles.leadDetailLabel}>Description</span>
                                <p>{selectedLead.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </MainLayout>
    );
}
