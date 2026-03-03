import Blog from "./models/blog.js"
import Review from "./models/review.js"
import { blogSchema, reviewSchema } from './schema.js'
import ExpressError from "./utils/ExpressError.js"
import wrapAsync from "./utils/wrapAsync.js"

export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in" });
    }
    next()
}

export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl

    }
    next()
}

export const isOwner = async (req, res, next) => {
    let { id } = req.params
    let blog = await Blog.findById(id)
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    if (!blog.author.equals(res.locals.currUser._id)) {
        return res.status(403).json({ message: "You are not the author of this blog" });
    }
    next()
}


export const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}

export const validateBlog = (req, res, next) => {
    let { error } = blogSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, errMsg)
    }
    else {
        next()
    }
}

export const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        return res.status(403).json({ message: "You are not the author of this review" });
    }
    next()
}
