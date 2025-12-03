import { useState, useEffect, useRef } from 'react';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteAllNotifications, Notification } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            loadNotifications();
            // Poll every 60 seconds
            const interval = setInterval(loadNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetchNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('¿Estás seguro de borrar todas las notificaciones?')) return;
        try {
            await deleteAllNotifications();
            setNotifications([]);
        } catch (error) {
            console.error('Error deleting all notifications:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <div className="notification-center" ref={dropdownRef} style={{ position: 'relative', marginRight: '1rem' }}>
            <button
                type="button"
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notificaciones"
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary, #64748b)',
                    transition: 'color 0.2s'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge" style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        border: '2px solid white'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown" style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '0',
                    width: '320px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    marginTop: '8px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div className="notification-header" style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f8fafc'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Notificaciones</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {unreadCount > 0 ? (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3b82f6',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontWeight: 500
                                    }}
                                >
                                    Marcar todo leído
                                </button>
                            ) : (
                                notifications.length > 0 && (
                                    <button
                                        onClick={handleDeleteAll}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#ef4444',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontWeight: 500
                                        }}
                                    >
                                        Borrar todo
                                    </button>
                                )
                            )}
                            {unreadCount > 0 && (
                                <span style={{ fontSize: '12px', color: '#64748b' }}>{unreadCount} nuevas</span>
                            )}
                        </div>
                    </div>

                    <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                                No tienes notificaciones
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                                    onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: !notification.read_at ? 'pointer' : 'default',
                                        background: !notification.read_at ? '#f0f9ff' : 'white',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: !notification.read_at ? 600 : 500,
                                            color: !notification.read_at ? '#0f172a' : '#475569'
                                        }}>
                                            {notification.title}
                                        </span>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                            {new Date(notification.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                                        {notification.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
