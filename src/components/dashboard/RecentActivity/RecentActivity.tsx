'use client';

/**
 * RecentActivity Component
 * 
 * Shows recent activities in a timeline format.
 */

import React from 'react';
import { Activity, ACTIVITY_TYPE_ICONS, ACTIVITY_TYPE_COLORS } from '@/types';
import { formatRelativeTime } from '@/lib/formatters';
import { Avatar } from '@/components/ui/Avatar';
import styles from './RecentActivity.module.css';

interface RecentActivityProps {
    activities: Activity[];
    maxItems?: number;
}

export function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
    const displayActivities = activities.slice(0, maxItems);

    return (
        <div className={styles.container}>
            {displayActivities.map((activity) => (
                <div key={activity.id} className={styles.item}>
                    <div
                        className={styles.icon}
                        style={{ backgroundColor: ACTIVITY_TYPE_COLORS[activity.type] }}
                    >
                        <span>{ACTIVITY_TYPE_ICONS[activity.type]}</span>
                    </div>
                    <div className={styles.content}>
                        <p className={styles.title}>{activity.title}</p>
                        <p className={styles.meta}>
                            <span className={styles.relatedTo}>{activity.relatedTo.name}</span>
                            <span className={styles.separator}>•</span>
                            <span className={styles.time}>{formatRelativeTime(activity.createdAt)}</span>
                        </p>
                    </div>
                    <Avatar name={activity.createdByName} size="sm" />
                </div>
            ))}
        </div>
    );
}
