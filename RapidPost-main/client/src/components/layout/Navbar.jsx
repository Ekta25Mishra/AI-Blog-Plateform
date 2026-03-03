import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';


const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotification();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (


        <nav className="py-3 mb-4 navbar navbar-expand-md bg-body-light shadow border-bottom sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/blogs" onClick={scrollToTop}>
                    <i className="fa-solid fa-bolt fa-lg me-2" style={{ color: '#9810fa' }}></i>
                    <span className="rapidPost fw-bold">RapidPost</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse navDrop" id="navbarNav">
                    <div className="navbar-nav ms-auto">
                        <Link className="nav-link ms-2" to="/blogs" onClick={scrollToTop}>Home</Link>
                        <Link className="nav-link ms-2" to="/blogs/new">Write</Link>

                        {user ? (
                            <>
                                <Link className="nav-link ms-2" to={`/users/${user._id}`}>Profile</Link>
                                {/* Notification Bell */}
                                <div className="nav-item dropdown mt-2 ms-2 me-3">
                                    <Link className="nav-link position-relative pe-0 pt-0" to="/notifications" id="notificationBell">
                                        <i className="bi bi-bell fs-5"></i>
                                        {unreadCount > 0 && (
                                            <span id="notificationBadge"
                                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                                <button className="nav-link ms-2 btn px-3 border-0 bg-transparent" onClick={logout}>LogOut</button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link ms-2" to="/login">Profile</Link>
                                <Link className="nav-link ms-2 btn px-3" to="/login">LogIn</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
