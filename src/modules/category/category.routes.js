import express from "express";
import { isLoggedIn } from "../../middleware/authMiddleware.js";
import { createCategory } from "./category.controller.js";
import upload from "../../middleware/uploadMiddleware.js";

const category = express.Router();

// Admin only
category.route("/create")
    .post(
        isLoggedIn,
        upload.single("image"),
        createCategory
    );

export default category;