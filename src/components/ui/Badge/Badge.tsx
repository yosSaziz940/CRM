'use client';

/**
 * Badge Component
 * 
 * A small status indicator with various color variants.
 */

import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    dot?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
    style,
}: BadgeProps) {
    const badgeClasses = [
        styles.badge,
        styles[variant],
        styles[size],
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={badgeClasses} style={style}>
            {dot && <span className={styles.dot} />}
            {children}
        </span>
    );
}
