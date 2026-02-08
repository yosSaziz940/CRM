'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Avatar } from '@/components/ui/Avatar';
import styles from './page.module.css';

export default function ProfilePage() {
    const { user } = useAuth();
    const { success } = useToast();
    const [isActionPending, setIsActionPending] = useState(false);

    const handleAction = async (action: string) => {
        setIsActionPending(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsActionPending(false);
        success('Success', `${action} has been initiated.`);
    };

    return (
        <MainLayout title="My Profile">
            <div className={styles.container}>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={styles.profileHeader}>
                            <Avatar name={user?.name || ''} size="lg" />
                            <div className={styles.profileInfo}>
                                <h2 className={styles.name}>{user?.name}</h2>
                                <p className={styles.email}>{user?.email}</p>
                                <span className={styles.roleBadge}>{user?.role}</span>
                            </div>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Account Created</span>
                                <span className={styles.value}>{user?.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Last Login</span>
                                <span className={styles.value}>{user?.lastLoginAt?.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                onClick={() => handleAction('Profile editing')}
                                isLoading={isActionPending}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => handleAction('Password reset')}
                                isLoading={isActionPending}
                            >
                                Change Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
