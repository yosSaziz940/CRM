'use client';

/**
 * LeadForm Component
 * 
 * Form for creating and editing leads.
 */

import React, { useState } from 'react';
import { LeadFormData, LeadStatus, LeadPriority, LEAD_STATUS_LABELS, LEAD_PRIORITY_LABELS, LEAD_SOURCES } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockCustomers } from '@/data';
import styles from './LeadForm.module.css';

interface LeadFormProps {
    initialData?: Partial<LeadFormData>;
    onSubmit: (data: LeadFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const statusOptions = Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
}));

const priorityOptions = Object.entries(LEAD_PRIORITY_LABELS).map(([value, label]) => ({
    value,
    label,
}));

const customerOptions = mockCustomers.map(c => ({
    value: c.id,
    label: c.name,
}));

const sourceOptions = LEAD_SOURCES.map(source => ({
    value: source,
    label: source,
}));

const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD ($)' },
    { value: 'AUD', label: 'AUD ($)' },
    { value: 'JPY', label: 'JPY (¥)' },
];

export function LeadForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: LeadFormProps) {
    const [formData, setFormData] = useState<LeadFormData>({
        customerId: initialData?.customerId || '',
        title: initialData?.title || '',
        value: initialData?.value || 0,
        currency: initialData?.currency || 'USD',
        status: initialData?.status || 'new',
        priority: initialData?.priority || 'medium',
        source: initialData?.source || 'Website',
        probability: initialData?.probability || 20,
        expectedCloseDate: initialData?.expectedCloseDate || new Date(),
        description: initialData?.description || '',
        tags: initialData?.tags || [],
    });

    const [dateString, setDateString] = useState(
        initialData?.expectedCloseDate
            ? new Date(initialData.expectedCloseDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
    );

    const [tagsString, setTagsString] = useState(
        initialData?.tags ? initialData.tags.join(', ') : ''
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof LeadFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleTagsChange = (value: string) => {
        setTagsString(value);
        const tags = value.split(',').map(t => t.trim()).filter(Boolean);
        handleChange('tags', tags);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.customerId) {
            newErrors.customerId = 'Customer is required';
        }
        if (formData.value < 0) {
            newErrors.value = 'Value cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...formData,
                expectedCloseDate: new Date(dateString),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
                <div className={styles.fullWidth}>
                    <Input
                        label="Deal Title"
                        placeholder="e.g. Q4 Software License"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        error={errors.title}
                        fullWidth
                        required
                    />
                </div>

                <Select
                    label="Customer"
                    options={[{ value: '', label: 'Select Customer' }, ...customerOptions]}
                    value={formData.customerId}
                    onChange={(e) => handleChange('customerId', e.target.value)}
                    error={errors.customerId}
                    fullWidth
                />

                <div className={styles.currencyRow}>
                    <Input
                        label="Value"
                        type="number"
                        min="0"
                        value={formData.value.toString()}
                        onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                        error={errors.value}
                        fullWidth
                        required
                    />
                    <Select
                        label="Currency"
                        options={currencyOptions}
                        value={formData.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        fullWidth
                    />
                </div>

                <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as LeadStatus)}
                    fullWidth
                />

                <Select
                    label="Priority"
                    options={priorityOptions}
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as LeadPriority)}
                    fullWidth
                />

                <Select
                    label="Lead Source"
                    options={sourceOptions}
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    fullWidth
                />

                <div className={styles.sliderContainer}>
                    <label className={styles.label}>Probability: {formData.probability}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={formData.probability}
                        onChange={(e) => handleChange('probability', parseInt(e.target.value))}
                        className={styles.slider}
                    />
                </div>

                <div>
                    <label className={styles.label} style={{ display: 'block', marginBottom: '8px' }}>Expected Close Date</label>
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={dateString}
                        onChange={(e) => setDateString(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.fieldSection}>
                <Input
                    label="Tags"
                    placeholder="e.g. software, referral, q4 (comma separated)"
                    value={tagsString}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    fullWidth
                />
            </div>

            <div className={styles.descriptionSection}>
                <label className={styles.label}>Description</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Details about this opportunity..."
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={4}
                />
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    {initialData?.title ? 'Update Lead' : 'Create Lead'}
                </Button>
            </div>
        </form>
    );
}
