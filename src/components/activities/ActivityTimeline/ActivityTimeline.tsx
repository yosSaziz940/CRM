'use client';

/**
 * ActivityTimeline Component
 * 
 * Full timeline view of activities with filtering.
 */

import React from 'react';
import { Activity, ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_ICONS, ACTIVITY_TYPE_COLORS } from '@/types';
import { formatDateTime, formatRelativeTime } from '@/lib/formatters';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import styles from './ActivityTimeline.module.css';

interface ActivityTimelineProps {
    activities: Activity[];
    showRelatedTo?: boolean;
}

export function ActivityTimeline({ activities, showRelatedTo = true }: ActivityTimelineProps) {
    return (
        <div className={styles.timeline}>
            {activities.map((activity, index) => (
                <div key={activity.id} className={styles.item}>
                    <div className={styles.connector}>
                        <div
                            className={styles.dot}
                            style={{ backgroundColor: ACTIVITY_TYPE_COLORS[activity.type] }}
                        >
                            <span className={styles.icon}>{ACTIVITY_TYPE_ICONS[activity.type]}</span>
                        </div>
                        {index < activities.length - 1 && <div className={styles.line} />}
                    </div>

                    <div className={styles.content}>
                        <div className={styles.header}>
                            <div className={styles.titleRow}>
                                <span className={styles.title}>{activity.title}</span>
                                <Badge variant="default" size="sm">
                                    {ACTIVITY_TYPE_LABELS[activity.type]}
                                </Badge>
                            </div>
                            <span className={styles.time}>{formatRelativeTime(activity.createdAt)}</span>
                        </div>

                        {activity.description && (
                            <p className={styles.description}>{activity.description}</p>
                        )}

                        <div className={styles.meta}>
                            {showRelatedTo && (
                                <span className={styles.relatedTo}>
                                    {activity.relatedTo.type === 'customer' ? '👤' : '📈'}{' '}
                                    {activity.relatedTo.name}
                                </span>
                            )}
                            <span className={styles.separator}>•</span>
                            <div className={styles.author}>
                                <Avatar name={activity.createdByName} size="xs" />
                                <span>{activity.createdByName}</span>
                            </div>
                            <span className={styles.separator}>•</span>
                            <span className={styles.dateTime}>{formatDateTime(activity.createdAt)}</span>
                        </div>

                        {activity.dueDate && !activity.isCompleted && (
                            <div className={styles.dueDate}>
                                📅 Due: {formatDateTime(activity.dueDate)}
                            </div>
                        )}

                        {activity.isCompleted && (
                            <div className={styles.completed}>
                                ✅ Completed
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
