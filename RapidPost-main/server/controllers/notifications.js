import notificationService from "../services/notificationService.js";

// Get paginated notifications for current user
export const getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await notificationService.getUserNotifications(
            req.user._id,
            page,
            limit
        );

        res.json({
            notifications: result.notifications,
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total
            }
        });
    } catch (error) {
        console.error('Error getting notifications:', error);

        res.status(500).json({ message: "Failed to load notifications" });
    }
};

// Mark specific notifications as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationIds } = req.body;

        if (!notificationIds || !Array.isArray(notificationIds)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid notification IDs'
            });
        }

        await notificationService.markAsRead(notificationIds);

        if (req.io) {
            const unreadCount = await notificationService.getUnreadCount(req.user._id);
            req.io.to(`user_${req.user._id}`).emit('notifications_read', {
                readCount: notificationIds.length,
                count: unreadCount 
            });
        }

        res.json({ success: true, message: 'Notifications marked as read' });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notifications as read'
        });
    }
};

// Delete specific notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        await notificationService.deleteNotifications([id]);

        if (req.io) {
            const unreadCount = await notificationService.getUnreadCount(req.user._id);
            req.io.to(`user_${req.user._id}`).emit('notifications_read', {
                count: unreadCount 
            });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification'
        });
    }
};

// Mark all notifications as read for current user
export const markAllAsRead = async (req, res) => {
    try {
        // Get all unread notification IDs for the user
        const result = await notificationService.getUserNotifications(
            req.user._id,
            1,
            1000 // Get a large number to cover all unread
        );

        const unreadIds = result.notifications
            .filter(notification => !notification.isRead)
            .map(notification => notification._id);

        if (unreadIds.length > 0) {
            await notificationService.markAsRead(unreadIds);
        }

        if (req.io) {
            req.io.to(`user_${req.user._id}`).emit('notifications_read', { count: 0 });
        }

        res.json({
            success: true,
            message: 'All notifications marked as read',
            count: unreadIds.length
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read'
        });
    }
};

// Get unread count for navigation badge
export const getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user._id);

        res.json({ success: true, count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get unread count',
            count: 0
        });
    }
};