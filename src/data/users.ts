/**
 * Mock Users Data
 */

import { User } from '@/types';

export const mockUsers: User[] = [
    {
        id: 'user-1',
        email: 'admin@crm.com',
        name: 'Sarah Johnson',
        role: 'admin',
        avatar: undefined,
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
    },
    {
        id: 'user-2',
        email: 'manager@crm.com',
        name: 'Michael Chen',
        role: 'manager',
        avatar: undefined,
        createdAt: new Date('2024-02-15'),
        lastLoginAt: new Date(),
    },
    {
        id: 'user-3',
        email: 'sales@crm.com',
        name: 'Emily Davis',
        role: 'sales',
        avatar: undefined,
        createdAt: new Date('2024-03-01'),
        lastLoginAt: new Date(),
    },
    {
        id: 'user-4',
        email: 'john@crm.com',
        name: 'John Smith',
        role: 'sales',
        avatar: undefined,
        createdAt: new Date('2024-04-01'),
        lastLoginAt: new Date(),
    },
];

/**
 * Demo credentials for testing
 * In production, these would be validated against a secure backend
 */
export const demoCredentials = [
    { email: 'admin@crm.com', password: 'admin123', userId: 'user-1' },
    { email: 'manager@crm.com', password: 'manager123', userId: 'user-2' },
    { email: 'sales@crm.com', password: 'sales123', userId: 'user-3' },
];
