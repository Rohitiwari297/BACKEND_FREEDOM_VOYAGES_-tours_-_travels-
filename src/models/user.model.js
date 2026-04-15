import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import config from "../Config/config.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [3, "Name must be at least 3 characters"],
            maxlength: [20, "Name must be at most 20 characters"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            select: false
            // minlength: [3, "Name must be at least 3 characters"],
            // maxlength: [20, "Name must be at most 20 characters"],
        },

        mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
            match: [/^[6-9]\d{9}$/, "Please provide a valid mobile number"],
        },

        avatar: {
            type: String,
            default: "https://via.placeholder.com/150", // default image
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        refreshToken: {
            type: String,
            select: false
        }
    },
    {
        timestamps: true,
    }
);


//instance methods
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: this.role
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '15m'
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
}

const User = mongoose.model("User", userSchema);

export default User;