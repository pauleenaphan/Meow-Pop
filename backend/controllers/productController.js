const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');

exports.createProduct = async (req, res) => {
    try {
        const user = req.user;
        console.log("PARAMS ID", req.params.id);

        if(user.role !== "vendor"){
            return res.status(403).send("Cannot create product, you are not a vendor");
        }

        const userVendor = await Vendor.findById(req.params.id);
        if(!userVendor){
            return res.status(404).send('Not Found: Vendor does not exist');
        }

        // Extract file URLs from req.files
        const imageUrls = req.files.map(file => file.location);

        const { name, description, category, subCategory, stock, price } = req.body;

        const newProduct = new Product({
            name, 
            description,
            category,
            subCategory,
            stock, 
            price,
            imageUrls, // Store array of URLs
            vendor: req.params.id
        })
        await newProduct.save();

        userVendor.products.push(newProduct._id);
        await userVendor.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).send("Error creating product");
    }
}

// Other methods remain unchanged, if they don’t handle file uploads directly

exports.getProduct = async (req, res) => {
    try{
        const productId = req.params.id;
        
        const product = await Product.findById(productId).populate("vendor").exec();

        if(!product){
            return res.status(404).send("Product not found");
        }

        res.status(200).json(product);
    }catch(error){
        console.error("Error viewing product", error);
        res.status(500).send("Error viewing product");
    }
}

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find().populate("vendor").exec();

        res.status(200).json(products);
    }catch(error){
        console.error("Error getting all products", error);
        res.status(500).send("Error getting all products ")
    }
}

exports.editProduct = async (req, res) => {
    try{
        const user = req.user;

        if(user.role !== "vendor"){
            return res.status(403).send("Cannot create product, you are not a vendor");
        }

        const { name, description, category, subCategory, stock, price, imageUrl } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, category, subCategory, stock, price, imageUrl },
            { new: true } 
        )

        if(!updatedProduct){
            return res.status(404).send("Product not found");
        }

        res.status(200).json(updatedProduct);
    }catch(error){
        console.error("Error editing product", error);
        res.status(500).send("Error editing product");
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { productId, vendorId } = req.params;

        //find the product by ID and delete it
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        //find the vendor by ID
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).send('Vendor not found');
        }

        //remove the product ID from the vendor's products array
        vendor.products = vendor.products.filter(id => id.toString() !== productId);
        await vendor.save();

        res.status(200).send('Product deleted successfully');
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).send("Error deleting product");
    }
};
