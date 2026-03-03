import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import moment from 'moment';
import Loader from '../components/ui/Loader';

const Notifications = () => {
    const { socket } = useAuth(); // Get socket
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({}); 
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page')) || 1;

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/notifications?page=${page}`);
            setNotifications(res.data.notifications || []);
            setStats({
                totalPages: res.data.totalPages || 1,
                currentPage: res.data.currentPage || 1
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load notifications");
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line
        fetchNotifications();
    }, [page]);

    // Real-time updates
    useEffect(() => {
        if (socket) {
            const handleNotification = (newNotification) => {
                // Prepend new notification to the list, avoiding duplicates
                setNotifications(prev => {
                    if (prev.some(n => n._id === newNotification._id)) {
                        return prev;
                    }
                    return [newNotification, ...prev];
                });
            };

            socket.on('newNotification', handleNotification);

            return () => {
                socket.off('newNotification', handleNotification);
            };
        }
    }, [socket]);

    const handleMarkAllRead = async () => {
        try {
            await api.post('/notifications/api/mark-all-read');
            fetchNotifications(); // Refresh
        } catch (e) {
            console.error(e);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.post('/notifications/api/mark-read', { notificationIds: [id] });
            // Update local state to show as read immediately
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/notifications/api/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    // Push toggle moved to Preferences page

    if (loading) return (
        <div className="d-flex justify-content-center mt-5">
            <Loader />
        </div>
    );
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-8 mx-auto py-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                        <h2 className="mb-2 mb-md-0">
                            <i className="bi bi-bell"></i> Notifications
                        </h2>
                        <div className="d-flex flex-wrap gap-2">
                            {/* Preferences link */}
                            <Link to="/notifications/preferences" className="text-decoration-none text-dark bttn btn-outline-secondary btn-sm">
                                <i className="bi bi-gear"></i> Preferences
                            </Link>
                            {notifications.length > 0 && (
                                <button onClick={handleMarkAllRead} className="bttn btn-outline-primary btn-sm">
                                    <i className="bi bi-check-all"></i> Mark All Read
                                </button>
                            )}
                        </div>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-bell-slash display-1 text-muted"></i>
                            <h4 className="text-muted mt-3">No notifications yet</h4>
                            <p className="text-muted">When someone interacts with your content, you'll see notifications here.</p>
                        </div>
                    ) : (
                        <div className="notification-list">
                            {notifications.map(notification => (
                                <div key={notification._id} className={`notification-item card mb-3 ${!notification.isRead ? 'unread' : ''}`}>
                                    <div className="card-body">
                                        <div className="d-flex align-items-start">
                                            <div className="flex-shrink-0 me-3">
                                                {notification.sender && notification.sender.avatar ? (
                                                    <img
                                                        src={notification.sender.avatar.url}
                                                        alt={notification.sender.name}
                                                        className="rounded-circle"
                                                        style={{ width: '40px', height: '40px' }}
                                                    />
                                                ) : (
                                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                        <i className="bi bi-person text-white"></i>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <p className="mb-1 notification-message">
                                                            {notification.message}
                                                        </p>
                                                        <small className="text-muted">
                                                            <i className="bi bi-clock me-1"></i>
                                                            {moment(notification.createdAt).fromNow()}
                                                        </small>
                                                    </div>

                                                    <div className="dropdown">
                                                        <button className="btnn-decore btn-link text-primary dropdown-toggle p-0 text-decoration-none" type="button" data-bs-toggle="dropdown">
                                                            <i className="bi bi-three-dots"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            {!notification.isRead && (
                                                                <li>
                                                                    <button className="dropdown-item" onClick={() => handleMarkRead(notification._id)}>
                                                                        <i className="bi bi-check me-2"></i> Mark as Read
                                                                    </button>
                                                                </li>
                                                            )}
                                                            <li>
                                                                <button className="dropdown-item text-danger" onClick={() => handleDelete(notification._id)}>
                                                                    <i className="bi bi-trash me-2"></i> Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                {notification.relatedBlog && (
                                                    <div className="mt-2">
                                                        <Link
                                                            to={`/blogs/${notification.relatedBlog._id}`}
                                                            className=" btn-sm btn-outline-primary notification-link"
                                                            onClick={() => !notification.isRead && handleMarkRead(notification._id)}
                                                        >
                                                            <i className="bi bi-arrow-right me-1"></i> View Post
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {stats.totalPages > 1 && (
                        <nav aria-label="Notifications pagination" className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${stats.currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setSearchParams({ page: stats.currentPage - 1 })}>Previous</button>
                                </li>

                                {[...Array(stats.totalPages)].map((_, i) => (
                                    <li key={i + 1} className={`page-item ${stats.currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setSearchParams({ page: i + 1 })}>{i + 1}</button>
                                    </li>
                                ))}

                                <li className={`page-item ${stats.currentPage === stats.totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setSearchParams({ page: stats.currentPage + 1 })}>Next</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
