'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lead, Customer, Activity, LeadFormData, CustomerFormData } from '@/types';
import { mockLeads, mockCustomers, mockActivities } from '@/data';
import { STORAGE_KEYS } from '@/lib/constants';

interface DataContextType {
    leads: Lead[];
    customers: Customer[];
    activities: Activity[];
    addLead: (data: LeadFormData) => void;
    updateLead: (id: string, updates: Partial<Lead>) => void;
    deleteLead: (id: string) => void;
    addCustomer: (data: CustomerFormData) => void;
    updateCustomer: (id: string, updates: Partial<Customer>) => void;
    deleteCustomer: (id: string) => void;
    addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize data from localStorage or mock data
    useEffect(() => {
        const storedLeads = localStorage.getItem('crm_leads');
        const storedCustomers = localStorage.getItem('crm_customers');
        const storedActivities = localStorage.getItem('crm_activities');

        if (storedLeads) {
            const parsed = JSON.parse(storedLeads);
            setLeads(parsed.map((l: any) => ({
                ...l,
                createdAt: new Date(l.createdAt),
                updatedAt: new Date(l.updatedAt),
                expectedCloseDate: l.expectedCloseDate ? new Date(l.expectedCloseDate) : undefined
            })));
        } else {
            setLeads(mockLeads);
        }

        if (storedCustomers) {
            const parsed = JSON.parse(storedCustomers);
            setCustomers(parsed.map((c: any) => ({
                ...c,
                createdAt: new Date(c.createdAt),
                updatedAt: new Date(c.updatedAt)
            })));
        } else {
            setCustomers(mockCustomers);
        }

        if (storedActivities) {
            const parsed = JSON.parse(storedActivities);
            setActivities(parsed.map((a: any) => ({
                ...a,
                createdAt: new Date(a.createdAt)
            })));
        } else {
            setActivities(mockActivities);
        }

        setIsInitialized(true);
    }, []);

    // Persist data when it changes
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('crm_leads', JSON.stringify(leads));
        localStorage.setItem('crm_customers', JSON.stringify(customers));
        localStorage.setItem('crm_activities', JSON.stringify(activities));
    }, [leads, customers, activities, isInitialized]);

    const addLead = useCallback((data: LeadFormData) => {
        const newLead: Lead = {
            id: `lead-${Date.now()}`,
            ...data,
            assignedTo: 'user-1',
            assignedToName: 'Sarah Johnson',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setLeads(prev => [newLead, ...prev]);

        // Add activity
        addActivity({
            type: 'task',
            title: 'Lead Created',
            description: `A new lead "${data.title}" was created.`,
            relatedTo: {
                type: 'lead',
                id: newLead.id,
                name: newLead.title
            },
            createdBy: 'user-1',
            createdByName: 'Sarah Johnson',
            isCompleted: true
        });
    }, []);

    const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
        setLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
        ));
    }, []);

    const deleteLead = useCallback((id: string) => {
        setLeads(prev => prev.filter(lead => lead.id !== id));
    }, []);

    const addCustomer = useCallback((data: CustomerFormData) => {
        const newCustomer: Customer = {
            id: `customer-${Date.now()}`,
            ...data,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setCustomers(prev => [newCustomer, ...prev]);

        // Add activity
        addActivity({
            type: 'task',
            title: 'Customer Created',
            description: `A new customer "${data.name}" was added.`,
            relatedTo: {
                type: 'customer',
                id: newCustomer.id,
                name: newCustomer.name
            },
            createdBy: 'user-1',
            createdByName: 'Sarah Johnson',
            isCompleted: true
        });
    }, []);

    const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
        setCustomers(prev => prev.map(customer =>
            customer.id === id ? { ...customer, ...updates, updatedAt: new Date() } : customer
        ));
    }, []);

    const deleteCustomer = useCallback((id: string) => {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
    }, []);

    const addActivity = useCallback((activity: Omit<Activity, 'id' | 'createdAt'>) => {
        const newActivity: Activity = {
            id: `activity-${Date.now()}`,
            ...activity,
            createdAt: new Date(),
        };
        setActivities(prev => [newActivity, ...prev]);
    }, []);

    return (
        <DataContext.Provider value={{
            leads,
            customers,
            activities,
            addLead,
            updateLead,
            deleteLead,
            addCustomer,
            updateCustomer,
            deleteCustomer,
            addActivity
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
