import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileBlogs = ({ user, isMe, handleDeleteBlog, handleSaveBlog }) => {
    const [showAllBlogs, setShowAllBlogs] = useState(false);
    const [showAllSaved, setShowAllSaved] = useState(false);

    // Filter toggle logic
    const visibleBlogs = showAllBlogs ? user.blogs : user.blogs.slice(0, 3);
    const visibleSaved = showAllSaved ? (user.savedBlogs || []) : (user.savedBlogs || []).slice(0, 3);

    return (
        <>
            {/* Blogs Section */}
            <div className="mx-md-5 shadow-lg border-0 rounded-4 py-4 my-5">
                <div className="d-flex text-center justify-content-between">
                    {isMe ? (
                        <>
                            <h1 className="ps-4">Your Blogs</h1>
                            <Link to="/blogs/new" className="btn me-4 px-sm-4" style={{ paddingTop: '0.75rem' }}>
                                <i className="bi bi-plus-lg me-2"></i>Write New Blog
                            </Link>
                        </>
                    ) : (
                        <h1 className="ps-4">All Blogs</h1>
                    )}
                </div>

                {user.blogs.length === 0 && (
                    <div className="text-center mt-3">
                        <Link to="/blogs/new" className="text-decoration-none cursor-pointer">Publish your First Blog</Link>
                    </div>
                )}

                <div id="blogsContainer">
                    {visibleBlogs.map(blog => (
                        <div key={blog._id} className="blog-item border rounded-3 p-3 d-flex flex-column justify-content-between mt-3 mx-4">
                            <div>
                                <Link to={`/blogs/${blog._id}`} className="text-dark cursor-pointer fw-semibold text-decoration-none">{blog.title}</Link>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-1">
                                <div className="text-muted small d-flex gap-3">
                                    <div>
                                        <i className="bi bi-calendar2 me-1"></i>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                    <span title="Views"><i className="bi bi-eye me-1"></i> {blog.views}</span>
                                    <span title="Likes"><i className="bi bi-heart me-1"></i> {blog.likes?.length || 0}</span>
                                    <span title="Comments"><i className="bi bi-chat me-1"></i> {blog.reviews?.length || 0}</span>
                                </div>

                                {isMe && (
                                    <div className="d-flex gap-3">
                                        <Link to={`/blogs/${blog._id}/edit`} className="text-muted"><i className="fa-solid fa-pen-to-square fa-lg edit"></i></Link>
                                        <button onClick={() => handleDeleteBlog(blog._id)} className="btnn-decore p-0 border-0"><i className="fa-solid fa-trash fa-lg delete text-muted"></i></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {user.blogs.length > 3 && (
                    <div className="text-center mt-3">
                        <button onClick={() => setShowAllBlogs(!showAllBlogs)} className="btnn-decore btn-link text-decoration-none cursor-pointer">
                            {showAllBlogs ? 'View Less' : 'View All Blogs'}
                        </button>
                    </div>
                )}
            </div>

            {/* Saved Blogs Section - Only visible to owner */}
            {isMe && (
                <div className="mx-md-5 shadow-lg border-0 rounded-4 py-4 my-5">
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <h2 className="h2 mb-3 mb-md-0 ms-4">Saved Blogs</h2>
                            <div className="d-flex">
                                <button className="btn btn-light border d-flex align-items-center me-4 px-4" >
                                    <i className="bi bi-bookmark-check me-2"></i> Dashboard
                                </button>
                            </div>
                        </div>

                        {(!user.savedBlogs || user.savedBlogs.length === 0) && (
                            <div className="text-center mt-3">
                                <p className="text-center text-primary">You don't have saved Blogs</p>
                            </div>
                        )}

                        <div id="blogsContainer">
                            {visibleSaved.map(blog => (
                                <div key={blog._id} className="blog-item border rounded-3 p-3 d-flex flex-column justify-content-between mt-3 mx-4">
                                    <div>
                                        <Link to={`/blogs/${blog._id}`} className="text-dark cursor-pointer fw-semibold text-decoration-none">{blog.title}</Link>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-1">
                                        <div className="text-muted small d-flex gap-3">
                                            <div>
                                                <i className="bi bi-calendar2 me-1"></i>
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </div>
                                            <span title="Views"><i className="bi bi-eye me-1"></i> {blog.views}</span>
                                            <span title="Likes"><i className="bi bi-heart me-1"></i> {blog.likes?.length || 0}</span>
                                            <span title="Comments"><i className="bi bi-chat me-1"></i> {blog.reviews?.length || 0}</span>
                                        </div>

                                        <div className="d-flex">
                                            <button onClick={() => handleSaveBlog(blog._id)} className="btnn-decore btn-link text-muted text-decoration-none p-0 d-inline-flex align-items-center">
                                                {user.savedBlogs.some(sb => sb === blog._id || sb._id === blog._id) ? (
                                                    <>
                                                        <i className="fa-solid fa-bookmark me-2"></i> Unsave
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fa-regular fa-bookmark me-2"></i> Save
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(user.savedBlogs && user.savedBlogs.length > 3) && (
                            <div className="text-center mt-3">
                                <button onClick={() => setShowAllSaved(!showAllSaved)} className="btnn-decore btn-link text-primary text-decoration-none cursor-pointer">
                                    {showAllSaved ? 'View Less' : 'View All Blogs'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileBlogs;
