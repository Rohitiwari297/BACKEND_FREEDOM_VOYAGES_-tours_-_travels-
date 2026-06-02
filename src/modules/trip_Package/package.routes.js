import express from "express";
import { isLoggedIn } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/uploadMiddleware.js";
import { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage, getPackedWiseImages, updatePackageImageById, addPackageImageById, deletePackageImageById, addPdf, updatePdf, getPdf } from "./package.controller.js";


const packages = express.Router();

packages.route("/")
    .get(getAllPackages)
    .post(
        // isLoggedIn,
        upload.fields([{ name: "pdf", maxCount: 1 }, { name: "tourPhoto", maxCount: 10 }]),
        createPackage
    );

packages.route('/image')
    .get(getPackedWiseImages);

packages.route('/image/:id')
    .post(upload.single("tourPhoto"), addPackageImageById)
    .patch(
        upload.single('tourPhoto'),
        updatePackageImageById
    )
    .delete(deletePackageImageById);

packages.route("/:id")
    .get(getPackageById)
    .patch(
        upload.fields([{ name: "pdf", maxCount: 1 }, { name: "tourPhoto", maxCount: 10 }]),
        updatePackage
    )
    .delete(deletePackage);


/**
 * ROUTES FOR PDF
 */
packages.route("/add/pfd")
    .post(
        upload.single("pdfFile"),
        addPdf
    )
    .get(
        getPdf
    )

packages.put(
    "/update/pfd/",
    upload.single("pdfFile"),
    updatePdf
);

export default packages;