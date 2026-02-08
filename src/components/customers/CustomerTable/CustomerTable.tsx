'use client';

/**
 * CustomerTable Component
 * 
 * Displays customers in a table with search and filters.
 */

import React from 'react';
import Link from 'next/link';
import { Customer, CustomerStatus, CUSTOMER_STATUS_LABELS } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { formatDate } from '@/lib/formatters';
import styles from './CustomerTable.module.css';

interface CustomerTableProps {
    customers: Customer[];
    onEdit?: (customer: Customer) => void;
    onDelete?: (customer: Customer) => void;
}

const STATUS_VARIANT: Record<CustomerStatus, BadgeVariant> = {
    active: 'success',
    inactive: 'default',
    prospect: 'info',
};

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>
                                <Link href={`/customers/${customer.id}`} className={styles.customerCell}>
                                    <Avatar name={customer.name} size="sm" />
                                    <div className={styles.customerInfo}>
                                        <span className={styles.customerName}>{customer.name}</span>
                                        <span className={styles.customerEmail}>{customer.email}</span>
                                    </div>
                                </Link>
                            </td>
                            <td>
                                <span className={styles.company}>{customer.company}</span>
                            </td>
                            <td>
                                <Badge variant={STATUS_VARIANT[customer.status]} dot>
                                    {CUSTOMER_STATUS_LABELS[customer.status]}
                                </Badge>
                            </td>
                            <td>
                                <span className={styles.date}>{formatDate(customer.createdAt)}</span>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => onEdit?.(customer)}
                                        title="Edit"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.danger}`}
                                        onClick={() => onDelete?.(customer)}
                                        title="Delete"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
