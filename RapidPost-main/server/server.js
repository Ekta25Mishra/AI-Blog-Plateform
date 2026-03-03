if (process.env.NODE_ENV != "production") {
    'dotenv/config'
}

import 'dotenv/config'
import express from 'express'
const app = express()
import { createServer } from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import methodOverride from 'method-override'
import blogRouter from './routes/blog.js'
import reviewRouter from './routes/review.js'
import userRouter from "./routes/user.js"
import likeRouter from './routes/like.js'
import savedRouter from "./routes/saved.js";
import followRouter from './routes/follow.js'
import notificationRouter from './routes/notifications.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from './models/user.js'

import moment from 'moment'
import { storage } from './cloudConfig.js'

// Create HTTP server and Socket.io instance
const server = createServer(app)
import { initSocket } from './socket.js'
const io = initSocket(server)

const dbUrl = process.env.ATLASDB_URL

const upload = multer({ storage })

main()
    .then(() => {
        console.log("connected to DB")
    }).catch((err) => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dbUrl)
}


import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//middlewares
app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://rapidpost.live",
        "https://www.rapidpost.live"
    ],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

app.locals.moment = moment


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true, // Required when behind Nginx / Cloudflare proxy
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // Secure and SameSite are critically important for cross-site (Vercel -> Render) cookies
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
}

app.get('/', (req, res) => {
    res.send("Hi, I am root")
})

app.set('trust proxy', 1); // Trust the proxy (Render load balancer)
app.use(session(sessionOption))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    req.io = io // Make io available in all routes
    next()
})

// DEBUG: Global Request Logger
app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.path}`);
    next();
});



app.use("/blogs/:id/reviews", reviewRouter)
app.use("/blogs", blogRouter)
app.use("/blogs", likeRouter)
app.use("/", userRouter)
app.use("/", savedRouter)
app.use("/users", followRouter)
app.use("/notifications", notificationRouter)


app.use((err, req, res, next) => {
    let { statusCode = 404, message = "Something went wrong" } = err
    res.status(statusCode).send(message)

})



// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.emit('welcome', `Hello ${socket.id}`);

    // Handle user authentication and room joining
    socket.on('authenticate', (userId) => {
        try {
            if (userId && typeof userId === 'string') {
                socket.join(`user_${userId}`);
                socket.userId = userId; // Store userId on socket for later use
                console.log(`User ${userId} joined their notification room`);
                socket.emit('room_joined', `user_${userId}`);
            } else {
                console.warn('Invalid userId provided for authentication:', userId);
            }
        } catch (error) {
            console.error('Error during socket authentication:', error);
        }
    });

    // Handle joining blog post rooms for real-time comments
    socket.on('join_blog', (blogId) => {
        if (blogId) {
            const roomName = `blog_${blogId}`;
            socket.join(roomName);
            console.log(`[Socket] ${socket.id} joined room ${roomName} (blogId type: ${typeof blogId})`);
        } else {
            console.warn(`[Socket] ${socket.id} attempted to join blog with null/undefined ID`);
        }
    });

    socket.on('leave_blog', (blogId) => {
        if (blogId) {
            const roomName = `blog_${blogId}`;
            socket.leave(roomName);
            console.log(`[Socket] ${socket.id} left room ${roomName}`);
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('User disconnected:', socket.id, 'Reason:', reason);
        if (socket.userId) {
            console.log(`User ${socket.userId} left their notification room`);
        }
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });
});

const PORT = process.env.PORT || 8080

import notificationCleanupService from './services/notificationCleanup.js';


server.listen(PORT, () => {
    console.log("server is running on " + PORT)

    // Schedule notification cleanup to run once a day (24 hours)
    setInterval(() => {
        notificationCleanupService.scheduleCleanup()
            .catch(err => console.error("Notification cleanup failed", err));
    }, 24 * 60 * 60 * 1000);

    // Run once on startup to clean old data immediately
    // notificationCleanupService.scheduleCleanup(); 
})

export { app, io };