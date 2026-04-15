import mongoose from "mongoose";

const subCategory = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sub category name is required!'],
        trim: true,
    },

    primaryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Primary',
        required: [true, 'Primary is required']
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },

    sequence: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

const Subcategory = mongoose.model('Subcategory', subCategory);
export default Subcategory;