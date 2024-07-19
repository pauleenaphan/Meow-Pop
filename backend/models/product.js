const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ["Clothes", "Toys", "Accessories", "Furniture", "Food", "Health", "Grooming", "Litter"] 
    },
    subCategory: { 
        type: String, 
        required: true, 
        enum: [
            // Clothes
            "Costumes", "Hats", "Socks",
            // Toys
            "String Toys", "Balls", "Interactive Toys", "Catnip Toys", "Plush Toys", "Laser Pointers",
            // Accessories
            "Collars", "Leashes", "Harnesses", "Bow Ties", "Carriers",
            // Furniture
            "Beds", "Trees", "Scratching Posts", "Window Perches",
            // Food
            "Dry Food", "Wet Food", "Grain-Free Food", "Dental Treats", "Catnip",
            // Health
            "Vitamins", "Supplements", "Flea Prevention", "Tick Prevention",
            // Grooming
            "Brushes", "Combs", "Nail Clippers", "Shampoos", "Conditioners", "Ear Cleaners", "Dental Care",
            // Litter
            "Litter Boxes", "Litter Mats", "Litter Scoops", "Odor Control",
        ]
    },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }
});

module.exports = mongoose.model("Product", productSchema);

//categories: accessories, toys, 