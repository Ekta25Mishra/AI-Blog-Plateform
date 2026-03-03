// routes/saved.js
import express from "express";
import { toggleSaveBlog, getSavedBlogs } from "../controllers/saved.js";
import { isLoggedIn } from "../middleware.js";
import wrapAsync from '../utils/wrapAsync.js'

const router = express.Router();

router.get("/blogs/saved", isLoggedIn, wrapAsync(getSavedBlogs));
router.post("/blogs/:id/save", isLoggedIn, wrapAsync(toggleSaveBlog));


export default router;
