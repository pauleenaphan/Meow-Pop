/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, ChangeEvent, useEffect, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';
import Modal from '../components/Modal';
import "../styles/account.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBill, faClockRotateLeft, faGear } from '@fortawesome/free-solid-svg-icons';

export const Account = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const vendorId = localStorage.getItem("userRoleId");
    const userRole = localStorage.getItem("userRole");
    const [newProductModal, setNewProductModal] = useState<boolean>(false);
    const [editVendorModal, setEditVendorModal] = useState<boolean>(false);
    const [editProductModal, setEditProductModal] = useState<boolean>(false);
    const [currProduct, setCurrProduct] = useState<{
        id: string,
        name: string, 
        description: string,
        category: string,
        subCategory: string,
        stock: number,
        price: number,
        imageUrls: (string | File)[]
    }>({
        id: "",
        name: "",
        description: "",
        category: "",
        subCategory: "",
        stock: 0,
        price: 0,
        imageUrls: []
    })

    const updateCurrProduct = (postField: keyof typeof currProduct, userInput: string) =>{
        setCurrProduct(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

    const [currContent, setCurrContent] = useState<string>("profile");
    const [vendorInfo, setVendorInfo] = useState<{
        user: { _id: string; username: string; email: string };
        storeName: string;
        storeDescription: string;
        products: { _id: string; name: number; description: string; category: string; 
                subCategory: string; stock: number; price: string; imageUrls: string[] }[]; 
    }>({
        user: { _id: "", username: "", email: "" },
        storeName: "",
        storeDescription: "",
        products: []
    });

    const editVendor = (postField: keyof typeof vendorInfo, userInput: string) => {
        setVendorInfo(prevData => ({
            ...prevData,
            [postField]: userInput
        }));
    };

    const [newVendor, setNewVendor] = useState<{ name: string; description: string }>({
        name: "",
        description: ""
    });

    const updateVendor = (postField: keyof typeof newVendor, userInput: string) => {
        setNewVendor(prevData => ({
            ...prevData,
            [postField]: userInput
        }));
    };

    //new product forms
    const [categories] = useState<[string, string[]][]>([
        ["Clothes", ["Costumes", "Hats", "Socks"]],
        ["Toys", ["String Toys", "Balls", "Catnip Toys", "Plush Toys", "Laser Pointers"]],
        ["Accessories", ["Collars", "Leashes", "Harnesses", "Bow Ties", "Carriers"]],
        ["Furniture", ["Beds", "Trees", "Scratching Posts", "Window Perches"]],
        ["Food", ["Dry Food", "Wet Food", "Grain-Free Food", "Dental Treats", "Catnip"]],
        ["Health", ["Vitamins", "Supplements", "Flea Prevention", "Tick Prevention"]],
        ["Grooming", ["Brushes", "Combs", "Nail Clippers", "Shampoos", "Conditioners", "Ear Cleaners", "Dental Care"]],
        ["Litter", ["Litter Boxes", "Litter Mats", "Litter Scoops", "Odor Control"]]
    ]);

    const [newProduct, setNewProduct] = useState<{
        name: string;
        description: string;
        category: string;
        subCategory: string;
        stock: number;
        price: number;
        imageUrls: File[];
    }>({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        stock: 0,
        price: 0,
        imageUrls: []
    });

    const updateProduct = (postField: keyof typeof newProduct, userInput: string | number | File[] | null) => {
        setNewProduct(prevData => ({
            ...prevData,
            [postField]: userInput
        }));
    };

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        setSelectedCategory(category); //updates selected category with the chosen one
        updateProduct("category", category);
        updateCurrProduct("category", category);

        const selectedCategory = categories.find(([cat]) => cat === category);
        setSubCategories(selectedCategory ? selectedCategory[1] : []);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files || []);
    
            // Update imageUrls state
            setNewProduct(prevProduct => ({
                ...prevProduct,
                imageUrls: [...prevProduct.imageUrls, ...files]
            }));

            setCurrProduct(prevProduct => ({
                ...prevProduct,
                imageUrls: [...prevProduct.imageUrls, ...files]
            }));
    

            // Generate previews for new files
            const newPreviews = files.map(file => URL.createObjectURL(file));
            
            // Update imagePreviews state
            setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        } else {
            console.warn('No files selected.');
        }
    };

    const getImageUrl = (image: string | File): string => {
        if (typeof image === "string") {
            return image;
        } else {
            return URL.createObjectURL(image);
        }
    };
    
    //removes current image when user is uploading their images 
    const removeImagePreview = (index: number) => {
        setImagePreviews(prevPreviews => {
            //creates shallow copy of array to avoid changing it directly
            const newPreviews = [...prevPreviews];
            URL.revokeObjectURL(newPreviews[index]);

            //removes img at specific index
            newPreviews.splice(index, 1);

            //returns updated array
            return newPreviews;
        });
    
        //remove the corresponding image file from newProduct
        setNewProduct(prevProduct => {
            const newFiles = [...prevProduct.imageUrls];
            newFiles.splice(index, 1);

            //return updated newProduct object includign modified imgURL array
            return {
                ...prevProduct,
                imageUrls: newFiles
            };
        });
    };

    const createVendor = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        const { name, description } = newVendor;
        try {
            const response = await fetch(`http://localhost:3001/vendor/createVendor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ storeName: name, storeDescription: description }),
            });
            if (response.ok) {
                alert("Thank you for submitting your request! Please login again to check your status");
                navigate("/login");
                localStorage.setItem("isLogged", "false");
            }
        } catch (error) {
            console.error("Error creating vendor", error);
        }
    };

    const viewVendor = async () => {
        try {
            const response = await fetch(`http://localhost:3001/vendor/viewVendor/${vendorId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            const data = await response.json();
            setVendorInfo({
                user: data.user,
                storeName: data.storeName,
                storeDescription: data.storeDescription,
                products: data.products
            });
        } catch (error) {
            console.error("Error getting specific vendor", error);
        }
    };

    const editVendorFunc = async (event: React.FormEvent) =>{
        event.preventDefault();
        const { storeName, storeDescription } = vendorInfo;
        try{
            const response = await fetch(`http://localhost:3001/vendor/editVendor/${vendorId}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors",
                body: JSON.stringify({ storeName, storeDescription })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
            
            alert("Vendor has been edited");
            viewVendor();
        }catch(error){
            console.error("Error editing vendor");
        }
        setEditVendorModal(false);
    }

    const createProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        const { name, description, category, subCategory, stock, price, imageUrls } = newProduct;
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('stock', stock.toString());
        formData.append('price', price.toString());
    
        // Add each file to the FormData
        imageUrls.forEach(file => {
            formData.append('images', file); // Ensure the field name matches
        });

        try {
            const response = await fetch(`http://localhost:3001/product/createProduct/${vendorId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
    
            if (response.ok) {
                alert("Item has been created");
            }
        } catch (error) {
            console.error("Error creating product", error);
        }
        setNewProductModal(false);
        viewVendor();
    };

    const getProduct = async (productId: string) =>{
        try{
            const response = await fetch(`http://localhost:3001/product/getProduct/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            const data = await response.json();
            setCurrProduct({
                id: productId,
                name: data.name,
                description: data.description,
                category: data.category,
                subCategory: data.subCategory,
                stock: data.stock,
                price: data.price,
                imageUrls: data.imageUrls
            })

            setSelectedCategory(data.category);
        }catch(error){
            console.error("Error getting product")
        }
    }

    const editProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        const { name, description, category, subCategory, stock, price, imageUrls } = currProduct;
    
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('subCategory', subCategory);
        formData.append('stock', stock.toString());
        formData.append('price', price.toString());
    
        // Separate existing URLs and new files
        const existingUrls = imageUrls.filter((image) => typeof image === 'string');
        const newFiles = imageUrls.filter((image) => image instanceof File);
    
        // Add existing URLs to FormData
        formData.append('existingUrls', JSON.stringify(existingUrls));
    
        // Append new image files to FormData
        newFiles.forEach((file) => {
            if (file instanceof File) {
                formData.append('images', file);
            } else {
                console.error("Item in imageUrls is not a File object:", file);
            }
        });
    
        try {
            const response = await fetch(`http://localhost:3001/product/editProduct/${currProduct.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
    
            alert("Product has been edited");
            viewVendor();
            setEditProductModal(false);
        } catch (error) {
            console.error("Error editing product", error);
        }
    };
    
    const renderContent = () => {
        switch (currContent) {
            case "profile":
                return (
                    <div>
                        <h1>Profile </h1>
                        <h2> Email: </h2>
                        <p> {vendorInfo.user.email} </p>
                        <h2> Username: </h2>
                        <p> {vendorInfo.user.username} </p>
                        <h2> Current Role: </h2>
                        <p> {userRole} </p>
                        <h2> VendorId: </h2>
                        <p> {vendorId} </p>
                    </div>
                );
            case "vendor":
                if (userRole === "vendor") {
                    return (
                        <div>
                            <h1> Vendor </h1>
                            <h2> {vendorInfo.storeName} </h2>
                            <button onClick={() =>{ setEditVendorModal(true)}}> Edit your store </button>
                            <p> {vendorInfo.storeDescription} </p>
                            <br></br>
                            <h2> Your Products </h2>
                            <button onClick={() => setNewProductModal(true)}> Add a new Product </button>
                            <div>
                                {vendorInfo.products.length > 0 ? (
                                    vendorInfo.products.map(product => (
                                        <div key={product._id} style={{ marginBottom: '20px' }}>
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            <p>Category: {product.category}</p>
                                            <p>Sub Category: {product.subCategory}</p>
                                            <p>Stock: {product.stock}</p>
                                            <p>Price: ${product.price}</p>
                                            {product.imageUrls.map((imageUrl: string, index: number) => (
                                                <div key={index}>
                                                    <img src={imageUrl} style={{ width: '100px', height: '100px' }} alt={"product picture"}/>
                                                </div>
                                            ))}
                                            <button onClick={() =>{
                                                getProduct(product._id);
                                                setEditProductModal(true);
                                            }}> Edit Product </button>
                                            <button> Remove Product </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No products found.</p>
                                )}
                            </div>
                        </div>
                    );
                } else { //user is not a vendor
                    return (
                        <div>
                            <h1> Vendor </h1>
                            <p>
                                You are currently not a vendor.
                                First send us an email at Meowpop@meowmail.com stating
                                how your products will align with our vision and why
                                you want to become a pop vendor.

                                After that please fill out this form below!
                            </p>

                            <form className="vendorForm" onSubmit={(event) =>{createVendor(event)}}>
                                <label>Store Name</label>
                                <input
                                    type="text"
                                    value={vendorInfo.storeName}
                                    placeholder="Your store name"
                                    onChange={(e) => updateVendor("name", e.target.value)}
                                    required={true}
                                />
                                <label>Store Description</label>
                                <textarea
                                    value={vendorInfo.storeDescription}
                                    placeholder="Description about your company and what you sell"
                                    onChange={(e) => updateVendor("description", e.target.value)}
                                    required={true}
                                />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    );
                }
            case "purchases":
                return (
                    <div>
                        <h1>Purchase History View</h1>
                        {/* Add purchase history content here */}
                    </div>
                );
            case "settings":
                return (
                    <div>
                        <h1> Settings </h1>
                        <button onClick={() => {
                            localStorage.setItem("isLogged", "false");
                            navigate('/')
                        }}> Log out </button>
                    </div>
                );
            default:
                return null;
        }
    };

    const closeModal = () => setNewProductModal(false);

    useEffect(() => {
        if (userRole === "vendor") {
            viewVendor();
        }
        return () => {
            //used to relese the memory allocated for the object URL
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    useEffect(() => {
        //if currProduct.category has a value then find the subcategories for it
        if (currProduct.category) {
            const selectedCategory = categories.find(([cat]) => cat === currProduct.category);
            setSubCategories(selectedCategory ? selectedCategory[1] : []);
        }
    }, [currProduct.category]);

    return (
        <>
            <Header />
            <div className="accPageContainer">
                <div className="sideContainer">
                    <div className="rowContainer" onClick={() => setCurrContent("profile")}>
                        <FontAwesomeIcon icon={faUser} /> Profile
                    </div>
                    <div className="rowContainer" onClick={() => {
                        setCurrContent("vendor") 
                        viewVendor()} 
                        }>
                        <FontAwesomeIcon icon={faGear} /> Vendor
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("purchases")}>
                        <FontAwesomeIcon icon={faMoneyBill} /> Purchases
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("settings")}>
                        <FontAwesomeIcon icon={faClockRotateLeft} /> Settings
                    </div>
                </div>
                <div className="divider"></div>
                <div className="contentContainer">
                    {renderContent()}
                </div>
            </div>
            <Modal show={newProductModal} onClose={closeModal}>
                <div>
                    <h1> Add a new product </h1>
                    <form className="productForm" onSubmit={createProduct}>
                        <label> Name: </label>
                        <input
                            type="text"
                            value={newProduct.name}
                            onChange={(e) => updateProduct("name", e.target.value)}
                            required
                        />
                        <label> Description: </label>
                        <textarea
                            value={newProduct.description}
                            onChange={(e) => updateProduct("description", e.target.value)}
                            required
                        />
                        <label> Category: </label>
                        <select
                            value={newProduct.category}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(([category]) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <label> Sub Category: </label>
                        <select
                            value={newProduct.subCategory}
                            onChange={(e) => updateProduct("subCategory", e.target.value)}
                            required
                        >
                            <option value="">Select a subcategory</option>
                            {subCategories.map((subCategory) => (
                                <option key={subCategory} value={subCategory}>{subCategory}</option>
                            ))}
                        </select>
                        <label> Stock: </label>
                        <input
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => updateProduct("stock", Number(e.target.value))}
                            required
                        />
                        <label> Price: </label>
                        <input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => updateProduct("price", Number(e.target.value))}
                            required
                        />
                        <label> Images: </label>
                        <p> You can have up to 10 images </p>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            required
                        />
                        <div className="imagePreviews">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                                    <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px' }} />
                                    <button
                                        onClick={() => removeImagePreview(index)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit"> Add Product </button>
                    </form>
                </div>
            </Modal>

            <Modal show={editVendorModal} onClose={() =>{setEditVendorModal(false)}}>
                <div>
                    <h1> Edit your Store </h1>
                    <form className="vendorForm" onSubmit={(event) =>{editVendorFunc(event)}}>
                        <label>Store Name</label>
                        <input
                            type="text"
                            value={vendorInfo.storeName}
                            placeholder="Your store name"
                            onChange={(e) => editVendor("storeName", e.target.value)}
                            required={true}
                        />
                        <label>Store Description</label>
                        <textarea
                            value={vendorInfo.storeDescription}
                            placeholder="Description about your company and what you sell"
                            onChange={(e) => editVendor("storeDescription", e.target.value)}
                            required={true}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </Modal>

            <Modal show={editProductModal} onClose={() =>{setEditProductModal(false)}}> 
                <h1> Edit your Product </h1>
                <form className="productForm" onSubmit={(event) =>{editProduct(event)}}>
                    <label> Name: </label>
                    <input
                        type="text"
                        value={currProduct.name}
                        onChange={(e) => updateCurrProduct("name", e.target.value)}
                        required
                    />
                    <label> Description: </label>
                    <textarea
                        value={currProduct.description}
                        onChange={(e) => updateCurrProduct("description", e.target.value)}
                        required
                    />
                    <label> Category: </label>
                    <select
                        value={currProduct.category}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(([category]) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <label> Sub Category: </label>
                    <select
                        value={currProduct.subCategory}
                        onChange={(e) => updateCurrProduct("subCategory", e.target.value)}
                        required
                    >
                        <option value="">Select a subcategory</option>
                        {subCategories.map((subCategory) => (
                            <option key={subCategory} value={subCategory}>{subCategory}</option>
                        ))}
                    </select>
                    <label> Stock: </label>
                    <input
                        type="number"
                        value={currProduct.stock}
                        onChange={(e) => updateCurrProduct("stock", e.target.value)}
                        required
                    />
                    <label> Price: </label>
                    <input
                        type="number"
                        value={currProduct.price}
                        onChange={(e) => updateCurrProduct("price", e.target.value)}
                        required
                    />
                    <label> Images: </label>
                    <p> You can add or remove images </p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className="imagePreviews">
                        {currProduct.imageUrls.map((image, index) => (
                            <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '5px' }}>
                                <img
                                    src={getImageUrl(image)}
                                    alt={`Product ${index}`}
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrProduct((prevProduct) => {
                                            const updatedImages = prevProduct.imageUrls.filter((_, i) => i !== index);
                                            return {
                                                ...prevProduct,
                                                imageUrls: updatedImages,
                                            };
                                        });
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="submit"> Update Product </button>
                </form>
            </Modal>
        </>
    );
};
