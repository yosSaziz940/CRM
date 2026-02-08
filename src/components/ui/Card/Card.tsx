'use client';

/**
 * Card Component
 * 
 * A container component with consistent styling.
 */

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

export function Card({
    children,
    className = '',
    padding = 'md',
    hover = false,
    onClick,
}: CardProps) {
    const cardClasses = [
        styles.card,
        styles[`padding-${padding}`],
        hover ? styles.hover : '',
        onClick ? styles.clickable : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
    return (
        <div className={`${styles.header} ${className}`}>
            <div className={styles.headerContent}>{children}</div>
            {action && <div className={styles.headerAction}>{action}</div>}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
    return <Tag className={`${styles.title} ${className}`}>{children}</Tag>;
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return <p className={`${styles.description} ${className}`}>{children}</p>;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={`${styles.content} ${className}`}>{children}</div>;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return <div className={`${styles.footer} ${className}`}>{children}</div>;
}
