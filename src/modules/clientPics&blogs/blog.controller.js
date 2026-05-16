import fs from "fs";
import path from "path";
import Blog from "../../models/blog.model.js";
import AsyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";

export const createBlog = AsyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
        throw new ApiError(400, "Title, description, and category are required");
    }

    let imageUrl = "";
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
        title,
        description,
        category,
        image: imageUrl,
    });

    res.status(201).json(
        new ApiResponse(201, "Blog created successfully", blog)
    );
});

export const getAllBlogs = AsyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, "Blogs retrieved successfully", blogs)
    );
});

export const deleteBlog = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    // Delete image file if it exists
    if (blog.image) {
        const imagePath = path.join(process.cwd(), "src", blog.image.replace("/uploads/", "uploads/"));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, "Blog deleted successfully")
    );
});

export const updateBlog = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) blog.category = category;

    if (req.file) {
        // Delete old image
        if (blog.image) {
            const oldImagePath = path.join(process.cwd(), "src", blog.image.replace("/uploads/", "uploads/"));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        blog.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();

    res.status(200).json(
        new ApiResponse(200, "Blog updated successfully", updatedBlog)
    );
});

export const addClientImage = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        throw new ApiError(400, "Client image is required");
    }

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const newImage = {
        id: new Date().getTime().toString(), // Using timestamp as a simple ID
        image: `/uploads/${req.file.filename}`
    };

    blog.clientImages.push(newImage);
    await blog.save();

    res.status(200).json(
        new ApiResponse(200, "Client image added successfully", newImage)
    );
});

export const deleteClientImage = AsyncHandler(async (req, res) => {
    const { id, imageId } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const imageIndex = blog.clientImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
        throw new ApiError(404, "Client image not found");
    }

    const imagePath = blog.clientImages[imageIndex].image;

    // Remove from array
    blog.clientImages.splice(imageIndex, 1);
    await blog.save();

    // Delete file
    if (imagePath) {
        const fullPath = path.join(process.cwd(), "src", imagePath.replace("/uploads/", "uploads/"));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }

    res.status(200).json(
        new ApiResponse(200, "Client image deleted successfully")
    );
});
