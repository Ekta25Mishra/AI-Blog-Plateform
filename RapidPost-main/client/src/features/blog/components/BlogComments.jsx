import { useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import blogService from '../services/blogService';
import { useToast } from '@/context/ToastContext';

const BlogComments = ({ blog, setBlog, user }) => {
    const { showToast } = useToast();
    const [comment, setComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!user) return showToast("Please login to comment", "error");
        if (!comment.trim()) return;

        setSubmittingComment(true);
        try {
            await blogService.addComment(blog._id, { review: { comment } });
            setComment('');

            const blogRes = await blogService.getById(blog._id);
            setBlog(blogRes.data.blog || blogRes.data);
            showToast("Comment added successfully", "success");

        } catch (err) {
            console.error("Comment error", err);
            showToast("Failed to post comment", "error");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await blogService.deleteComment(blog._id, reviewId);
            setBlog(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r._id !== reviewId)
            }));
            showToast("Comment deleted", "success");
        } catch (err) {
            console.error("Delete comment error", err);
            showToast("Failed to delete comment", "error");
        }
    };

    return (
        <section id="comments" className="mb-5">
            <h3 className="h4 fw-bold text-dark mb-4">Comments</h3>

            {/* Comment Form */}
            {user && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="h6 fw-semibold mb-3">Leave a comment</h4>
                        <form onSubmit={handleSubmitComment}>
                            <div className="mb-3">
                                <textarea
                                    rows="4"
                                    className="form-control"
                                    placeholder="Share your thoughts..."
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <button type="submit" className="mb-1 btn btn-primary" disabled={submittingComment}>
                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comments List */}
            {blog.reviews?.length > 0 && (
                <div className="d-flex flex-column gap-3">
                    {blog.reviews.map((review) => (
                        <div key={review._id} className="card shadow-sm">
                            <div className="card-body position-relative">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <Link to={`/users/${review.author?._id}`} className="text-decoration-none">
                                        <img
                                            src={review.author?.avatar?.url || '/default-avatar.png'}
                                            alt={review.author?.name}
                                            className="rounded-circle"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        />
                                    </Link>
                                    <div>
                                        <h4 className="h6 fw-semibold mb-0">{review.author?.name}</h4>
                                        <p className="small text-muted mb-0">{moment(review.createdAt).format('LL')}</p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-start">
                                    <p className="text-dark mb-3 flex-grow-1">{review.comment}</p>

                                    {user && user._id === review.author?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(review._id)}
                                            className="btnn-decore btn-sm btn-outline-danger ms-2"
                                            title="Delete comment"
                                            style={{ cursor: 'pointer', color: 'red' }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    )}
                                </div>

                                <div className="position-absolute end-0 bottom-0 pe-3 pb-2 text-muted small">
                                    {moment(review.createdAt).fromNow()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default BlogComments;
