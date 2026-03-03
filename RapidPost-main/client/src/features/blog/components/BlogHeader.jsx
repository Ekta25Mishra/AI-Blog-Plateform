import { Link } from 'react-router-dom';

const BlogHeader = ({ blog, user, handleReadAloud, isReading }) => {
    return (
        <header className="mb-4 mb-md-5">
            <div className="mb-3">
                <span className="badge rounded-pill bg-primary text-white px-3 py-2">{blog.category}</span>
            </div>
            <h1 className="fw-bold text-dark display-5 mb-3">{blog.title}</h1>

            {/* Author Info */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                <Link to={user ? `/users/${blog.author?._id}` : '/login'} className="d-flex align-items-center text-decoration-none text-dark">
                    <img
                        src={blog.author?.avatar?.url || '/default-avatar.png'}
                        alt={blog.author?.name}
                        className="rounded-circle me-3"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div>
                        <h3 className="h5 fw-semibold mb-1">{blog.author?.name}</h3>
                        <p className="text-muted mb-0">{blog.author?.bio}</p>
                    </div>
                </Link>
                <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                        {/* Twitter */}
                        <a
                            href={blog.author?.socialLinks?.twitter || "#"}
                            target={blog.author?.socialLinks?.twitter ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={e => !blog.author?.socialLinks?.twitter && e.preventDefault()}
                            className={`socialIcon text-decoration-none ${!blog.author?.socialLinks?.twitter ? 'text-muted ' : 'text-muted hover'}`}
                            style={{ cursor: blog.author?.socialLinks?.twitter ? 'pointer' : 'default' }}
                        >
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href={blog.author?.socialLinks?.linkedin || "#"}
                            target={blog.author?.socialLinks?.linkedin ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={e => !blog.author?.socialLinks?.linkedin && e.preventDefault()}
                            className={`socialIcon text-decoration-none ${!blog.author?.socialLinks?.linkedin ? 'text-muted ' : 'text-muted hover'}`}
                            style={{ cursor: blog.author?.socialLinks?.linkedin ? 'pointer' : 'default' }}
                        >
                            <i className="fa-brands fa-linkedin"></i>
                        </a>

                        {/* GitHub */}
                        <a
                            href={blog.author?.socialLinks?.github || "#"}
                            target={blog.author?.socialLinks?.github ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={e => !blog.author?.socialLinks?.github && e.preventDefault()}
                            className={`socialIcon text-decoration-none ${!blog.author?.socialLinks?.github ? 'text-muted ' : 'text-muted hover'}`}
                            style={{ cursor: blog.author?.socialLinks?.github ? 'pointer' : 'default' }}
                        >
                            <i className="fa-brands fa-square-github"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Blog Meta */}
            <div className="d-flex align-items-center gap-4 text-muted border-bottom pb-3">
                <span className="d-inline-flex align-items-center">
                    <i className="fa-regular fa-calendar me-2"></i>
                    {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="d-inline-flex align-items-center">
                    <i className="fa-solid fa-eye me-2"></i>
                    {Number(blog.views).toLocaleString()} views
                </span>
                <span className="read d-inline-flex align-items-center">
                    <i className="fa-regular fa-clock me-2"></i>
                    5 min read
                </span>
                <span className="d-inline-flex align-items-center ms-auto">
                    <button onClick={handleReadAloud} type="button" className="btnn-decore btn-link text-muted text-decoration-none p-0 d-inline-flex align-items-center">
                        <i className={`fa-solid ${isReading ? 'fa-stop' : 'fa-volume-high'} me-2`}></i>
                        <span>{isReading ? 'Stop' : 'Read'}</span>
                    </button>
                </span>
            </div>
        </header>
    );
};

export default BlogHeader;
