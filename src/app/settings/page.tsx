'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Select } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';
import styles from './page.module.css';

export default function SettingsPage() {
    const { success } = useToast();
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        success('Settings saved', 'Your preferences have been updated successfully.');
    };

    const handleReset = () => {
        setTheme('light');
        setLanguage('en');
        setEmailNotif(true);
        setPushNotif(true);
        success('Restored defaults', 'Settings have been reset to original values.');
    };

    return (
        <MainLayout title="Preferences">
            <div className={styles.container}>
                <div className={styles.grid}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Display Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.settingLabel}>Theme</div>
                                    <div className={styles.settingDescription}>Choose how CRM Pro looks to you.</div>
                                </div>
                                <Select
                                    options={[
                                        { value: 'light', label: 'Light' },
                                        { value: 'dark', label: 'Dark' },
                                        { value: 'system', label: 'System' }
                                    ]}
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                />
                            </div>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.settingLabel}>Language</div>
                                    <div className={styles.settingDescription}>Select your preferred language.</div>
                                </div>
                                <Select
                                    options={[
                                        { value: 'en', label: 'English' },
                                        { value: 'es', label: 'Spanish' },
                                        { value: 'fr', label: 'French' }
                                    ]}
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.settingLabel}>Email Notifications</div>
                                    <div className={styles.settingDescription}>Receive daily summaries via email.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotif}
                                    onChange={(e) => setEmailNotif(e.target.checked)}
                                />
                            </div>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.settingLabel}>Push Notifications</div>
                                    <div className={styles.settingDescription}>Get real-time alerts in your browser.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={pushNotif}
                                    onChange={(e) => setPushNotif(e.target.checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className={styles.actions}>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            isLoading={isSaving}
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleReset}
                        >
                            Reset to Defaults
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
