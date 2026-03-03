import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({ 
comment: { type: String, required: true }, 
author: { type: Schema.Types.ObjectId, ref: "User" },
avatar: { type: Schema.Types.ObjectId, ref: "User" }, 
blog: { type: Schema.Types.ObjectId, ref: "Blog" }, 
likes: [{ type:Schema.Types.ObjectId, ref: "User" }] ,
 
}, { timestamps: true }); 

const Review = mongoose.model('Review', reviewSchema); 
export default Review