import User from "../models/user.js";
import notificationService from "../services/notificationService.js";
import ExpressError from "../utils/ExpressError.js";

// Toggle follow/unfollow
export const toggleFollow = async (req, res) => {
  
  const currentUserId = req.user._id;
  const targetUserId = req.params.id;

  if (currentUserId.toString() === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadyFollowing = currentUser.following.includes(targetUserId);

  if (alreadyFollowing) {
    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    // Create follow notification
    try {
      const notification = await notificationService.createNotification({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
        message: `${req.user.name} started following you`
      });

      // Send real-time notification if created
      if (notification && req.io) {
        await notificationService.sendRealTimeNotification(
          targetUserId,
          notification,
          req.io
        );
      }
    } catch (error) {
      console.error('Error creating follow notification:', error);
    }
  }

  await currentUser.save();
  await targetUser.save();

  res.json({
    message: alreadyFollowing ? "Unfollowed" : "Followed",
    following: !alreadyFollowing,
    followersCount: targetUser.followers.length
  });
};


// Get user profile page
export const getProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)
    .populate("followers", "username")
    .populate("following", "username")
    .populate({
      path: "blogs",
      populate: [
        { path: "reviews" }, // to count comments
        { path: "likes" }    // to count likes
      ]
    })
    .populate("savedBlogs")

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Analytics 
  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;

  user.blogs.forEach(blog => {
    totalViews += blog.views || 0;
    totalLikes += blog.likes ? blog.likes.length : 0;
    totalComments += blog.reviews ? blog.reviews.length : 0;
  });

  const currentUser = req.user; // logged-in user

  res.json({
    user,
    currentUser,
    stats: {
      followersCount: user.followers.length,
      followingCount: user.following.length,
      totalViews,
      totalLikes,
      totalComments
    }
  });
};


export const updateProfile = async (req, res, next) => {
  if (!req.body.user) {
    throw new ExpressError(400, "Send a valid data for user")
  }
  let { id } = req.params
  let user = await User.findByIdAndUpdate(id, {
    ...req.body.user, socialLinks: { ...req.body.socialLinks }
  }, { new: true }
  )

  if (typeof req.file !== "undefined") {
    let url = req.file.path
    let filename = req.file.filename
    user.avatar = { url, filename }
    user = await user.save()
  }

  // Re-login the user to ensure session stays valid if username changed
  req.login(user, (err) => {
    if (err) return next(err);
    res.json({ message: "Profile updated", user });
  });

}
