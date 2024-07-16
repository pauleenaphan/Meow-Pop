const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');

exports.createProduct = async (req, res) =>{
    try{
        const user = req.user;
        console.log("USER", req.user);
        console.log("USER ID ", user.id);
        console.log("USER ID ", req.user.id);

        if(user.role !== "vendor"){
            return res.status(403).send("Cannot create product, you are not a vendor");
        }

        const { name, description, category, subCategory, stock, price, imageUrl, vendor } = req.body;

        const newProduct = new Product({
            name, 
            description,
            category,
            subCategory,
            stock, 
            price,
            imageUrl,
            // vendor: user.id
            vendor
        })

        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(error){
        console.error("Error creating prooduct", error);
        res.status(500).send("Error creating product");
    }
}

//gets specific product 
exports.getProduct = async (req, res) =>{
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

exports.getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find().populate("vendor").exec();

        res.status(200).json(products);
    }catch(error){
        console.error("Error getting all products", error);
        res.status(500).send("Error getting all products ")
    }
}

exports.editProduct = async (req, res) =>{
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

exports.deleteProduct = async (req, res) =>{
    const user = req.user;

    try{
        if(user.role !== "vendor"){
            return res.status(403).send("Cannot create product, you are not a vendor");
        }

        console.log("req params in dp", req.params.id);
        await Product.findByIdAndDelete(req.params.id);

        res.status(204).send("Product has been deleted");
    }catch(error){
        console.error("Error deleting posts", error);
        res.status(500).send("Error Deleting post");
    }
}