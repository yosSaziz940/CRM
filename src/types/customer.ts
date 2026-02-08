/**
 * Customer Types
 */

export type CustomerStatus = 'active' | 'inactive' | 'prospect';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    position?: string;
    status: CustomerStatus;
    source?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    tags: string[];
    notes?: string;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomerFilters {
    search?: string;
    status?: CustomerStatus | 'all';
    tags?: string[];
    sortBy?: keyof Customer;
    sortOrder?: 'asc' | 'desc';
}

export interface CustomerFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    position?: string;
    status: CustomerStatus;
    source?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    tags: string[];
    notes?: string;
}

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    prospect: 'Prospect',
};

export const CUSTOMER_STATUS_COLORS: Record<CustomerStatus, string> = {
    active: 'var(--color-success-500)',
    inactive: 'var(--color-neutral-400)',
    prospect: 'var(--color-info-500)',
};
