'use client';

/**
 * Sidebar Component
 * 
 * Main navigation sidebar for the CRM application.
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NAVIGATION_ITEMS, APP_NAME } from '@/lib/constants';
import styles from './Sidebar.module.css';

const ICONS: Record<string, React.ReactNode> = {
    dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
    ),
    customers: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    leads: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    ),
    activities: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
};

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    const filteredNavItems = NAVIGATION_ITEMS.filter(item => {
        if (user?.role === 'sales') {
            return ['dashboard', 'leads'].includes(item.id);
        }
        return true;
    });

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.header}>
                <Link href="/dashboard" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="6" fill="currentColor" />
                            <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className={styles.logoText}>{APP_NAME}</span>}
                </Link>
                {onToggle && (
                    <button className={styles.toggleButton} onClick={onToggle} aria-label="Toggle sidebar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isCollapsed ? (
                                <path d="M9 18l6-6-6-6" />
                            ) : (
                                <path d="M15 18l-6-6 6-6" />
                            )}
                        </svg>
                    </button>
                )}
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <span className={styles.navIcon}>{ICONS[item.icon]}</span>
                                    {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.footer}>
                {!isCollapsed && (
                    <div className={styles.footerContent}>
                        <span className={styles.version}>v1.0.0</span>
                    </div>
                )}
            </div>
        </aside>
    );
}
