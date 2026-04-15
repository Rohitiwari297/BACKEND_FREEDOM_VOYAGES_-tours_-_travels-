import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
        },

        primaryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Primary",
            required: [true, 'Primary menu is required']
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