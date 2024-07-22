const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');
const Cart = require("../models/cart");

exports.addItem = async (req, res) => {

    //todo: add a check to see if the user is adding more than the stock amount
    //currently if i added 5 then added 2, it does not add on
    try {
        const user = req.user;

        //check if the user is authenticated
        if (!user || !['user', 'vendor', 'admin'].includes(user.role)) {
            return res.status(403).send("You must be logged in");
        }

        const { quantity } = req.body;
        const productId = req.params.id;

        //find the user's cart
        console.log("USER'S CART", user.id);
        let cart = await Cart.findOne({ user: user.id });

        //check if the item is already in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            //update quantity if the item is already in the cart
            cart.items[itemIndex].quantity = quantity;
        } else {
            //add new item to the cart
            cart.items.push({ product: productId, quantity });
        }

        //save the cart
        await cart.save();

        res.status(201).json(cart);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send("Error adding item to cart");
    }
};

exports.viewCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the cart for the current user
        const cart = await Cart.findOne({ user: userId }).populate('items.product').exec();

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        // Map over the items to include product details and quantity
        const cartItems = cart.items.map(item => ({
            product: item.product, 
            quantity: item.quantity
        }));

        // Respond with the populated cart and items including quantity
        res.status(200).json({
            user: cart.user,
            items: cartItems
        });
    } catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).send("Error getting cart");
    }
};

exports.editCart = async (req, res) => {
    try{
        //Extract quantity from request body
        const quantity = req.body.quantity;

        //Find the user's cart
        const cart = await Cart.findOne({ user: req.user.id });

        //If cart not found, send 404 response
        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        //Find the item index in the cart's items array
        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.id);

        //If item not found in cart, send 404 response
        if (itemIndex === -1) {
            return res.status(404).send("Item not found in cart");
        }

        //Update the quantity of the item
        cart.items[itemIndex].quantity = quantity;

        //Save the updated cart
        await cart.save();

        //Send updated cart in response
        res.status(200).json(cart);
    }catch(error){
        //Log error and send 500 response
        console.error("Error editing cart:", error);
        res.status(500).send("Error editing cart");
    }
};

exports.removeItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        //find the item index in the cart's items array
        const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.id);

        if (itemIndex === -1) {
            return res.status(404).send("Item not found in cart");
        }

        //remove the item from the cart
        cart.items.splice(itemIndex, 1);

        //save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).send("Error removing item from cart");
    }
};