'use client';

/**
 * KPICard Component
 * 
 * Displays a key performance indicator with trend.
 */

import React from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        label: string;
    };
    icon: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function KPICard({ title, value, change, icon, color = 'primary' }: KPICardProps) {
    const isPositive = change && change.value >= 0;

    return (
        <div className={styles.card}>
            <div className={`${styles.iconWrapper} ${styles[color]}`}>
                {icon}
            </div>
            <div className={styles.content}>
                <span className={styles.title}>{title}</span>
                <span className={styles.value}>{value}</span>
                {change && (
                    <div className={`${styles.change} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 15l-6-6-6 6" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        )}
                        <span>{Math.abs(change.value)}%</span>
                        <span className={styles.changeLabel}>{change.label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
