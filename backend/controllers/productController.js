const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');

const uploadToS3 = require('../middleware/s3Service');

exports.createProduct = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== "vendor") {
            return res.status(403).send("Cannot create product, you are not a vendor");
        }

        const userVendor = await Vendor.findById(req.params.id);
        if (!userVendor) {
            return res.status(404).send('Not Found: Vendor does not exist');
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).send("No files uploaded.");
        }

        console.log("Files to upload:", files);

        const uploadedFiles = await uploadToS3(files);
        console.log("Uploaded files:", uploadedFiles);

        const imageUrls = uploadedFiles.map(file => file.Location);

        const { name, description, category, subCategory, stock, price } = req.body;

        const newProduct = new Product({
            name,
            description,
            category,
            subCategory,
            stock,
            price,
            imageUrls,
            vendor: req.params.id
        });
        await newProduct.save();

        userVendor.products.push(newProduct._id);
        await userVendor.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).send("Error creating product");
    }
};

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
    try {
        const user = req.user;

        if (user.role !== "vendor") {
            return res.status(403).send("Cannot edit product, you are not a vendor");
        }

        // Find the existing product
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Extract the existing image URLs from the request body
        let existingUrls = [];
        if (req.body.existingUrls) {
            existingUrls = JSON.parse(req.body.existingUrls);
        }

        // Check if files were uploaded
        const files = req.files;
        let newImageUrls = [];

        if (files && files.length > 0) {
            // Upload files to S3
            const uploadedFiles = await uploadToS3(files);

            // Get the S3 URLs of uploaded images
            newImageUrls = uploadedFiles.map(file => file.Location);
        }

        // Combine existing image URLs and new image URLs
        const imageUrls = [...existingUrls, ...newImageUrls];

        // Extract other product details from request body
        const { name, description, category, subCategory, stock, price } = req.body;

        // Update product details
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: name || product.name,
                description: description || product.description,
                category: category || product.category,
                subCategory: subCategory || product.subCategory,
                stock: stock || product.stock,
                price: price || product.price,
                imageUrls: imageUrls.length > 0 ? imageUrls : product.imageUrls // Update only if new images are provided
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error editing product", error);
        res.status(500).send("Error editing product");
    }
};




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
