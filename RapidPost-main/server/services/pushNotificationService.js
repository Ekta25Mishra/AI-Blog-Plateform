import webpush from 'web-push';
import User from '../models/user.js';


class PushNotificationService {
    constructor() {
        // Set VAPID keys (generated for your app)
        const vapidKeys = {
            publicKey: process.env.VAPID_PUBLIC_KEY,
            privateKey: process.env.VAPID_PRIVATE_KEY
        };

        if (
            process.env.VAPID_PUBLIC_KEY &&
            process.env.VAPID_PRIVATE_KEY
        ) {
            webpush.setVapidDetails(
                'mailto:nimishkumar.india111@gmail.com',
                vapidKeys.publicKey,
                vapidKeys.privateKey
            );
        } else {
            console.warn('[Push] VAPID keys missing, push disabled');
        }

        this.publicKey = vapidKeys.publicKey;
    }

    // Get VAPID public key for client-side subscription
    getPublicKey() {
        return this.publicKey;
    }

    // Save push subscription for a user
    async savePushSubscription(userId, subscription) {
        try {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { pushSubscriptions: subscription }
            });
            console.log('Push subscription saved for user:', userId);
        } catch (error) {
            console.error('Error saving push subscription:', error);
            throw error;
        }
    }

    // Remove push subscription for a user
    async removePushSubscription(userId, endpoint) {
        try {
            await User.findByIdAndUpdate(userId, {
                $pull: { pushSubscriptions: { endpoint: endpoint } }
            });
            console.log('Push subscription removed for user:', userId);
        } catch (error) {
            console.error('Error removing push subscription:', error);
            throw error;
        }
    }

    // Send push notification to a user
    async sendPushNotification(userId, notification) {
        try {
            const user = await User.findById(userId);

            if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
                console.log('No push subscriptions found for user:', userId);
                return;
            }

            const payload = JSON.stringify({
                title: this.getNotificationTitle(notification.type),
                body: notification.message,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                data: {
                    notificationId: notification._id,
                    type: notification.type,
                    relatedBlog: notification.relatedBlog,
                    url: this.getNotificationUrl(notification)
                },
                actions: [
                    {
                        action: 'view',
                        title: 'View',
                        icon: '/favicon.ico'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            });

            let successCount = 0;
            let lastError = null;

            // Send to all user's subscriptions
            const pushPromises = user.pushSubscriptions.map(async (subscription) => {
                try {
                    // Mongoose subdocs must be plain objects for webpush
                    const plainSub = typeof subscription.toObject === 'function' ? subscription.toObject() : subscription;

                    await webpush.sendNotification(plainSub, payload);
                    console.log('Push notification sent successfully');
                    successCount++;
                } catch (error) {
                    console.error('Error sending push notification:', error.message || error);
                    lastError = error;

                    // If subscription is invalid/expired, remove it
                    if (error.statusCode === 410 || error.statusCode === 404) {
                        await this.removePushSubscription(userId, subscription.endpoint);
                    }
                }
            });

            await Promise.all(pushPromises);

            if (successCount === 0 && user.pushSubscriptions.length > 0 && lastError) {
                throw new Error(`Push delivery failed: ${lastError.message || lastError}`);
            }

            return { delivered: successCount, total: user.pushSubscriptions.length };
        } catch (error) {
            console.error('Error in sendPushNotification:', error);
            throw error; // Bubble up
        }
    }

    // Get notification title based on type
    getNotificationTitle(type) {
        const titles = {
            'like': '❤️ New Like',
            'comment': '💬 New Comment',
            'follow': '👥 New Follower',
            'new_post': '📝 New Post'
        };
        return titles[type] || '🔔 New Notification';
    }

    // Get notification URL based on type
    getNotificationUrl(notification) {
        if (notification.relatedBlog) {
            return `/blogs/${notification.relatedBlog}`;
        }
        return '/notifications';
    }
}

export default new PushNotificationService();