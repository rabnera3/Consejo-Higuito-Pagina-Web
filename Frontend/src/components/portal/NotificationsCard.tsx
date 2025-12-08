import { useEffect, useState } from 'react';
import { fetchNotifications, Notification, markNotificationAsRead } from '../../lib/api';

export function NotificationsCard() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetchNotifications();
            if (response.success) {
                setNotifications(response.data.slice(0, 5)); // Show only top 5
            }
        } catch (error) {
            console.error('Error loading notifications for card:', error);
        } finally {
            setLoading(false);
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

    if (loading) {
        return (
            <div className="cih-card">
                <div className="cih-card__body">
                    <p>Cargando notificaciones...</p>
                </div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="cih-card">
                <div className="cih-card__head">
                    <h3 className="cih-card__title">Notificaciones Recientes</h3>
                </div>
                <div className="cih-card__body">
                    <p className="cih-card__subtitle">No tienes notificaciones nuevas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cih-card">
            <div className="cih-card__head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="cih-card__title">Notificaciones Recientes</h3>
                <span className="cih-card__subtitle" style={{ fontSize: '0.75rem' }}>Últimas 5</span>
            </div>
            <div className="cih-card__body" style={{ padding: 0 }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--cih-border)',
                                background: notification.read_at ? 'transparent' : '#f0f9ff',
                                cursor: notification.read_at ? 'default' : 'pointer'
                            }}
                            onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <strong style={{ fontSize: '0.875rem', color: 'var(--cih-text)' }}>{notification.title}</strong>
                                <small style={{ color: 'var(--cih-muted)', fontSize: '0.75rem' }}>
                                    {new Date(notification.created_at).toLocaleDateString()}
                                </small>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--cih-muted)' }}>
                                {notification.message}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
