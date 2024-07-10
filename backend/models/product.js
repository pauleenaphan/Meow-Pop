const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "vendor"}
})

module.exports = mongoose.model("Product", productSchema);