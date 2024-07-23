const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Cart = require('../models/cart'); // Import the Cart model
require('dotenv').config();

//register a new user
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user and cart
        const newUser = new User({ username, email, password: hashedPassword, role: "user" });
        const newCart = new Cart({ user: newUser._id });

        await newCart.save();

        //link the cart to the user
        newUser.cart = newCart._id;
        await newUser.save();

        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //find the user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

        //compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        //object that contains info about the user, this info is encoded into the JWT token
        const payload = { 
            id: user._id, 
            email: user.email, 
            username: user.username, 
            role: user.role, 
            roleId: user.roleId,
            cartId: user.cart
        };

        //token is used for authenticating and authorizing users when they make requests
        //IMPLEMENT TOKEN REFRESHHH!
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.json({ token, role: user.role, roleId: user.roleId, cartId: user.cart });
    } catch (error) {
        res.status(500).send('Server error');
    }
};
