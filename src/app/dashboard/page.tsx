'use client';

/**
 * Dashboard Page
 * 
 * Main dashboard with KPIs, pipeline overview, and recent activity.
 */

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Skeleton } from '@/components/ui';
import { KPICard, PipelineChart, RecentActivity } from '@/components/dashboard';
import { useData } from '@/contexts/DataContext';
import { LeadStatus } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import styles from './page.module.css';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuth();

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const { leads: allLeads, customers: allCustomers, activities: allActivities } = useData();

    // Filter data based on role
    const filteredLeads = useMemo(() => {
        if (user?.role === 'sales') {
            return allLeads.filter(l => l.id.includes('1') || l.id.includes('3'));
        }
        return allLeads;
    }, [user, allLeads]);

    const filteredCustomers = useMemo(() => {
        if (user?.role === 'sales') {
            return allCustomers.filter(c => c.id.includes('1') || c.id.includes('3'));
        }
        return allCustomers;
    }, [user, allCustomers]);

    // Calculate KPI data
    const kpiData = useMemo(() => {
        const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;
        const activeLeads = filteredLeads.filter(l => !['won', 'lost'].includes(l.status)).length;
        const wonDeals = filteredLeads.filter(l => l.status === 'won');
        const wonValue = wonDeals.reduce((sum: number, l: any) => sum + l.value, 0);
        const pipelineValue = filteredLeads
            .filter(l => !['won', 'lost'].includes(l.status))
            .reduce((sum: number, l: any) => sum + l.value, 0);

        return {
            totalCustomers: filteredCustomers.length,
            activeCustomers,
            activeLeads,
            wonDeals: wonDeals.length,
            wonValue,
            pipelineValue,
        };
    }, [filteredLeads, filteredCustomers]);

    // Calculate pipeline data
    const pipelineData = useMemo(() => {
        const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won'];
        return statuses.map(status => {
            const leadsForStatus = filteredLeads.filter(l => l.status === status);
            return {
                status,
                count: leadsForStatus.length,
                value: leadsForStatus.reduce((sum: number, l: any) => sum + l.value, 0),
            };
        });
    }, [filteredLeads]);

    // Sort activities by date
    const recentActivities = useMemo(() => {
        const activities = user?.role === 'sales'
            ? allActivities.filter(a => a.id.includes('1') || a.id.includes('3'))
            : allActivities;

        return [...activities].sort(
            (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        );
    }, [user, allActivities]);

    if (isLoading || !isAuthenticated) {
        return (
            <MainLayout title="Dashboard">
                <div className={styles.page}>
                    {/* Welcome Skeleton */}
                    <div className={styles.welcome}>
                        <div>
                            <Skeleton height={32} width={200} className="mb-2" />
                            <Skeleton height={20} width={300} />
                        </div>
                        <div className={styles.welcomeActions}>
                            <Skeleton height={40} width={120} />
                            <Skeleton height={40} width={140} />
                        </div>
                    </div>

                    {/* KPI Skeleton */}
                    <div className={styles.kpiGrid}>
                        {[1, 2, 3, 4].map(i => (
                            <Card key={i}><div style={{ padding: '1.5rem' }}><Skeleton height={80} /></div></Card>
                        ))}
                    </div>

                    {/* Content Skeleton */}
                    <div className={styles.contentGrid}>
                        <Card className={styles.pipelineCard}>
                            <CardHeader><Skeleton height={24} width={150} /></CardHeader>
                            <CardContent>
                                <Skeleton height={60} width={200} style={{ marginBottom: '2rem' }} />
                                <Skeleton height={200} />
                            </CardContent>
                        </Card>
                        <Card className={styles.activityCard}>
                            <CardHeader><Skeleton height={24} width={150} /></CardHeader>
                            <CardContent>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <Skeleton variant="circular" width={28} height={28} />
                                        <div style={{ flex: 1 }}>
                                            <Skeleton height={14} width="80%" style={{ marginBottom: '0.5rem' }} />
                                            <Skeleton height={10} width="40%" />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Dashboard">
            <div className={styles.page}>
                {/* Welcome Section */}
                <div className={styles.welcome}>
                    <div>
                        <h2 className={styles.welcomeTitle}>
                            Welcome back, {user?.name?.split(' ')[0]}!
                            {user?.role && <span className={styles.roleBadge}>{user.role}</span>}
                        </h2>
                        <p className={styles.welcomeSubtitle}>Here&apos;s what&apos;s happening with your business today.</p>
                    </div>
                    <div className={styles.welcomeActions}>
                        <Button variant="primary" onClick={() => router.push('/leads/new')}>
                            + New Lead
                        </Button>
                        <Button variant="secondary" onClick={() => router.push('/customers/new')}>
                            + New Customer
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className={styles.kpiGrid}>
                    <KPICard
                        title="Total Customers"
                        value={kpiData.totalCustomers}
                        change={{ value: 12, label: 'vs last month' }}
                        color="primary"
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        }
                    />
                    <KPICard
                        title="Active Leads"
                        value={kpiData.activeLeads}
                        change={{ value: 8, label: 'vs last month' }}
                        color="warning"
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        }
                    />
                    <KPICard
                        title="Won Deals"
                        value={kpiData.wonDeals}
                        change={{ value: 25, label: 'vs last month' }}
                        color="success"
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        }
                    />
                    <KPICard
                        title="Revenue (Won)"
                        value={formatCurrency(kpiData.wonValue)}
                        change={{ value: 18, label: 'vs last month' }}
                        color="success"
                        icon={
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        }
                    />
                </div>

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Pipeline Overview */}
                    <Card className={styles.pipelineCard}>
                        <CardHeader
                            action={
                                <Button variant="ghost" size="sm" onClick={() => router.push('/leads')}>
                                    View all
                                </Button>
                            }
                        >
                            <CardTitle>Pipeline Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={styles.pipelineValue}>
                                <span className={styles.pipelineValueLabel}>Total Pipeline Value</span>
                                <span className={styles.pipelineValueAmount}>
                                    {formatCurrency(kpiData.pipelineValue)}
                                </span>
                            </div>
                            <PipelineChart data={pipelineData} />
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className={styles.activityCard}>
                        <CardHeader
                            action={
                                <Button variant="ghost" size="sm" onClick={() => router.push('/activities')}>
                                    View all
                                </Button>
                            }
                        >
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity activities={recentActivities} maxItems={6} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
