'use client';

/**
 * Customers List Page
 * 
 * Displays all customers with search, filter, and sorting.
 */

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useData } from '@/contexts/DataContext';
import { MainLayout } from '@/components/layout';
import { Button, Input, Select, Card, Modal, EmptyState } from '@/components/ui';
import { CustomerTable } from '@/components/customers';
import { mockCustomers } from '@/data';
import { Customer, CustomerStatus } from '@/types';
import styles from './page.module.css';

export default function CustomersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const { customers: allCustomers, deleteCustomer } = useData();
    const { success } = useToast();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
    const [deleteModal, setDeleteModal] = useState<Customer | null>(null);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return allCustomers.filter(customer => {
            const matchesSearch =
                customer.name.toLowerCase().includes(search.toLowerCase()) ||
                customer.email.toLowerCase().includes(search.toLowerCase()) ||
                customer.company.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [allCustomers, search, statusFilter]);

    const handleDelete = (customer: Customer) => {
        setDeleteModal(customer);
    };

    const confirmDelete = () => {
        if (deleteModal) {
            deleteCustomer(deleteModal.id);
            success('Customer deleted', `${deleteModal.name} has been removed.`);
            setDeleteModal(null);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <MainLayout title="Customers">
            <div className={styles.page}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.subtitle}>
                            Manage your customer relationships and contacts.
                        </p>
                    </div>
                    <Button variant="primary" onClick={() => router.push('/customers/new')}>
                        + Add Customer
                    </Button>
                </div>

                {/* Filters */}
                <Card padding="sm" className={styles.filters}>
                    <div className={styles.filterRow}>
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            }
                        />
                        <Select
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'prospect', label: 'Prospect' },
                            ]}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as CustomerStatus | 'all')}
                        />
                    </div>
                    <div className={styles.filterInfo}>
                        Showing {filteredCustomers.length} of {allCustomers.length} customers
                    </div>
                </Card>

                {/* Table or Empty State */}
                {filteredCustomers.length > 0 ? (
                    <CustomerTable
                        customers={filteredCustomers}
                        onEdit={(customer) => router.push(`/customers/${customer.id}`)}
                        onDelete={handleDelete}
                    />
                ) : (
                    <Card>
                        <EmptyState
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            }
                            title="No customers found"
                            description={search || statusFilter !== 'all'
                                ? "Try adjusting your search or filters."
                                : "Get started by adding your first customer."}
                            action={
                                !search && statusFilter === 'all'
                                    ? { label: 'Add Customer', onClick: () => router.push('/customers/new') }
                                    : undefined
                            }
                        />
                    </Card>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                title="Delete Customer"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteModal(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p>Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.</p>
            </Modal>
        </MainLayout>
    );
}
