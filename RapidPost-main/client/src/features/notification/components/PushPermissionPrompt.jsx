import { useNotification } from '@/context/NotificationContext';

const PushPermissionPrompt = () => {
    const { showPushPrompt, subscribeToPush, dismissPrompt } = useNotification();

    if (!showPushPrompt) return null;

    return (
        <div className="alert alert-info alert-dismissible fade show position-fixed"
            style={{ top: '80px', right: '20px', zIndex: 1050, maxWidth: '350px' }}>
            <button type="button" className="btn-close" onClick={dismissPrompt} aria-label="Close"></button>
            <strong>📱 Stay Updated!</strong><br />
            Enable push notifications to get alerts even when you're not on the site.
            <div className="mt-2">
                <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => {
                        Notification.requestPermission().then(perm => {
                            if (perm === 'granted') subscribeToPush();
                            else dismissPrompt();
                        });
                    }}
                >
                    Enable Notifications
                </button>
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={dismissPrompt}
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default PushPermissionPrompt;
