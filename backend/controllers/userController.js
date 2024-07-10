const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//register a new user
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        //checks if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creates a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send(error);
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

    //object that contains info about the user, this info is encoded into the jwt token
    const payload = { id: user._id, email: user.email, username: user.username, role: user.role };

    //token is used for authenticating and authorizing users when they make request
    //ensures that request to the server are from authenticated users
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
    res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).send('Server error');
    }
};