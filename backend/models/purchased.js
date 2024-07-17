const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    purchaseDate: { type: Date, default: Date.now }, 
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, 
        quantity: { type: Number, required: true }, 
        price: { type: Number, required: true } 
    }],
    totalAmount: { type: Number, required: true }, 
    paymentDetails: {
        transactionId: { type: String, required: true }, 
        paymentMethod: { type: String, required: true } 
    },
    shippingAddress: {
        street: { type: String, required: true }, 
        city: { type: String, required: true }, 
        state: { type: String, required: true }, 
        postalCode: { type: String, required: true },
        country: { type: String, required: true } 
    }
});

module.exports = mongoose.model('Purchased', purchasedSchema);
