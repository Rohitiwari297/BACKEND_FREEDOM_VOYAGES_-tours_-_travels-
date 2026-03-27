import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
        },

        primary: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null, // parent category
        },

        sequence: {
            type: Number,
            default: 0,
        },

        image: {
            type: String, // Cloudinary URL
            default: "",
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;