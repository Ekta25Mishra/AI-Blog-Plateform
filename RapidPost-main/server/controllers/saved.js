// controllers/saved.js
import User from "../models/user.js";
import Blog from "../models/blog.js";

export const toggleSaveBlog = async (req, res) => {
  const userId = req.user._id;
  const { id: blogId } = req.params;

  const user = await User.findById(userId);

  if (!user) return res.status(404).send("User not found");

  const alreadySaved = user.savedBlogs.includes(blogId);

  if (alreadySaved) {
    user.savedBlogs.pull(blogId);
  } else {
    user.savedBlogs.push(blogId);
  }

  await user.save();

  res.json({
    message: alreadySaved ? "Removed from saved" : "Saved",
    saved: !alreadySaved,
    savedBlogs: user.savedBlogs
  });
};

export const getSavedBlogs = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("savedBlogs");


  res.json({ savedBlogs: user.savedBlogs });
};
