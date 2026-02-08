'use client';

/**
 * Login Page
 * 
 * Authentication page with credentials form.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="6" fill="var(--color-primary-600)" />
                            <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>{APP_NAME}</h1>
                    <p className={styles.subtitle}>Sign in to your account</p>
                </div>

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

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />

                    <div className={styles.options}>
                        <label className={styles.checkbox}>
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="/forgot-password" className={styles.forgotLink}>Forgot password?</a>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>

                    <div className={styles.footer}>
                        <p>Don&apos;t have an account? <a href="/signup" className={styles.link}>Sign up</a></p>
                    </div>
                </form>

                <div className={styles.demo}>
                    <p className={styles.demoTitle}>Demo Accounts</p>
                    <div className={styles.demoAccounts}>
                        <button
                            type="button"
                            className={styles.demoAccount}
                            onClick={() => { setEmail('admin@crm.com'); setPassword('admin123'); }}
                        >
                            <span className={styles.demoRole}>Admin</span>
                            <span className={styles.demoEmail}>admin@crm.com</span>
                        </button>
                        <button
                            type="button"
                            className={styles.demoAccount}
                            onClick={() => { setEmail('manager@crm.com'); setPassword('manager123'); }}
                        >
                            <span className={styles.demoRole}>Manager</span>
                            <span className={styles.demoEmail}>manager@crm.com</span>
                        </button>
                        <button
                            type="button"
                            className={styles.demoAccount}
                            onClick={() => { setEmail('sales@crm.com'); setPassword('sales123'); }}
                        >
                            <span className={styles.demoRole}>Sales</span>
                            <span className={styles.demoEmail}>sales@crm.com</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
