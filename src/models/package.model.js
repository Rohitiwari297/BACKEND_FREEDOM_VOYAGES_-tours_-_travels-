import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
    {
        // Relations
        primaryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Primary",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: true,
        },

        // Basic Info
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,

        numberOfDays: {
            type: Number,
            required: true,
        },

        country: String,

        cities: [String], // ["Paris", "Rome"]

        price: {
            type: String,
            required: true,
        },

        // Home Page Settings
        showOnHomePage: {
            type: Boolean,
            default: false,
        },
        homePageOrder: {
            type: Number,
            default: 0,
        },

        // Files
        pdf: String, // URL
        tourPhoto: [String], // URL

        // Flight
        flightDeparture: String,

        // Itinerary (IMPORTANT PART)
        itinerary: [
            {
                day: Number,
                title: String,
                description: String,
            }
        ],

        // Other Sections (rich text)
        priceDetails: String,
        includes: String,
        hotels: String,
        extraOptions: String,

        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        forHomePage: {
            type: Boolean,
            default: false,
        }

    },
    { timestamps: true }
);


const pdfSchema = new mongoose.Schema({

    // THIS PDF IS FOR RECO
    pdfFile: {
        type: String
    }
}, { timestamps: true })

export const Package = mongoose.model("Package", packageSchema);
export const PdfModel = mongoose.model('PdfModel', pdfSchema);