'use client';

/**
 * Input Component
 * 
 * A form input with label, error state, and helper text support.
 */

import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        const containerClasses = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
            className,
        ].filter(Boolean).join(' ');

        const inputWrapperClasses = [
            styles.inputWrapper,
            hasError ? styles.hasError : '',
            leftIcon ? styles.hasLeftIcon : '',
            rightIcon ? styles.hasRightIcon : '',
        ].filter(Boolean).join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={inputWrapperClasses}>
                    {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
                    <input
                        ref={ref}
                        id={inputId}
                        className={styles.input}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />
                    {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
                </div>
                {hasError && (
                    <span id={`${inputId}-error`} className={styles.error}>
                        {error}
                    </span>
                )}
                {!hasError && helperText && (
                    <span id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
