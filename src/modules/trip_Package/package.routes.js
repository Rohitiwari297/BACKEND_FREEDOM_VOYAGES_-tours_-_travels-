import express from "express";
import { isLoggedIn } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";
import { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage } from "./package.controller.js";


const packages = express.Router();

packages.route("/")
    .get(getAllPackages)
    .post(
        // isLoggedIn,
        upload.fields([{ name: "pdf", maxCount: 1 }, { name: "tourPhoto", maxCount: 1 }]),
        createPackage
    )


packages.route("/:id")
    .get(getPackageById)
    .patch(
        upload.fields([{ name: "pdf", maxCount: 1 }, { name: "tourPhoto", maxCount: 1 }]),
        updatePackage
    )
    .delete(deletePackage);

export default packages;