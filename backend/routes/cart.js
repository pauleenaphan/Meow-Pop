const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateJWT = require("../middleware/authJWT");

router.post('/addItem/:id', authenticateJWT, cartController.addItem);
router.get('/viewCart', authenticateJWT, cartController.viewCart);
router.patch('/editCart/:id', authenticateJWT, cartController.editCart);
router.delete('/removeItem/:id', authenticateJWT, cartController.removeItem);

module.exports = router;