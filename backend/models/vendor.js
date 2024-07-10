const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema ({
    storeName: { type: String, required: true, unique: true },
    storeDescription: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

module.exports = mongoose.model("Vendor", vendorSchema);