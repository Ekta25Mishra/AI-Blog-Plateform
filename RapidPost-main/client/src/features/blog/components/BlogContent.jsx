
const BlogContent = ({ blog, user, isLiked, handleLike, handleShare, handleSave }) => {
    return (
        <>
            {/* Featured Image */}
            <div className="mb-4 mb-md-5">
                <img
                    src={blog.image?.url}
                    alt={blog.title}
                    className="img-fluid rounded-4"
                    style={{ height: 'auto', maxHeight: '28rem', width: '100%', objectFit: 'cover' }}
                />
            </div>

            {/* Blog Content */}
            <div className="mb-4 mb-md-5">
                <div className="mx-auto" style={{ maxWidth: '48rem' }}>
                    <div className="rich-text" dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                </div>
            </div>

            {/* Engagement Actions */}
            <div className="d-flex align-items-center justify-content-between border-top border-bottom py-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                    {/* Likes */}
                    <button onClick={handleLike} className="btnn-decore btn-link text-decoration-none text-muted p-0 d-inline-flex align-items-center">
                        {isLiked ? (
                            <i className="fa-solid fa-heart me-2" style={{ color: 'red' }}></i>
                        ) : (
                            <i className="fa-regular fa-heart me-2"></i>
                        )}
                        <span>{typeof blog.likes === 'number' ? blog.likes : (blog.likes?.length || 0)}</span>
                    </button>

                    <a href="#comments" className="text-muted text-decoration-none d-inline-flex align-items-center">
                        <i className="fa-solid fa-comment me-2"></i>
                        <span>{blog.reviews?.length || 0}</span>
                    </a>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button onClick={handleShare} type="button" className="btnn-decore btn-link text-muted text-decoration-none p-0 d-inline-flex align-items-center">
                        <i className="fa-solid fa-share-nodes me-2"></i>
                        Share
                    </button>
                    {user && blog.author?._id !== user._id && (
                        <button onClick={handleSave} className="btnn-decore btn-link text-muted text-decoration-none p-0 d-inline-flex align-items-center">
                            {user.savedBlogs?.includes(blog._id) ? (
                                <>
                                    <i className="fa-solid fa-bookmark me-2"></i> Unsave
                                </>
                            ) : (
                                <>
                                    <i className="fa-regular fa-bookmark me-2"></i> Save
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default BlogContent;
