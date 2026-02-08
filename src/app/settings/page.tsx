'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Select } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';
import { usePreferences, Theme, Language } from '@/contexts/PreferencesContext';
import styles from './page.module.css';

export default function SettingsPage() {
    const { success } = useToast();
    const { preferences, updatePreferences, resetPreferences, isLoading } = usePreferences();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Small delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsSaving(false);
        success('Settings saved', 'Your preferences have been updated successfully.');
    };

    const handleReset = () => {
        resetPreferences();
        success('Restored defaults', 'Settings have been reset to original values.');
    };

    if (isLoading) {
        return (
            <MainLayout title="Preferences">
                <div className={styles.container}>
                    <div className={styles.loading}>Loading preferences...</div>
                </div>
            </MainLayout>
        );
    }

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
                                    value={preferences.theme}
                                    onChange={(e) => updatePreferences({ theme: e.target.value as Theme })}
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
                                    value={preferences.language}
                                    onChange={(e) => updatePreferences({ language: e.target.value as Language })}
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
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => updatePreferences({ emailNotifications: e.target.checked })}
                                />
                            </div>
                            <div className={styles.settingItem}>
                                <div className={styles.settingInfo}>
                                    <div className={styles.settingLabel}>Push Notifications</div>
                                    <div className={styles.settingDescription}>Get real-time alerts in your browser.</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={preferences.pushNotifications}
                                    onChange={(e) => updatePreferences({ pushNotifications: e.target.checked })}
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
