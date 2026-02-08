import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'New Lead Assigned',
        message: 'A new lead "Tech Corp" has been assigned to you.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        link: '/leads/1'
    },
    {
        id: '2',
        title: 'Meeting Reminder',
        message: 'Meeting with John Doe in 15 minutes.',
        type: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
        id: '3',
        title: 'Deal Won!',
        message: 'Congratulations! The "Global Systems" deal has been won.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        link: '/leads/won'
    },
    {
        id: '4',
        title: 'Task Overdue',
        message: 'Follow-up call with "StartUp Inc" is overdue.',
        type: 'error',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    }
];
