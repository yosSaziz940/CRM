'use client';

/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer effect.
 */

import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    style?: React.CSSProperties;
}

export function Skeleton({
    className = '',
    width,
    height,
    variant = 'rectangular',
    style: customStyle,
}: SkeletonProps) {
    const style = {
        width: width,
        height: height,
        ...customStyle,
    };

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}
