import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['like', 'comment', 'follow', 'new_post'], 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    relatedBlog: { 
        type: Schema.Types.ObjectId, 
        ref: 'Blog' 
    },
    relatedComment: { 
        type: Schema.Types.ObjectId, 
        ref: 'Review' 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true
});

// Create indexes for performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;