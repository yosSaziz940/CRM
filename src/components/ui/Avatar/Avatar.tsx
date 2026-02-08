'use client';

/**
 * Avatar Component
 * 
 * Displays a user avatar with fallback to initials.
 */

import React from 'react';
import { getInitials, stringToColor } from '@/lib/formatters';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    name: string;
    src?: string;
    size?: AvatarSize;
    className?: string;
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
    const initials = getInitials(name);
    const backgroundColor = stringToColor(name);

    const avatarClasses = [styles.avatar, styles[size], className].filter(Boolean).join(' ');

    if (src) {
        return (
            <div className={avatarClasses}>
                <img src={src} alt={name} className={styles.image} />
            </div>
        );
    }

    return (
        <div
            className={avatarClasses}
            style={{ backgroundColor }}
            title={name}
            aria-label={name}
        >
            <span className={styles.initials}>{initials}</span>
        </div>
    );
}

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    className?: string;
}

export function AvatarGroup({ children, max, className = '' }: AvatarGroupProps) {
    const childArray = React.Children.toArray(children);
    const displayCount = max ? Math.min(childArray.length, max) : childArray.length;
    const remainingCount = childArray.length - displayCount;

    return (
        <div className={`${styles.group} ${className}`}>
            {childArray.slice(0, displayCount)}
            {remainingCount > 0 && (
                <div className={`${styles.avatar} ${styles.md} ${styles.overflow}`}>
                    <span className={styles.initials}>+{remainingCount}</span>
                </div>
            )}
        </div>
    );
}
