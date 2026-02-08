'use client';

/**
 * MainLayout Component
 * 
 * Main application layout with sidebar and header.
 */

import React, { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div
                className={`${styles.main} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}
            >
                <Header title={title} />
                <main className={styles.content}>
                    <div className={styles.contentInner}>{children}</div>
                </main>
            </div>
        </div>
    );
}
