const User = require("../models/user");
const Vendor = require("../models/vendor");
const Product = require('../models/product');

//creates vendor's store
exports.createVendor = async (req, res) =>{
    try{
        const user = req.user;

        if(user.role !== "vendor"){
            return res.status(403).send("Cannot create store, you are not a vendor");
        }

        const { storeName, storeDescription, products } = req.body;

        console.log("User in createVendor: ", user); // Debugging line
        console.log("User ID in createVendor: ", user.id); // Debugging line

        const newVendor = new Vendor({
            user: user.id,
            storeName,
            storeDescription,
            products
        })

        await User.findByIdAndUpdate(user.id, { roleId: newVendor._id }, { new: true });

        await newVendor.save();
        res.status(201).json(newVendor);

    }catch(error){
        console.error("Error creating vendor: ", error);
        res.status(500).send('Error creating vendor');
    }
}

//view vendor's store 
exports.viewVendor = async (req, res) =>{
    try{

        const vendorId = req.params.id;
        console.log("VENDOR ID", vendorId);
        const vendor = await Vendor.findById(vendorId).populate("user").populate("products").exec();

        if(!vendor){
            return res.status(404).send("Vendor not found");
        }

        res.status(200).json(vendor);

    }catch(error){
        console.error("Error getting vendor: ", error);
        res.status(500).send('Error viewing vendor');
    }
}

//edit vendor's store
exports.editVendor = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== "vendor") {
            return res.status(403).send("Cannot edit store, you are not a vendor");
        }

        const vendorId = req.params.id;

        //find the vendor store by ID
        const vendor = await Vendor.findById(vendorId);

        //check if the vendor store exists and belongs to the logged-in user
        if (!vendor) {
            return res.status(404).send("Vendor not found");
        }

        //checks if the user's id and storename (set to the user's id) matches 
        if (vendor.user.toString() !== user.id.toString()) {
            // console.log("VENDOR ", vendor.user.toString());
            // console.log("USER ID ", user.id.toString());
            return res.status(403).send("You are not authorized to edit this store");
        }

        const { storeName, storeDescription, products } = req.body;

        //update the vendor store with the provided data
        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { storeName, storeDescription, products },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedVendor);

    } catch (error) {
        console.error("Error editing vendor: ", error);
        res.status(500).send("Error editing vendor");
    }
};
