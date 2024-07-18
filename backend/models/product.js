const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, 
        enum: ["clothes", "toys", "accessories", "furniture", "food", "health", "grooming", "litter"] 
    },
    subCategory: { type: String, required: true, 
        enum: [
            //clothes
            "costumes", "hats", "socks",
            //toys
            "string toys", "balls", "interactive toys", "catnip toys", "plush toys", "laser pointers",
            //accessories
            "collars", "leashes", "harnesses", "bow ties", "carriers",
            //furniture
            "beds", "trees", "scratching posts", "window perches",
            //food
            "dry food", "wet food", "grain-free food", "dental treats", "catnip",
            //health
            "vitamins", "supplements", "flea prevention", "tick prevention",
            //grooming
            "brushes", "combs", "nail clippers", "shampoos", "conditioners", "ear cleaners", "dental care",
            //litter
            "litter boxes", "litter mats", "litter scoops", "odor control",
        ]
    },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }
});

module.exports = mongoose.model("Product", productSchema);

//categories: accessories, toys, 