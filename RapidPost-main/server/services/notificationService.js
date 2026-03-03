import Notification from '../models/notification.js';
import User from '../models/user.js';
import pushNotificationService from './pushNotificationService.js';

import { getIO } from '../socket.js';

class NotificationService {

    // Create and store notification
    async createNotification(data) {
        try {
            const { recipient, sender, type, message, relatedBlog, relatedComment } = data;

            // Check if recipient has this notification type enabled
            const recipientUser = await User.findById(recipient);
            if (!recipientUser || !this.checkUserPreferences(recipientUser, type)) {
                return null;
            }

            const notification = new Notification({
                recipient,
                sender,
                type,
                message,
                relatedBlog,
                relatedComment
            });

            await notification.save();

            // Populate sender info for real-time delivery
            await notification.populate('sender', 'name username avatar');

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Send real-time notification via WebSocket and Push
    async sendRealTimeNotification(userId, notification) {
        try {
            let io;
            try {
                io = getIO();
            } catch (e) {
                console.warn('[Server] Socket IO not initialized yet');
            }

            // Send WebSocket notification for online users
            if (io) {
                const roomName = `user_${userId}`;
                console.log(`[Server] Emitting newNotification to room: ${roomName}`);

                // Targeted emit
                // Convert Mongoose doc to plain object to ensure clean serialization
                const payload = notification.toObject ? notification.toObject() : notification;



                io.to(roomName).emit('newNotification', payload);
            }

            // Send push notification for offline users
            await pushNotificationService.sendPushNotification(userId, notification);
        } catch (error) {
            console.error('Error sending real-time notification:', error);
        }
    }

    // Get user notifications with pagination
    async getUserNotifications(userId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;

            const notifications = await Notification.find({ recipient: userId })
                .populate('sender', 'name username avatar')
                .populate('relatedBlog', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Notification.countDocuments({ recipient: userId });

            return {
                notifications,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                total
            };
        } catch (error) {
            console.error('Error getting user notifications:', error);
            throw error;
        }
    }

    // Mark notifications as read
    async markAsRead(notificationIds) {
        try {
            await Notification.updateMany(
                { _id: { $in: notificationIds } },
                { isRead: true }
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            throw error;
        }
    }

    // Delete notifications
    async deleteNotifications(notificationIds) {
        try {
            await Notification.deleteMany({ _id: { $in: notificationIds } });
        } catch (error) {
            console.error('Error deleting notifications:', error);
            throw error;
        }
    }

    // Get unread count
    async getUnreadCount(userId) {
        try {
            return await Notification.countDocuments({
                recipient: userId,
                isRead: false
            });
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Check user preferences for notification type
    checkUserPreferences(user, notificationType) {
        if (!user.notificationPreferences) {
            return true; // Default to enabled if no preferences set
        }

        const preferenceMap = {
            'like': 'likes',
            'comment': 'comments',
            'follow': 'follows',
            'new_post': 'newPosts'
        };

        const preferenceKey = preferenceMap[notificationType];
        return preferenceKey ? user.notificationPreferences[preferenceKey] !== false : true;
    }
}

export default new NotificationService();