import Blog from "../models/blog.js"
import User from "../models/user.js"
import main from "../services/geminiService.js"
import notificationService from "../services/notificationService.js"

//index route
export const index = async (req, res) => {

    const { q, category } = req.query;
    let filter = {};

    // Search filter
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: "i" } },        // case-insensitive match in title
            { description: { $regex: q, $options: "i" } }   // or description
        ];
    }

    // Apply category
    if (category && category !== "All") {
        filter.category = category;
    }


    const allBlogs = await Blog.find(filter).sort({ createdAt: -1 }).populate("author");

    // Get all categories for showing in filter option
    const categories = await Blog.distinct("category");

    res.json({ allBlogs, categories });
}



//show route
export const showBlog = async (req, res, next) => {
    let { id } = req.params;

    // Increment views by 1 automatically when fetching
    const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
    )
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");

    if (!blog) {
        return res.status(404).json({ message: "Blog does not exist" });
    }

    // Emit real-time view update
    try {
        const io = getIO();
        if (io) {
            console.log(`[Socket] Broadcasting update_views globally (blogId: ${id})`);
            io.emit('update_views', {
                blogId: id,
                views: blog.views
            });
        }
    } catch (e) {
        console.error("Socket emit update_views failed", e);
    }

    // Verify socket status for debugging
    const io = getIO();
    const debugInfo = {
        socketActive: !!io,
        roomEmittedTo: `blog_${id}`,
        blogIdType: typeof id
    };

    // Return blog wrapped in object to support debug info without breaking frontend (which checks response.data.blog)
    res.json({ blog, debug: debugInfo });
}




import { getIO } from '../socket.js';

//create route
export const createBlog = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    const user = await User.findById(req.user._id).populate("blogs");
    const newBlog = new Blog(req.body.blog)
    newBlog.author = req.user._id
    newBlog.image = { url, filename }

    await newBlog.save()

    // Populate author immediately for real-time feed
    await newBlog.populate('author');

    // Add the new blog to the user's blogs array
    // const user = await User.findById(req.user._id);
    user.blogs.push(newBlog._id);
    user.blogCount = user.blogs.length; // or user.blogCount += 1;
    await user.save();

    // Emit real-time new blog event (Broadcast to all)
    try {
        const io = getIO();
        if (io) {
            io.emit('newBlog', newBlog);
        } else {
            console.warn("Socket.io not initialized, cannot emit newBlog");
        }
    } catch (e) {
        console.error("Socket emit newBlog failed", e);
    }

    // Create notifications for all followers
    try {
        const followers = user.followers;
        if (followers && followers.length > 0) {
            // Create notifications for all followers in batch
            const notificationPromises = followers.map(async (followerId) => {
                const notification = await notificationService.createNotification({
                    recipient: followerId,
                    sender: req.user._id,
                    type: 'new_post',
                    message: `${req.user.name} published a new blog post "${newBlog.title}"`,
                    relatedBlog: newBlog._id
                });

                // Send real-time notification if created
                if (notification && req.io) {
                    await notificationService.sendRealTimeNotification(
                        followerId,
                        notification,
                        req.io
                    );
                }

                return notification;
            });

            await Promise.all(notificationPromises);
        }
    } catch (error) {
        console.error('Error creating new post notifications:', error);

    }


    res.status(201).json({ message: "New Blog Created!", blog: newBlog });
}



//update route
export const updateBlog = async (req, res) => {
    if (!req.body.blog) {
        throw new ExpressError(400, "Send a valid data for blog")
    }
    let { id } = req.params
    let blog = await Blog.findByIdAndUpdate(id, { ...req.body.blog })
    if (typeof req.file !== "undefined") {
        let url = req.file.path
        let filename = req.file.filename
        blog.image = { url, filename }
        await blog.save()
    }
    res.json({ message: "Blog Updated!", blog });
}

//delete route
export const destroyBlog = async (req, res) => {
    let { id } = req.params
    const blog = await Blog.findById(id)
    const user = await User.findById(req.user._id);
    let deletedBlog = await Blog.findByIdAndDelete(id)
    await user.removeBlog(blog._id);

    // Emit real-time delete blog event (Broadcast to all)
    try {
        const io = getIO();
        if (io) {
            io.emit('deleteBlog', id);
        }
    } catch (e) {
        console.error("Socket emit deleteBlog failed", e);
    }

    res.json({ message: "Blog Deleted!" });
}

// generate with ai
export const generateBlog = async (req, res) => {
    const { prompt, tone, length, format } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt required" });
    }


    try {
        const content = await main(prompt, tone, length, format);

        res.json({ success: true, content });
    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).json({ success: false, error: "Failed to generate content" });
    }

}