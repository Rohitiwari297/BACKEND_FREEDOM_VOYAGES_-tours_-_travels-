import express from "express";
import { isLoggedIn } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";
import { createSubCategory, getSubCategory, updateSubCategory } from "./subcategory.controller.js";

const subCategory = express.Router();

// Admin only
subCategory.route("/")
    .post(
        // isLoggedIn,
        upload.single("sliders"),
        createSubCategory
    )
    .get(
        getSubCategory
    );

subCategory.route("/:id")
    .patch(upload.single("sliders"), updateSubCategory);

export default subCategory;