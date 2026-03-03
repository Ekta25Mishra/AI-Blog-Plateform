import { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { useAuth } from '../../../context/AuthContext';

export const useBlogDetails = (id) => {
    const { socket } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await blogService.getById(id);
                const blogData = response.data.blog || response.data;

                setBlog(blogData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog:", err);
                setError('Failed to fetch blog details');
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    useEffect(() => {
        if (socket && id) {
            console.log(`[Socket] Attempting to join blog_${id}`);
            
            // Join blog room
            socket.emit('join_blog', id, (ack) => {
                if (ack) {
                    console.log(`[Socket] Successfully joined blog_${id}`);
                } else {
                    console.warn(`[Socket] Failed to join blog_${id}`);
                }
            });

            const handleNewComment = (newComment) => {
                setBlog(prev => {
                    if (!prev) return prev;
                    if (prev.reviews.some(r => r._id === newComment._id)) return prev;
                    return { ...prev, reviews: [...prev.reviews, newComment] };
                });
            };

            const handleDeleteComment = (reviewId) => {
                setBlog(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        reviews: prev.reviews.filter(r => r._id !== reviewId)
                    };
                });
            };

            const handleUpdateViews = (data) => {
                console.log("[Socket] Received update_views", data);
                if (data.blogId === id) {
                    setBlog(prev => prev ? { ...prev, views: data.views } : prev);
                }
            };

            const handleUpdateLikes = (data) => {
                console.log("[Socket] Received update_likes", data);
                if (data.blogId === id) {
                    setBlog(prev => prev ? { ...prev, likes: data.likes } : prev);
                }
            };

            socket.on('newComment', handleNewComment);
            socket.on('deleteComment', handleDeleteComment);
            socket.on('update_views', handleUpdateViews);
            socket.on('update_likes', handleUpdateLikes);

            return () => {
                socket.emit('leave_blog', id);
                socket.off('newComment', handleNewComment);
                socket.off('deleteComment', handleDeleteComment);
                socket.off('update_views', handleUpdateViews);
                socket.off('update_likes', handleUpdateLikes);
            };
        }
    }, [socket, id]);

    return { blog, setBlog, loading, error };
};
