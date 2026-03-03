import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import { isLoggedIn } from '../middleware.js';
import { toggleLike } from '../controllers/likes.js';


const router = express.Router()

router.post("/:id/likes", isLoggedIn, wrapAsync(toggleLike));

export default router