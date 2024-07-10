const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchased', purchasedSchema);
