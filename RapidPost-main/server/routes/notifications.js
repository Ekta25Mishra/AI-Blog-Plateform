import express from 'express';
import { isLoggedIn } from '../middleware.js';
import {
    getNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    getUnreadCount
} from '../controllers/notifications.js';
import {
    getUserPreferences,
    updatePreferences,
    renderPreferencesPage
} from '../controllers/notificationPreferences.js';
import {
    getVapidPublicKey,
    subscribeToPush,
    unsubscribeFromPush
} from '../controllers/pushNotifications.js';

const router = express.Router();

// All notification routes require authentication
router.use(isLoggedIn);

// Get notifications page
router.get('/', getNotifications);

// Notification preferences routes
// Notification preferences routes
router.get('/api/preferences', getUserPreferences);
router.post('/api/preferences', updatePreferences);

// API endpoints for notification management
router.get('/api/unread-count', getUnreadCount);
router.post('/api/mark-read', markAsRead);
router.post('/api/mark-all-read', markAllAsRead);
router.delete('/api/:id', deleteNotification);

// Push notification endpoints
router.get('/api/push/vapid-public-key', getVapidPublicKey);
router.post('/api/push/subscribe', subscribeToPush);
router.post('/api/push/unsubscribe', unsubscribeFromPush);

export default router;