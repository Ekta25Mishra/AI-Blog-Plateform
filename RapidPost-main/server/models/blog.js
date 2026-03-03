import mongoose from "mongoose";
import Review from './review.js'

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true }, 
    image: {
         url:String,
         filename:String,
    }, 
    category: { type: String, required: true }, 
    author: { type: Schema.Types.ObjectId, ref: "User" }, 
    avatar: { type: Schema.Types.ObjectId, ref: "User" }, 
    likes: [{ type: Schema.Types.ObjectId, ref: "User" 
    }], 
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], 
    views: { type: Number, default: 69 }, 
    
     
},{timestamps:true})

blogSchema.post("findOneAndDelete",async(blog)=>{
    if(blog){
        await Review.deleteMany({_id: {$in: blog.reviews}})
    }
})

// MIDDLEWARE: After a blog is deleted, remove from user's blogs array
blogSchema.post("findOneAndDelete", async function (blog) {
  if (blog) {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id },
      $inc: { blogCount: -1 }
    });
  }
});

// blogSchema.post("save", async function (blog, next) {
//   try {
    
//       const User = mongoose.model("User");
//       await User.findByIdAndUpdate(blog.author, {
//         $push: { blogs: blog._id },
//         $inc: { blogCount: 1 },
//       });
    
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// When a Blog is deleted
blogSchema.post("findOneAndDelete", async function (blog, next) {
  if (!blog) return next();
  try {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(blog.author, {
      $pull: { blogs: blog._id },
      $inc: { blogCount: -1 },
    });
    next();
  } catch (err) {
    next(err);
  }
});

const Blog = mongoose.model("Blog",blogSchema)

export default Blog