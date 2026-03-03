
import { getIO } from '../socket.js';
import Blog from "../models/blog.js";
import notificationService from "../services/notificationService.js";

export const toggleLike = async (req, res) => {

    // Check IO status
    let socketStatus = "Unknown";
    try {
        const io = getIO();
        socketStatus = io ? "Active" : "Null";
    } catch (e) { socketStatus = "Error: " + e.message; }

    let { id } = req.params // blog id
    const userId = req.user._id; // currently logged in user

    const blog = await Blog.findById(id).populate('author', 'name username');

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user already liked
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
        // Unlike
        blog.likes.pull(userId);
    } else {
        // Like
        blog.likes.push(userId);

        // Create notification for blog author (only if not liking own post)
        if (blog.author._id.toString() !== userId.toString()) {
            try {
                const notification = await notificationService.createNotification({
                    recipient: blog.author._id,
                    sender: userId,
                    type: 'like',
                    message: `${req.user.name} liked your blog post "${blog.title}"`,
                    relatedBlog: blog._id
                });

                // Send real-time notification if created
                if (notification) {
                    try {
                        const io = getIO();
                        if (io) {
                            const recipientId = blog.author._id.toString();
                            const roomName = `user_${recipientId}`;

                            // Emit to Target Room
                            // Convert to plain object if needed
                            const payload = notification.toObject ? notification.toObject() : notification;
                            io.to(roomName).emit('newNotification', payload);
                        }
                    } catch (err) {
                        console.error("Socket emit failed in controller", err);
                    }

                    // Still call service for Push Notifications
                    await notificationService.sendRealTimeNotification(
                        blog.author._id,
                        notification
                    );
                }
            } catch (error) {
                console.error('Error creating like notification:', error);

            }
        }
    }

    await blog.save();

    // Emit real-time like update (Broadcast to blog room)
    try {
        const io = getIO();
        if (io) {
            console.log(`[Socket] Broadcasting update_likes globally (blogId: ${blog._id})`);
            io.emit('update_likes', {
                blogId: blog._id,
                likes: blog.likes
            });
        }
    } catch (e) {
        console.error("Socket emit update_likes failed", e);
    }


    res.json({
        message: alreadyLiked ? "Unliked" : "Liked",
        liked: !alreadyLiked,
        likesCount: blog.likes.length,
        debug_req_io: !!req.io,
        debug_socket_io_global: socketStatus,
        debug_room_notification_target: `user_${blog.author._id}`,
        debug_room_blog_target: `blog_${blog._id}`
    });
};

