/* eslint-disable no-undef, no-unused-vars */
// Service Worker for Push Notifications

const CACHE_NAME = 'rapidpost-notifications-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);

    if (!event.data) {
        console.log('Push event but no data');
        return;
    }

    try {
        const data = event.data.json();
        console.log('Push data:', data);

        const options = {
            body: data.body,
            icon: data.icon || '/favicon.ico',
            badge: data.badge || '/favicon.ico',
            data: data.data,
            actions: data.actions || [],
            requireInteraction: true,
            tag: data.data?.notificationId || 'default'
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    } catch (error) {
        console.error('Error handling push event:', error);
    }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);

    event.notification.close();

    const data = event.notification.data;
    let url = '/notifications'; // Default URL

    // Handle action clicks
    if (event.action === 'view' && data?.url) {
        url = data.url;
    } else if (event.action === 'dismiss') {
        return; // Just close the notification
    } else if (data?.url) {
        url = data.url;
    }

    // Open or focus the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin)) {
                        // Focus existing window and navigate
                        client.focus();
                        client.postMessage({
                            type: 'NOTIFICATION_CLICK',
                            url: url,
                            notificationData: data
                        });
                        return;
                    }
                }

                // Open new window
                return clients.openWindow(self.location.origin + url);
            })
    );
});

// Background sync (optional - for offline functionality)
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);

    if (event.tag === 'notification-sync') {
        event.waitUntil(
            // Handle background sync for notifications
            syncNotifications()
        );
    }
});

// Sync notifications when back online
async function syncNotifications() {
    try {
        // This could fetch missed notifications when back online
        console.log('Syncing notifications...');
    } catch (error) {
        console.error('Error syncing notifications:', error);
    }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
