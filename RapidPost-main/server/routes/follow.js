import express from "express";
import { toggleFollow, getProfile, updateProfile } from "../controllers/follow.js";
import { isLoggedIn } from "../middleware.js";
import wrapAsync from "../utils/wrapAsync.js";
import { storage } from '../cloudConfig.js'
import multer from 'multer'

const upload = multer({ storage })

const router = express.Router();

// Toggle follow/unfollow
router.post("/:id/follow", isLoggedIn, wrapAsync(toggleFollow));

// Show user profile
router.get("/:id", isLoggedIn, wrapAsync(getProfile));



//update user profile
router.put("/:id", isLoggedIn, upload.single("user[avatar]"), wrapAsync(updateProfile))

export default router;
