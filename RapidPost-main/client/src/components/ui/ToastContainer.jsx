import { useToast } from '../../context/ToastContext';

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1060 }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast show align-items-center text-white bg-${toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'success' : 'primary'} border-0 mb-2`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="d-flex">
                        <div className="toast-body">
                            {toast.message}
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close"
                        ></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
