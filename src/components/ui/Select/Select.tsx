'use client';

/**
 * Select Component
 * 
 * A styled select dropdown with label and error support.
 */

import React, { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            helperText,
            options,
            placeholder,
            fullWidth = false,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = !!error;

        const containerClasses = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
            className,
        ].filter(Boolean).join(' ');

        const selectWrapperClasses = [
            styles.selectWrapper,
            hasError ? styles.hasError : '',
        ].filter(Boolean).join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label htmlFor={selectId} className={styles.label}>
                        {label}
                    </label>
                )}
                <div className={selectWrapperClasses}>
                    <select
                        ref={ref}
                        id={selectId}
                        className={styles.select}
                        aria-invalid={hasError}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className={styles.arrow}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </span>
                </div>
                {hasError && <span className={styles.error}>{error}</span>}
                {!hasError && helperText && <span className={styles.helperText}>{helperText}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
