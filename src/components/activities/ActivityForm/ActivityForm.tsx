'use client';

/**
 * ActivityForm Component
 * 
 * Form for creating or editing activities.
 */

import React, { useState } from 'react';
import { ActivityFormData, ActivityType, ACTIVITY_TYPE_LABELS } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { mockCustomers, mockLeads } from '@/data';
import styles from './ActivityForm.module.css';

interface ActivityFormProps {
    initialData?: Partial<ActivityFormData>;
    onSubmit: (data: ActivityFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ActivityForm({ initialData, onSubmit, onCancel, isLoading = false }: ActivityFormProps) {
    const [formData, setFormData] = useState<ActivityFormData>({
        type: initialData?.type || 'call',
        title: initialData?.title || '',
        description: initialData?.description || '',
        relatedTo: initialData?.relatedTo || {
            type: 'customer',
            id: '',
        },
        dueDate: initialData?.dueDate || undefined,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof ActivityFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleRelatedToChange = (field: 'type' | 'id', value: string) => {
        setFormData(prev => ({
            ...prev,
            relatedTo: {
                ...prev.relatedTo,
                [field]: value,
                // Reset ID if type changes
                ...(field === 'type' ? { id: '' } : {}),
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.relatedTo.id) newErrors.relatedTo = 'Please select a related contact';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    // Prepare options based on related type
    const relatedOptions = formData.relatedTo.type === 'customer'
        ? mockCustomers.map(c => ({ value: c.id, label: c.name }))
        : mockLeads.map(l => ({ value: l.id, label: l.title }));

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
                <Select
                    label="Activity Type"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    options={Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => ({
                        value,
                        label,
                    }))}
                    fullWidth
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Discovery Call"
                    error={errors.title}
                    fullWidth
                />
            </div>

            <div className={styles.grid}>
                <Select
                    label="Related To"
                    value={formData.relatedTo.type}
                    onChange={(e) => handleRelatedToChange('type', e.target.value)}
                    options={[
                        { value: 'customer', label: 'Customer' },
                        { value: 'lead', label: 'Lead' },
                    ]}
                    fullWidth
                />
                <Select
                    label="Select Record"
                    value={formData.relatedTo.id}
                    onChange={(e) => handleRelatedToChange('id', e.target.value)}
                    options={[{ value: '', label: 'Select...' }, ...relatedOptions]}
                    error={errors.relatedTo}
                    fullWidth
                    disabled={!formData.relatedTo.type}
                />
            </div>

            <div className={styles.row}>
                <label className={styles.label}>Description</label>
                <textarea
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Add details..."
                    rows={4}
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Due Date (Optional)"
                    type="datetime-local"
                    value={formData.dueDate ? new Date(formData.dueDate.getTime() - (formData.dueDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange('dueDate', e.target.value ? new Date(e.target.value) : undefined)}
                    fullWidth
                />
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    Save Activity
                </Button>
            </div>
        </form>
    );
}
