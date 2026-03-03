import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import ExpressError from '../utils/ExpressError.js'
import { reviewSchema} from '../schema.js'
import Blog from '../models/blog.js'
import Review from '../models/review.js'
import { validateReview,isLoggedIn,isReviewAuthor } from '../middleware.js'
import { createReview,destroyReview, } from '../controllers/reviews.js'

const router = express.Router({mergeParams:true})



//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(destroyReview))


export default router;