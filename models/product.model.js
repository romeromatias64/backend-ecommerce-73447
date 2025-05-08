const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        required: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);