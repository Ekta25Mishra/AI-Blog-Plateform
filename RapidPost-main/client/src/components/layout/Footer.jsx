import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-light text-dark mt-5">
            <div className="container py-5">
                <div className="row g-4">
                    {/* Brand */}
                    <div className="col-12 col-md-6">
                        <div className="d-flex align-items-center mb-3">
                            <i className="fa-solid fa-bolt fa-2xl me-2" style={{ color: '#9810fa' }}></i>
                            <span className="fs-3 fw-bold">RapidPost</span>
                        </div>
                        <p className="text-muted mb-3">
                            The next-generation blogging platform powered by AI. Create, discover, and engage with intelligent content.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className=" socialIcon text-muted" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
                                <i className="fa-brands fa-x-twitter"></i>
                            </a>
                            <a href="#" className=" socialIcon text-muted" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
                                <i className="fa-brands fa-square-facebook"></i>
                            </a>
                            <a href="#" className="socialIcon text-muted" aria-label="Instagram" onClick={(e) => e.preventDefault()}>
                                <i className="fa-brands fa-square-instagram"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/nimishkumar07" target="_blank" rel="noreferrer" className="socialIcon text-muted" aria-label="LinkedIn">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-md-3">
                        <h3 className="h6 fw-semibold mb-3">Quick Links</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link className="li text-decoration-none text-dark" to="/blogs">Home</Link></li>
                            <li className="mb-2"><Link className="li text-decoration-none text-dark" to="/blogs">All Blogs</Link></li>
                            <li className="mb-2"><Link className="li text-decoration-none text-dark" to="/blogs/new">Write Blog</Link></li>
                            <li className="mb-2"><a className="li text-decoration-none text-dark" href="#" onClick={(e) => e.preventDefault()}>Dashboard</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="col-6 col-md-3">
                        <h3 className="h6 fw-semibold mb-3">Support</h3>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a className="li text-decoration-none text-dark" href="#" onClick={(e) => e.preventDefault()}>Help Center</a></li>
                            <li className="mb-2"><a className="li text-decoration-none text-dark" href="#" onClick={(e) => e.preventDefault()}>Contact Us</a></li>
                            <li className="mb-2"><a className="li text-decoration-none text-dark" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                            <li className="mb-2"><a className="li text-decoration-none text-dark" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-top mt-4 pt-4 text-center">
                    <p className="text-muted mb-0">© {new Date().getFullYear()} RapidPost. All rights reserved. Powered by AI technology.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
