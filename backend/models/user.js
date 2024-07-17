const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user", enum: ['admin', 'user', 'vendor']},
    roleId: { type: String },
    cart: [{ type: Schema.Types.ObjectId, ref: "Cart" }],
    purchases: [{ type: Schema.Types.ObjectId, ref: "Purchase" }]
});

module.exports = mongoose.model('User', userSchema);