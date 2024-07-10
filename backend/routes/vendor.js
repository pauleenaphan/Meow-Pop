const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authenticateJWT = require("../middleware/authJWT");

router.post("/createVendor", authenticateJWT, vendorController.createVendor);
router.get("/viewVendor/:id", vendorController.viewVendor);
router.put("/editVendor/:id", authenticateJWT, vendorController.editVendor);

module.exports = router;