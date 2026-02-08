'use client';

/**
 * PipelineChart Component
 * 
 * Visual representation of the sales pipeline.
 */

import React from 'react';
import { PIPELINE_STAGES, LeadStatus } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import styles from './PipelineChart.module.css';

interface PipelineData {
    status: LeadStatus;
    count: number;
    value: number;
}

interface PipelineChartProps {
    data: PipelineData[];
}

export function PipelineChart({ data }: PipelineChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className={styles.container}>
            <div className={styles.stages}>
                {PIPELINE_STAGES.filter(stage => stage.status !== 'lost').map((stage) => {
                    const stageData = data.find(d => d.status === stage.status) || { count: 0, value: 0 };
                    const percentage = (stageData.value / maxValue) * 100;

                    return (
                        <div key={stage.status} className={styles.stage}>
                            <div className={styles.stageHeader}>
                                <span className={styles.stageName}>{stage.label}</span>
                                <span className={styles.stageCount}>{stageData.count}</span>
                            </div>
                            <div className={styles.barContainer}>
                                <div
                                    className={styles.bar}
                                    style={{
                                        width: `${Math.max(percentage, 5)}%`,
                                        backgroundColor: stage.color,
                                    }}
                                />
                            </div>
                            <span className={styles.stageValue}>
                                {formatCurrency(stageData.value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
