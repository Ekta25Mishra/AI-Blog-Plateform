import { Link } from 'react-router-dom';

const BlogCard = ({ blog, highlightedBlogId }) => {
    return (
        <div className="col">
            <div
                className="card blog-card h-100"
                style={blog._id === highlightedBlogId ? { border: '4px solid #9810fa', transform: 'scale(1.02)' } : {}}
            >
                <Link to={`/blogs/${blog._id}`} className="card-link text-decoration-none text-dark">
                    {/* Blog Image */}
                    <img
                        src={blog.image?.url}
                        className="card-img-top"
                        alt={blog.title}
                        loading='lazy'
                        style={{ height: '13rem', objectFit: 'cover' }}
                    />

                    <div className="idx-body card-body">
                        {/* Category */}
                        <span className="badge rounded-pill bg-primary-subtle text-primary fw-semibold mb-2">
                            {blog.category}
                        </span>

                        {/* Title */}
                        <h5 className="card-title">{blog.title}</h5>

                        {/* Short Description */}
                        <p className="card-text">
                            {(blog.description || '')
                                .replace(/<[^>]*>/g, '')
                                .replace(/&nbsp;/g, ' ')
                                .slice(0, 85)}
                            ...
                        </p>

                        {/* Author + Stats */}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={blog.author?.avatar?.url || '/default-avatar.png'}
                                    alt={blog.author?.name}
                                    className="rounded-circle"
                                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                />
                                <div className="d-flex flex-column">
                                    <span className="small fw-medium text-dark">
                                        {blog.author?.name}
                                    </span>
                                    <span className="small text-muted">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 text-muted small">
                                <span className="d-inline-flex align-items-center">
                                    <i className="fa-solid fa-eye me-1" style={{ color: '#818992' }}></i>
                                    {blog.views}
                                </span>
                                <span className="d-inline-flex align-items-center">
                                    <i className="fa-solid fa-heart me-1" style={{ color: '#898f9a' }}></i>
                                    {(blog.likes && blog.likes.length) || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
