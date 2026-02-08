'use client';

/**
 * Forgot Password Page
 * 
 * Password recovery page.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';
import styles from './page.module.css';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { resetPassword, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await resetPassword(email);

        if (result.success) {
            setSuccess(true);
        } else {
            setError(result.error || 'Request failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="6" fill="var(--color-primary-600)" />
                            <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your email to receive recovery instructions</p>
                </div>

                {success ? (
                    <div className={styles.success}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-500)" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <h3>Check your email</h3>
                        <p>We've sent a password reset link to <strong>{email}</strong></p>
                        <Button variant="secondary" onClick={() => router.push('/login')} fullWidth>
                            Back to Login
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Send Reset Link
                        </Button>

                        <div className={styles.footer}>
                            <a href="/login" className={styles.link}>Back to Login</a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
