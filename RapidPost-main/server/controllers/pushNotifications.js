import pushNotificationService from '../services/pushNotificationService.js';

// Get VAPID public key for client-side subscription
export const getVapidPublicKey = async (req, res) => {
    try {
        const publicKey = pushNotificationService.getPublicKey();
        res.json({ success: true, publicKey });
    } catch (error) {
        console.error('Error getting VAPID public key:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get public key'
        });
    }
};

// Subscribe to push notifications
export const subscribeToPush = async (req, res) => {
    try {
        const { subscription } = req.body;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscription data'
            });
        }

        await pushNotificationService.savePushSubscription(req.user._id, subscription);

        res.json({
            success: true,
            message: 'Successfully subscribed to push notifications'
        });
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to push notifications'
        });
    }
};

// Unsubscribe from push notifications
export const unsubscribeFromPush = async (req, res) => {
    try {
        const { endpoint } = req.body;

        if (!endpoint) {
            return res.status(400).json({
                success: false,
                message: 'Endpoint is required'
            });
        }

        await pushNotificationService.removePushSubscription(req.user._id, endpoint);

        res.json({
            success: true,
            message: 'Successfully unsubscribed from push notifications'
        });
    } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe from push notifications'
        });
    }
};

// Send test push notification
export const sendTestPush = async (req, res) => {
    try {
        await pushNotificationService.sendTestNotification(req.user._id);

        res.json({
            success: true,
            message: 'Test push notification sent successfully'
        });
    } catch (error) {
        console.error('Error sending test push notification:', error);
        res.status(500).json({
            success: false,
            message: `Push Failed: ${error.message || 'Unknown error'}`
        });
    }
};