'use client';

/**
 * CustomerForm Component
 * 
 * Form for creating and editing customers.
 */

import React, { useState } from 'react';
import { CustomerFormData, CustomerStatus, CUSTOMER_STATUS_LABELS } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import styles from './CustomerForm.module.css';

interface CustomerFormProps {
    initialData?: Partial<CustomerFormData>;
    onSubmit: (data: CustomerFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const statusOptions = Object.entries(CUSTOMER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
}));

export function CustomerForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: CustomerFormProps) {
    const [formData, setFormData] = useState<CustomerFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        company: initialData?.company || '',
        position: initialData?.position || '',
        status: initialData?.status || 'prospect',
        source: initialData?.source || '',
        tags: initialData?.tags || [],
        notes: initialData?.notes || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof CustomerFormData, value: string | CustomerStatus) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }
        if (!formData.company.trim()) {
            newErrors.company = 'Company is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
                <Input
                    label="Full Name"
                    placeholder="Enter customer name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    fullWidth
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    placeholder="customer@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    fullWidth
                    required
                />
                <Input
                    label="Phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                    fullWidth
                    required
                />
                <Input
                    label="Company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    error={errors.company}
                    fullWidth
                    required
                />
                <Input
                    label="Position"
                    placeholder="Job title"
                    value={formData.position || ''}
                    onChange={(e) => handleChange('position', e.target.value)}
                    fullWidth
                />
                <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as CustomerStatus)}
                    fullWidth
                />
                <Input
                    label="Source"
                    placeholder="How did they find you?"
                    value={formData.source || ''}
                    onChange={(e) => handleChange('source', e.target.value)}
                    fullWidth
                />
            </div>

            <div className={styles.notesSection}>
                <label className={styles.label}>Notes</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Additional notes about this customer..."
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                    {initialData?.name ? 'Update Customer' : 'Create Customer'}
                </Button>
            </div>
        </form>
    );
}
