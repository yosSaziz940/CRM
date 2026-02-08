'use client';

/**
 * LeadTable Component
 * 
 * Table view for displaying leads.
 */

import React from 'react';
import { Lead, LEAD_STATUS_LABELS, LEAD_PRIORITY_LABELS, LEAD_STATUS_COLORS, LEAD_PRIORITY_COLORS } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import styles from './LeadTable.module.css';

interface LeadTableProps {
    leads: Lead[];
    onLeadClick?: (lead: Lead) => void;
}

export function LeadTable({ leads, onLeadClick }: LeadTableProps) {
    return (
        <Card className={styles.container}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Customer</th>
                            <th>Value</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Probability</th>
                            <th>Expected Close</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.empty}>
                                    No leads found
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => onLeadClick?.(lead)}
                                    className={styles.row}
                                >
                                    <td className={styles.titleCell}>{lead.title}</td>
                                    <td>{lead.customerName}</td>
                                    <td>{formatCurrency(lead.value, lead.currency)}</td>
                                    <td>
                                        <Badge
                                            variant="primary"
                                            size="sm"
                                            style={{ backgroundColor: LEAD_STATUS_COLORS[lead.status] }}
                                        >
                                            {LEAD_STATUS_LABELS[lead.status]}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className={styles.priorityCell}>
                                            <span
                                                className={styles.priorityDot}
                                                style={{ backgroundColor: LEAD_PRIORITY_COLORS[lead.priority] }}
                                            />
                                            {LEAD_PRIORITY_LABELS[lead.priority]}
                                        </div>
                                    </td>
                                    <td>{lead.probability}%</td>
                                    <td>
                                        {lead.expectedCloseDate
                                            ? formatDate(lead.expectedCloseDate)
                                            : '-'}
                                    </td>
                                    <td>{lead.assignedToName}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
