import Notification from '../models/notification.js';

class NotificationCleanupService {
    
    // Clean up old read notifications (older than 30 days)
    async cleanupOldNotifications() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const result = await Notification.deleteMany({
                isRead: true,
                createdAt: { $lt: thirtyDaysAgo }
            });
            
            console.log(`Cleaned up ${result.deletedCount} old read notifications`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error cleaning up old notifications:', error);
            throw error;
        }
    }
    
    // Clean up very old unread notifications (older than 90 days)
    async cleanupVeryOldNotifications() {
        try {
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            
            const result = await Notification.deleteMany({
                createdAt: { $lt: ninetyDaysAgo }
            });
            
            console.log(`Cleaned up ${result.deletedCount} very old notifications`);
            return result.deletedCount;
        } catch (error) {
            console.error('Error cleaning up very old notifications:', error);
            throw error;
        }
    }
    
    // Get notification statistics
    async getNotificationStats() {
        try {
            const stats = await Notification.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        unread: { 
                            $sum: { 
                                $cond: [{ $eq: ['$isRead', false] }, 1, 0] 
                            } 
                        },
                        read: { 
                            $sum: { 
                                $cond: [{ $eq: ['$isRead', true] }, 1, 0] 
                            } 
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1,
                        unread: 1,
                        read: 1
                    }
                }
            ]);
            
            return stats[0] || { total: 0, unread: 0, read: 0 };
        } catch (error) {
            console.error('Error getting notification stats:', error);
            throw error;
        }
    }
    
    // Schedule cleanup job (can be called from a cron job)
    async scheduleCleanup() {
        try {
            console.log('Starting notification cleanup job...');
            
            const oldCount = await this.cleanupOldNotifications();
            const veryOldCount = await this.cleanupVeryOldNotifications();
            
            const stats = await this.getNotificationStats();
            
            console.log('Cleanup job completed:', {
                oldNotificationsRemoved: oldCount,
                veryOldNotificationsRemoved: veryOldCount,
                remainingNotifications: stats
            });
            
            return {
                success: true,
                oldNotificationsRemoved: oldCount,
                veryOldNotificationsRemoved: veryOldCount,
                remainingNotifications: stats
            };
        } catch (error) {
            console.error('Cleanup job failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new NotificationCleanupService();