import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import ExpressError from '../utils/ExpressError.js'
import Blog from '../models/blog.js'
import { isLoggedIn, isOwner } from '../middleware.js'
import { validateBlog } from '../middleware.js'
import { index, createBlog, showBlog, updateBlog, destroyBlog, generateBlog } from '../controllers/blogs.js'
import multer from 'multer'
import { storage } from '../cloudConfig.js'
const upload = multer({ storage })

const router = express.Router()


//Index route
router.get("/", wrapAsync(index))



//show route
router.get("/:id", wrapAsync(showBlog))

//increment view
//increment view route removed (handled in show)

//create route
router.post("/", isLoggedIn, upload.single("blog[image]"), validateBlog, wrapAsync(createBlog))



//update route
router.put("/:id", isLoggedIn, isOwner, upload.single("blog[image]"), validateBlog, wrapAsync(updateBlog))

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(destroyBlog))

//generate with ai
router.post('/ai/generate', isLoggedIn, wrapAsync(generateBlog))

export default router