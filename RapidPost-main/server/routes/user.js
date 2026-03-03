import express from 'express'
import wrapAsync from '../utils/wrapAsync.js'
import User from '../models/user.js'
import passport from 'passport'
import { saveRedirectUrl } from '../middleware.js'
import { SignUp, logIn, logOut, getCurrentUser } from '../controllers/users.js'

const router = express.Router()

router.post("/signup", wrapAsync(SignUp))

router.post("/login", saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            logIn(req, res);
        });
    })(req, res, next);
});

router.get("/current_user", getCurrentUser)

router.get("/logout", logOut)

export default router