const jwt = require('jsonwebtoken');
require('dotenv').config();

// Define the test user
const testVendor = {
    _id: '668efc7c7815493960ce9ca7',
    role: 'vendor'
};

// Function to generate a token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generate a token for the test user
const token = generateToken(testVendor);

module.exports = {
    testVendor,
    token
};
