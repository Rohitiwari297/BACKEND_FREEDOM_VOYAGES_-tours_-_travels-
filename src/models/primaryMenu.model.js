import mongoose from "mongoose";

const primarySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
            lowercase: true,
            minlength: [2, "Category name must be at least 2 characters"],
        },
        description: {
            type: String,
            trim: true,
        },
        indexNumber: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Primary = mongoose.model('Primary', primarySchema);
export default Primary;