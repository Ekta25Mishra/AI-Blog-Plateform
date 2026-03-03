import Review from "../models/review.js";
import Blog from "../models/blog.js"
import notificationService from "../services/notificationService.js";

import { getIO } from '../socket.js';

//create review route
export const createReview = async (req, res) => {

    let blog = await Blog.findById(req.params.id).populate('author', 'name username')

    let newReview = new Review(req.body.review)
    newReview.author = req.user._id

    // Save first to get ID and ensure persistence
    await newReview.save()

    blog.reviews.push(newReview)
    await blog.save()

    // Populate author for real-time display
    await newReview.populate('author', 'name username avatar');

    // Emit real-time comment
    try {
        const io = getIO();
        if (io) {
            io.to(`blog_${blog._id}`).emit('newComment', newReview);
        }
    } catch (e) {
        console.error("Socket emit newComment failed", e);
    }

    // Create notification for blog author (only if not commenting on own post)
    if (blog.author._id.toString() !== req.user._id.toString()) {
        try {
            const commentPreview = req.body.review.comment.length > 50
                ? req.body.review.comment.substring(0, 50) + '...'
                : req.body.review.comment;

            const notification = await notificationService.createNotification({
                recipient: blog.author._id,
                sender: req.user._id,
                type: 'comment',
                message: `${req.user.name} commented on your blog post "${blog.title}": "${commentPreview}"`,
                relatedBlog: blog._id,
                relatedComment: newReview._id
            });

            // Send real-time notification if created
            if (notification) {
                await notificationService.sendRealTimeNotification(
                    blog.author._id,
                    notification
                );
            }
        } catch (error) {
            console.error('Error creating comment notification:', error);
            // Don't break the comment functionality if notification fails
        }
    }


    res.status(201).json({ message: "Review Added!", review: newReview });
}

//delete review route
export const destroyReview = async (req, res) => {
    let { id, reviewId } = req.params
    await Blog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)

    // Emit real-time delete
    try {
        const io = getIO();
        if (io) {
            io.to(`blog_${id}`).emit('deleteComment', reviewId);
        }
    } catch (e) {
        console.error("Socket emit deleteComment failed", e);
    }


    res.json({ message: "Review Deleted!", reviewId });
}

