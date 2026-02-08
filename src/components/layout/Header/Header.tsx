'use client';

/**
 * Header Component
 * 
 * Top header with search, notifications, and user menu.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { mockNotifications } from '@/data';
import { formatRelativeTime } from '@/lib/formatters';
import styles from './Header.module.css';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Close menus when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                {title && <h1 className={styles.title}>{title}</h1>}
            </div>

            <div className={styles.right}>
                {/* Search */}
                <div className={styles.search}>
                    <span className={styles.searchIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        className={styles.searchInput}
                    />
                    <span className={styles.searchShortcut}>⌘K</span>
                </div>

                {/* Notifications */}
                <div className={styles.notificationsMenu} ref={notificationsRef}>
                    <button
                        className={styles.iconButton}
                        aria-label="Notifications"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {unreadCount > 0 && <span className={styles.notificationBadge}>{unreadCount}</span>}
                    </button>

                    {isNotificationsOpen && (
                        <div className={styles.notificationsDropdown}>
                            <div className={styles.notificationsHeader}>
                                <h3 className={styles.notificationsTitle}>Notifications</h3>
                                <button className={styles.markAllRead}>Mark all as read</button>
                            </div>
                            <div className={styles.notificationList}>
                                {mockNotifications.length > 0 ? (
                                    mockNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                                        >
                                            <div className={`${styles.typeIndicator} ${styles[notification.type]}`} />
                                            <div className={styles.notificationContent}>
                                                <div className={styles.notificationItemTitle}>{notification.title}</div>
                                                <div className={styles.notificationMessage}>{notification.message}</div>
                                                <div className={styles.notificationTime}>
                                                    {formatRelativeTime(notification.createdAt)}
                                                </div>
                                            </div>
                                            {!notification.isRead && <div className={styles.unreadDot} />}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.emptyNotifications}>
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            <button className={styles.viewAllNotifications}>
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className={styles.userMenu} ref={userMenuRef}>
                    <button
                        className={styles.userButton}
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-expanded={isUserMenuOpen}
                    >
                        <Avatar name={user?.name || 'User'} size="sm" />
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user?.name}</span>
                            <span className={styles.userRole}>{user?.role}</span>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`${styles.chevron} ${isUserMenuOpen ? styles.chevronUp : ''}`}
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </button>

                    {isUserMenuOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <Avatar name={user?.name || 'User'} size="md" />
                                <div>
                                    <div className={styles.dropdownName}>{user?.name}</div>
                                    <div className={styles.dropdownEmail}>{user?.email}</div>
                                </div>
                            </div>
                            <div className={styles.dropdownDivider} />
                            <button
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    router.push('/profile');
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Profile Settings
                            </button>
                            <button
                                className={styles.dropdownItem}
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    router.push('/settings');
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                Preferences
                            </button>
                            <div className={styles.dropdownDivider} />
                            <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={logout}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
