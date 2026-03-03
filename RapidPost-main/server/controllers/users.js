import User from "../models/user.js";



export const SignUp = async (req, res) => {
    try {
        let { name, username, email, password } = req.body
        const newUser = new User({ name, email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            res.status(201).json({ message: "Welcome to RapidPost", user: registeredUser });
        })

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}



export const logIn = async (req, res) => {
    res.json({ message: "Welcome back to RapidPost", user: req.user });
}

export const logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        res.json({ message: "You are logged out" });
    })
}

export const getCurrentUser = (req, res) => {
    if (!req.user) return res.json({ user: null });
    res.json({ user: req.user });
}