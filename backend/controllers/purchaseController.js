const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');
const Cart = require("../models/cart");
const Purchase = require('../models/purchased');

exports.buyItems = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !['user', 'vendor', 'admin'].includes(user.role)) {
            return res.status(403).send("You must be logged in");
        }

        const cartId = req.params.id;
        const { paymentDetails, shippingAddress } = req.body;

        if (!paymentDetails || !shippingAddress) {
            return res.status(400).send("Payment details and shipping address are required");
        }

        const cart = await Cart.findById(cartId).populate('items.product');
        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        if((cart.items).length === 0){
            return res.status(404).send("Cart is empty cannot buy");
        }
        
        const newPurchase = new Purchase({
            userId: req.user.id,
            items: cart.items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            })),
            paymentDetails,
            shippingAddress,
            totalAmount: cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
        });

        const savedPurchase = await newPurchase.save();
        console.log("SAVED PURCHASE", savedPurchase);

        //find the user and add the purchase ID to the user's purchases list
        const userDoc = await User.findById(user.id);
        if (!userDoc) {
            return res.status(404).send("User not found");
        }
        userDoc.purchases.push(savedPurchase._id);
        await userDoc.save();

        // Clear the cart after purchase
        cart.items = [];
        await cart.save();

        res.status(200).json(savedPurchase);

    } catch (error) {
        console.error("Error buying items:", error);
        res.status(500).send("Error buying items");
    }
};

exports.getAllPurchases = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !['user', 'vendor', 'admin'].includes(user.role)) {
            return res.status(403).send("You must be logged in to see your purchases");
        }

        const purchases = await Purchase.find({ userId: user.id }).populate("items.productId").exec();

        res.status(200).json(purchases);
    } catch (error) {
        console.error("Error getting all purchases:", error);
        res.status(500).send("Error getting all purchases");
    }
};

exports.getPurchase = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !['user', 'vendor', 'admin'].includes(user.role)) {
            return res.status(403).send("You must be logged in to see your purchase");
        }

        const purchaseId = req.params.id;
        const purchase = await Purchase.findById(purchaseId).populate("items.productId").exec();

        if (!purchase) {
            return res.status(404).send("Purchase not found");
        }

        // Check if the purchase belongs to the user
        if (purchase.userId.toString() !== user.id.toString()) {
            return res.status(403).send("You are not authorized to view this purchase");
        }

        res.status(200).json(purchase);
    } catch (error) {
        console.error("Error getting purchase:", error);
        res.status(500).send("Error getting purchase");
    }
};
