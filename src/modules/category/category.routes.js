import express from "express";
import { isLoggedIn } from "../../middleware/authMiddleware.js";
import { createCategory, getCategory, updateCategory } from "./category.controller.js";
import upload from "../../middleware/uploadMiddleware.js";

const category = express.Router();

// Admin only
category.route("/")
    .post(
        // isLoggedIn,
        upload.single("sliders"),
        createCategory
    )
    .get(
        getCategory
    );

category.route("/:id")
    .patch(upload.single("sliders"), updateCategory);

export default category;