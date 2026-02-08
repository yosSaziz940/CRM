'use client';

/**
 * PipelineBoard Component
 * 
 * Kanban-style board for lead pipeline management.
 */

import React from 'react';
import { Lead, LeadStatus, PIPELINE_STAGES, LEAD_PRIORITY_COLORS } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/Badge';
import styles from './PipelineBoard.module.css';

interface PipelineBoardProps {
    leads: Lead[];
    onLeadClick?: (lead: Lead) => void;
    onStatusChange?: (leadId: string, newStatus: LeadStatus) => void;
}

export function PipelineBoard({ leads, onLeadClick, onStatusChange }: PipelineBoardProps) {
    const getLeadsByStatus = (status: LeadStatus) => {
        return leads.filter((lead) => lead.status === status);
    };

    const getColumnValue = (status: LeadStatus) => {
        return leads
            .filter((lead) => lead.status === status)
            .reduce((sum, lead) => sum + lead.value, 0);
    };

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId && onStatusChange) {
            onStatusChange(leadId, status);
        }
    };

    return (
        <div className={styles.board}>
            {PIPELINE_STAGES.map((stage) => {
                const stageLeads = getLeadsByStatus(stage.status);
                const columnValue = getColumnValue(stage.status);

                return (
                    <div
                        key={stage.status}
                        className={styles.column}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage.status)}
                    >
                        <div className={styles.columnHeader}>
                            <div className={styles.columnTitle}>
                                <span
                                    className={styles.statusDot}
                                    style={{ backgroundColor: stage.color }}
                                />
                                <span>{stage.label}</span>
                                <span className={styles.count}>{stageLeads.length}</span>
                            </div>
                            <span className={styles.columnValue}>{formatCurrency(columnValue)}</span>
                        </div>

                        <div className={styles.columnContent}>
                            {stageLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className={styles.card}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    onClick={() => onLeadClick?.(lead)}
                                >
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>{lead.title}</span>
                                        <span
                                            className={styles.priorityDot}
                                            style={{ backgroundColor: LEAD_PRIORITY_COLORS[lead.priority] }}
                                            title={`${lead.priority} priority`}
                                        />
                                    </div>
                                    <span className={styles.cardCustomer}>{lead.customerName}</span>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardValue}>{formatCurrency(lead.value)}</span>
                                        <Badge variant="default" size="sm">
                                            {lead.probability}%
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
