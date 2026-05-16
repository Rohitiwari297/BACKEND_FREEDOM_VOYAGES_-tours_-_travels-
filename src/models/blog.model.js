import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        image: {
            type: String, // Path to the uploaded image
            default: "",
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        clientImages: {
            type: [{
                id: String,
                image: String,
            }],
            default: [],
        }
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
