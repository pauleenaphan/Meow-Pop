const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateJWT = require("../middleware/authJWT");

router.post('/createProduct', authenticateJWT, productController.createProduct);
router.get('/getProduct/:id', productController.getProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.patch('/editProduct/:id', authenticateJWT, productController.editProduct);
router.delete('/deleteProduct/:id', authenticateJWT, productController.deleteProduct);

module.exports = router;
