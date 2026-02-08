/**
 * Activity Types
 */

export type ActivityType = 'call' | 'meeting' | 'email' | 'note' | 'task';

export interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    relatedTo: {
        type: 'customer' | 'lead';
        id: string;
        name: string;
    };
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    dueDate?: Date;
    completedAt?: Date;
    isCompleted: boolean;
}

export interface ActivityFilters {
    type?: ActivityType | 'all';
    relatedToType?: 'customer' | 'lead' | 'all';
    relatedToId?: string;
    isCompleted?: boolean | 'all';
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface ActivityFormData {
    type: ActivityType;
    title: string;
    description: string;
    relatedTo: {
        type: 'customer' | 'lead';
        id: string;
    };
    dueDate?: Date;
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
    call: 'Phone Call',
    meeting: 'Meeting',
    email: 'Email',
    note: 'Note',
    task: 'Task',
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
    call: '📞',
    meeting: '📅',
    email: '✉️',
    note: '📝',
    task: '✅',
};

export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
    call: 'var(--color-success-500)',
    meeting: 'var(--color-primary-500)',
    email: 'var(--color-info-500)',
    note: 'var(--color-warning-500)',
    task: 'var(--color-neutral-500)',
};
