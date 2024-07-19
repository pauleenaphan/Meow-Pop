const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateJWT = require("../middleware/authJWT");
const { upload } = require('../middleware/fileUpload');

router.post('/createProduct/:id', authenticateJWT, upload.array('images', 10), productController.createProduct); // maxCount is the maximum number of files
router.get('/getProduct/:id', productController.getProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.patch('/editProduct/:id', authenticateJWT, upload.array('images', 10), productController.editProduct); // Adjust as needed
router.delete('/deleteProduct/:productId/:vendorId', authenticateJWT, productController.deleteProduct);

module.exports = router;
