import express from "express";
import upload from "../../middleware/uploadMiddleware.js";
import { createBlog, getAllBlogs, deleteBlog, updateBlog, addClientImage, deleteClientImage } from "./blog.controller.js";

const blogRouter = express.Router();

blogRouter.route("/")
    .get(getAllBlogs)
    .post(upload.single("image"), createBlog);

blogRouter.route("/:id")
    .delete(deleteBlog)
    .patch(upload.single("image"), updateBlog);

blogRouter.route("/:id/client-images")
    .post(upload.single("image"), addClientImage);

blogRouter.route("/:id/client-images/:imageId")
    .delete(deleteClientImage);

export default blogRouter;
