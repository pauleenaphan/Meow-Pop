const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticateJWT = require("../middleware/authJWT");

router.post('/buyItems/:id', authenticateJWT, purchaseController.buyItems);
router.get('/getAllPurchases', authenticateJWT, purchaseController.getAllPurchases);
router.get('/getPurchase/:id', authenticateJWT, purchaseController.getPurchase);

module.exports = router;