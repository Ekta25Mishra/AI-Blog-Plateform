import { useNotification } from '@/context/NotificationContext';
import { useEffect } from 'react';

const NotificationToast = () => {
    const { toast, setToast } = useNotification();

    if (!toast) return null;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
            <div className="toast show align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        <strong>{toast.sender?.name || 'Someone'}</strong><br />
                        {toast.message}
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        onClick={() => setToast(null)}
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;
