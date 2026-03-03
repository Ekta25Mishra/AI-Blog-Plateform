import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, socket } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [toast, setToast] = useState(null);
    const [showPushPrompt, setShowPushPrompt] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const { showToast } = useToast();

    // Deduplication Ref 
    const processedNotificationIds = useRef(new Set());

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications/api/unread-count');
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error(err);
        }
    };

    const checkPushPromptRules = () => {
        const dismissed = localStorage.getItem('pushPromptDismissed');
        const dismissedTime = dismissed ? new Date(dismissed) : null;
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        if (!dismissed || dismissedTime < oneDayAgo) {
            setTimeout(() => {
                setShowPushPrompt(true);
            }, 3000);
        }
    };

    const initServiceWorker = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                // Register SW
                const registration = await navigator.serviceWorker.register('/sw.js');

                // Check Subscription
                const sub = await registration.pushManager.getSubscription();
                setSubscription(sub);

                if (!sub) {
                    // Show Prompt after 3s delay 
                    checkPushPromptRules();
                }

                // Listen for messages from SW 
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data.type === 'NOTIFICATION_CLICK') {
                        window.location.href = event.data.url;
                    }
                });

            } catch (error) {
                console.error('SW Registration failed', error);
            }
        }
    };


    useEffect(() => {
        if (!socket || !user) {
            return;
        }



        // Listener for 'newNotification'
        const handleNewNotification = (notification) => {
            if (processedNotificationIds.current.has(notification._id)) {
                return;
            }
            processedNotificationIds.current.add(notification._id);

            // Cleanup old IDs to prevent memory leak
            if (processedNotificationIds.current.size > 50) {
                const iterator = processedNotificationIds.current.values();
                processedNotificationIds.current.delete(iterator.next().value);
            }

            // 1. Update Badge Optimistically
            setUnreadCount(prev => {
                return prev + 1;
            });

            // 2. Sync with server 
            // fetchUnreadCount();

            // 3. Show Toast
            setToast(notification);

            // Auto-hide toast after 5s
            setTimeout(() => setToast(null), 5000);
        };

        // Listener for 'notifications_read' 
        const handleRead = (data) => {
            if (data.count !== undefined) {
                setUnreadCount(data.count);
            } else {
                fetchUnreadCount();
            }
        };

        socket.on('newNotification', handleNewNotification);
        socket.on('notifications_read', handleRead);

        return () => {
            socket.off('newNotification', handleNewNotification);
            socket.off('notifications_read', handleRead);
        };
    }, [socket, user]);

    // Initial Load
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            initServiceWorker();
        }
    }, [user]);

    const urlBase64ToUint8Array = (base64String) => {
        if (!base64String || typeof base64String !== 'string') {
            throw new Error('Invalid VAPID public key provided by the server.');
        }

        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeToPush = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const res = await api.get('/notifications/api/push/vapid-public-key');
            const publicKey = res?.data?.publicKey;

            if (!publicKey) {
                showToast("Push notifications are currently unavailable.", "error");
                return false;
            }

            const newSub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey) // Now protected
            });

            await api.post('/notifications/api/push/subscribe', { subscription: newSub });
            setSubscription(newSub);
            setShowPushPrompt(false);
            showToast("Push notifications enabled!", "success");
            return true;
        } catch (e) {
            console.error("Push subscription error:", e);
            showToast(e.message || "Failed to enable push notifications", "error");
            return false;
        }
    };

    const unsubscribeFromPush = async () => {
        if (!subscription) return;
        try {
            // Unsubscribe from backend
            await api.post('/notifications/api/push/unsubscribe', { endpoint: subscription.endpoint });

            // Unsubscribe from browser
            await subscription.unsubscribe();

            setSubscription(null);
            showToast("Push notifications disabled.");
            return true;
        } catch (e) {
            console.error(e);
            showToast("Failed to disable push notifications");
            return false;
        }
    };

    const dismissPrompt = () => {
        setShowPushPrompt(false);
        localStorage.setItem('pushPromptDismissed', new Date().toISOString());
    };

    return (
        <NotificationContext.Provider value={{
            unreadCount,
            subscription,
            subscribeToPush,
            unsubscribeFromPush,
            toast,
            setToast, // Allow manual closing if needed
            showPushPrompt,
            dismissPrompt
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
