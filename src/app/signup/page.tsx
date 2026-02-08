'use client';

/**
 * Sign Up Page
 * 
 * New user registration page.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_NAME } from '@/lib/constants';
import styles from './page.module.css';

export default function SignupPage() {
    const router = useRouter();
    const { signup, isLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const result = await signup(name, email, password);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            setError(result.error || 'Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.signupCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="6" fill="var(--color-primary-600)" />
                            <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>{APP_NAME}</h1>
                    <p className={styles.subtitle}>Create your account</p>
                </div>

                {success ? (
                    <div className={styles.success}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success-500)" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <h3>Account Created!</h3>
                        <p>Redirecting to login...</p>
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
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Create Account
                        </Button>

                        <div className={styles.footer}>
                            <p>Already have an account? <a href="/login" className={styles.link}>Sign in</a></p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
