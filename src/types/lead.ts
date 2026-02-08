/**
 * Lead and Pipeline Types
 */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high';

export interface Lead {
    id: string;
    title: string;
    description?: string;
    customerId?: string;
    customerName?: string;
    value: number;
    currency: string;
    status: LeadStatus;
    priority: LeadPriority;
    source: string;
    assignedTo: string;
    assignedToName?: string;
    expectedCloseDate?: Date;
    actualCloseDate?: Date;
    probability: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LeadFilters {
    search?: string;
    status?: LeadStatus | 'all';
    priority?: LeadPriority | 'all';
    assignedTo?: string | 'all';
    dateRange?: {
        start: Date;
        end: Date;
    };
    sortBy?: keyof Lead;
    sortOrder?: 'asc' | 'desc';
}

export interface LeadFormData {
    title: string;
    description?: string;
    customerId?: string;
    value: number;
    currency: string;
    status: LeadStatus;
    priority: LeadPriority;
    source: string;
    expectedCloseDate?: Date;
    probability: number;
    tags: string[];
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal',
    won: 'Won',
    lost: 'Lost',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
    new: 'var(--status-new)',
    contacted: 'var(--status-contacted)',
    qualified: 'var(--status-qualified)',
    proposal: 'var(--status-proposal)',
    won: 'var(--status-won)',
    lost: 'var(--status-lost)',
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export const LEAD_PRIORITY_COLORS: Record<LeadPriority, string> = {
    low: 'var(--color-neutral-400)',
    medium: 'var(--color-warning-500)',
    high: 'var(--color-danger-500)',
};

export const LEAD_SOURCES = [
    'Website',
    'Referral',
    'Cold Call',
    'Trade Show',
    'Social Media',
    'Email Campaign',
    'Partner',
    'Other',
] as const;

/**
 * Pipeline stage configuration for Kanban board
 */
export const PIPELINE_STAGES: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'new', label: 'New', color: 'var(--status-new)' },
    { status: 'contacted', label: 'Contacted', color: 'var(--status-contacted)' },
    { status: 'qualified', label: 'Qualified', color: 'var(--status-qualified)' },
    { status: 'proposal', label: 'Proposal', color: 'var(--status-proposal)' },
    { status: 'won', label: 'Won', color: 'var(--status-won)' },
    { status: 'lost', label: 'Lost', color: 'var(--status-lost)' },
];
