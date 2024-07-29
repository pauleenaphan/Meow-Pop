/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';
import Modal from '../components/Modal';
import "../styles/account.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBill, faClockRotateLeft, faGear, faArrowLeft  } from '@fortawesome/free-solid-svg-icons';


const formatDate = (dateString: string) => {
    // Convert the date string to a Date object
    const date = new Date(dateString);

    // Format the date as desired
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const Account = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const vendorId = localStorage.getItem("userRoleId");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    //!MODAL USESTATES
    const [newProductModal, setNewProductModal] = useState<boolean>(false);
    const [editVendorModal, setEditVendorModal] = useState<boolean>(false);
    const [editProductModal, setEditProductModal] = useState<boolean>(false);
    const [confirmModal, setConfirmModal] = useState<boolean>(false);

    const [currContent, setCurrContent] = useState<string>("profile");

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

    const updateCurrProduct = (postField: keyof typeof currProduct, userInput: string | number | (string | File)[]) =>{
        setCurrProduct(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

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

    const [categories] = useState<[string, string[]][]>([
        ["Clothes", ["Costumes", "Hats"]],
        ["Toys", ["String Toys", "Balls", "Catnip Toys", "Plush Toys", "Laser Pointers"]],
        ["Accessories", ["Collars", "Harnesses", "Bow Ties", "Carriers"]],
        ["Furniture", ["Beds", "Trees", "Scratching Posts", "Window Perches"]],
        ["Food", ["Dry Food", "Wet Food", "Catnip", "Treats"]],
        ["Health", ["Vitamins", "Supplements", "Flea Prevention"]],
        ["Grooming", ["Brushes", "Nail Clippers", "Shampoos", "Conditioners", "Ear Cleaners"]],
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
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // console.log(selectedCategory);

    //!PURCHASE USESTATES   
    const [allPurchases, setAllPurchases] = useState<{
        orderNumber: string,
        purchaseDate: string
    }[]>([])

    const [specificPurchase, setSpecificPurchase] = useState<{
        orderNumber: string;
        purchaseDate: string;
        items: {
            productId: {
                _id: string;
                name: string;
                description: string;
                price: number;
                imageUrls: string[];
                category: string;
                subCategory: string;
                stock: number;
                vendor: string;
            };
            quantity: number;
            price: number;
        }[];
        totalAmount: number;
        paymentDetails: {
            cardName: string;
            cardNumber: number;
            cardExpire: number;
            cardCVV: number;
        };
        shippingAddress: {
            street: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
        };
    }>({
        orderNumber: "",
        purchaseDate: '',
        items: [],
        totalAmount: 0,
        paymentDetails: {
            cardName: '',
            cardNumber: 0,
            cardExpire: 0,
            cardCVV: 0
        },
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        }
    });

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        setSelectedCategory(category); //updates selected category with the chosen one
        updateProduct("category", category);
        updateCurrProduct("category", category);

        const selectedCategory = categories.find(([cat]) => cat === category);
        setSubCategories(selectedCategory ? selectedCategory[1] : []);
    };

    //!FILE FUNCTIONS
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

    //!VENDOR FUNCTIONS
    const createVendor = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission
        const { name, description } = newVendor;
        try {
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/createVendor`, {
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
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/viewVendor/${vendorId}`, {
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
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/editVendor/${vendorId}`,{
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

    //!PRODUCT FUNCTIONS
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
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/product/createProduct/${vendorId}`, {
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

        setNewProduct({
            name: "",
            description: "",
            category: "",
            subCategory: "",
            stock: 0,
            price: 0,
            imageUrls: []
        })

        setImagePreviews([]);
    };

    const getProduct = async (productId: string) =>{
        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/product/getProduct/${productId}`, {
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
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/product/editProduct/${currProduct.id}`, {
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

    const removeProduct = async () =>{
        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/product/deleteProduct/${currProduct.id}/${vendorId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            alert("product was deleted");
            viewVendor();
            setConfirmModal(false);

        }catch(error){
            console.error("Error deleting product");
        }
    }

    //!PURCHASES FUNCTIONS
    const getPurchaseHistory = async () =>{
        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/purchase/getAllPurchases`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            const data = await response.json();

            // Map the fetched data to the desired structure
            const formattedPurchases = data.map((purchase: { _id: string, purchaseDate: string }) => ({
                orderNumber: purchase._id,
                purchaseDate: new Date(purchase.purchaseDate).toLocaleDateString()
            }));

            setAllPurchases(formattedPurchases);

            console.log("Data", data);
        }catch(error){
            console.error("Error getting purchase history");
        }
    }

    const getSpecificPurchase = async (orderId: string) =>{
        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/purchase/getPurchase/${orderId}`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }, 
                mode: "cors"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            const data = await response.json();

            setSpecificPurchase({
                orderNumber: orderId,
                purchaseDate: formatDate(data.purchaseDate),
                items: data.items.map((item: { productId: { _id: string; name: string; description: string; price: number; imageUrls: string[]; category: string; subCategory: string; stock: number; vendor: string; }; quantity: number; price: number; }) => ({
                    productId: {
                        _id: item.productId._id,
                        name: item.productId.name,
                        description: item.productId.description,
                        price: item.productId.price,
                        imageUrls: item.productId.imageUrls,
                        category: item.productId.category,
                        subCategory: item.productId.subCategory,
                        stock: item.productId.stock,
                        vendor: item.productId.vendor
                    },
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: data.totalAmount,
                paymentDetails: {
                    cardName: data.paymentDetails.cardName,
                    cardNumber: data.paymentDetails.cardNumber,
                    cardExpire: data.paymentDetails.cardExpire,
                    cardCVV: data.paymentDetails.cardCVV
                },
                shippingAddress: {
                    street: data.shippingAddress.street,
                    city: data.shippingAddress.city,
                    state: data.shippingAddress.state,
                    postalCode: data.shippingAddress.postalCode,
                    country: data.shippingAddress.country
                }
            });

        }catch(error){
            console.error("Error geting specific purchase");
        }
    }

    //!USE EFFECTS 
    useEffect(() => {
        if (userRole === "vendor") {
            viewVendor();
        }
        return () => {
            //used to relese the memory allocated for the object URL
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    useEffect(() =>{
        getPurchaseHistory();
    },[])

    useEffect(() => {
        //if currProduct.category has a value then find the subcategories for it
        if (currProduct.category) {
            const selectedCategory = categories.find(([cat]) => cat === currProduct.category);
            setSubCategories(selectedCategory ? selectedCategory[1] : []);
        }
    }, [currProduct.category]);
    
    //!RENDERS CONTENT IN SETTINGS
    const renderContent = () => {
        switch (currContent) {
            case "profile":
                return (
                    <div className="profileSettings">
                        <h1 className="profileHeader"> User Information </h1>
                        <div className="profileInfoContainer">
                            <div className="infoContainer">
                                <h3> Email: </h3>
                                <p> {userEmail} </p>
                            </div>
                            <div className="infoContainer">
                                <h3> Username: </h3>
                                <p> {userName} </p>
                            </div>
                            <div className="infoContainer">
                                <h3> Current Role: </h3>
                                <p> {userRole} </p>
                            </div>
                            <div className="infoContainer">
                                <h3> VendorId: </h3>
                                <p> {userRole === "vendor" ? vendorId : "Become a vendor to get an ID"} </p>
                            </div>
                            
                        </div>
                        
                    </div>
                );
            case "vendor":
                if (userRole === "vendor") {
                    return (
                        <div className="vendorSettings">
                            {/* <h1> Vendor </h1> */}
                            <div className="btnTitleContainer">
                                <h1> {vendorInfo.storeName} </h1>
                                <button className="headerBtn" onClick={() =>{ setEditVendorModal(true)}}> Edit your store </button>
                            </div>
                            
                            <p className="vendorDesc"> {vendorInfo.storeDescription} </p>
                            <br></br>
                            <div className="btnTitleContainer">
                                <h2> Your Products </h2>
                                <button className="headerBtn" onClick={() => setNewProductModal(true)}> Add a new Product </button>
                            </div>
                            
                            <div>
                                {vendorInfo.products.length > 0 ? (
                                    vendorInfo.products.map(product => (
                                        <div className="productContainer" key={product._id}>
                                            <div className="productLeftContainer">
                                                <h3>{product.name}</h3>
                                                <p>Product Description: {product.description}</p>
                                                <p>Category: {product.category}</p>
                                                <p>Sub Category: {product.subCategory}</p>
                                                <p>Stock: {product.stock}</p>
                                                <p>Price: ${product.price}</p>
                                            </div>

                                            <div className="productRightContainer">
                                                {product.imageUrls.map((imageUrl: string, index: number) => (
                                                    <div key={index}>
                                                        <img src={imageUrl} alt={"product picture"}/>
                                                    </div>
                                                ))}

                                            </div>
                                            <div className="btnContainer">
                                                <button onClick={() =>{
                                                    getProduct(product._id);
                                                    setEditProductModal(true);
                                                }}> Edit Product </button>
                                                <button onClick={() =>{
                                                    updateCurrProduct("id", product._id);
                                                    updateCurrProduct("name", product.name);
                                                    setConfirmModal(true);
                                                }}> Remove Product </button>
                                            </div>
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
                            <p className="notVendorPg">
                                You are currently not a vendor.
                                First send us an email at Meowpop@meowmail.com stating
                                how your products will align with our vision and why
                                you want to become a pop vendor.

                                After that please fill out this form below!
                            </p>

                            <form className="vendorForm" onSubmit={(event) =>{createVendor(event)}}>
                                <div className="inputContainer">
                                    <label>Store Name</label>
                                    <input
                                        type="text"
                                        // value={vendorInfo.storeName}
                                        placeholder="Your store name"
                                        onChange={(e) => updateVendor("name", e.target.value)}
                                        required={true}
                                    />
                                </div>
                                <div className="inputContainer">
                                    <label>Store Description</label>
                                    <textarea
                                        // value={vendorInfo.storeDescription}
                                        placeholder="Description about your company and what you sell"
                                        onChange={(e) => updateVendor("description", e.target.value)}
                                        required={true}
                                    />
                                </div>
                                
                                <button className="subbtn" type="submit">Submit</button>
                            </form>
                        </div>
                    );
                }
            case "purchases":
                return (
                    <div>
                        <h1 className="purchaseHeader">Purchase History View</h1>
                        <div className="purchaseHistoryContainer">
                            {allPurchases.length > 0 ? (
                                allPurchases.map((purchase, index) => (
                                    <div key={index} className="purchaseOrderContainer" onClick={() =>{
                                                getSpecificPurchase(purchase.orderNumber);
                                                setCurrContent("specificPurchase");
                                            }}>
                                        <p>Order Number: {purchase.orderNumber}</p>
                                        <p>Purchased Date: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No purchases found.</p>
                            )}
                        </div>
                    </div>
                );
            case "specificPurchase":
                return(
                    <div>
                        <div className="backAccBtnContainer">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            {/* -1 allows you to navigate to the page before */}
                            <button className="backBtn" onClick={() => setCurrContent("purchases")}> Back to previous page </button>
                        </div>
                        <div>
                            <h1> Order Summary </h1>
                            <p> Order Number: {specificPurchase.orderNumber} </p>
                            <br></br>
                            <h2> Shipping Address </h2>
                            <div className="shippingInfo">
                                <p> {specificPurchase.shippingAddress.street} </p>
                                <p> {specificPurchase.shippingAddress.city}, {specificPurchase.shippingAddress.state} {specificPurchase.shippingAddress.postalCode}</p>
                                <p> {specificPurchase.shippingAddress.country} </p>
                            </div>
                            
                            <br></br>
                            <h2> Payment Details </h2>
                            <p> Payment Method: Debit Card </p>
                            <p>
                                Card ending in: **** **** **** {specificPurchase.paymentDetails.cardNumber.toString().slice(-4)}
                            </p>
                            <br></br>
                            <h2>Products</h2>
                            <div className="purchaseDetails">
                                {specificPurchase.items.map((item, index) => (
                                    <div key={index} className="itemDetailContainer">
                                        <div className="productInfo">
                                            <div className="contain1">
                                                <p className="productName">{item.productId.name}</p>
                                                <p className="productCategory">{item.productId.category} | {item.productId.subCategory} </p>
                                            </div>
                                            
                                            <p>Description: {item.productId.description}</p>
                                            <br></br>
                                            <p className="productPrice">Price: ${item.productId.price.toFixed(2)}x{item.quantity}</p>
                                        </div>
                                        
                                        <img src={item.productId.imageUrls[0]} alt={item.productId.name} />
                                    </div>
                                ))}
                            </div>
                            <div className="summaryPrice">
                                <p> Subtotal: ${specificPurchase.totalAmount - 3}</p>
                                <p> Shipping: $3 </p>
                                <p> Total: ${specificPurchase.totalAmount} </p>
                            </div>
                            
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div>
                        <h1> Settings </h1>
                        <button className="logoutBtn" onClick={() => {
                            localStorage.setItem("isLogged", "false");
                            navigate('/')
                        }}> Log out </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="accPage">
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

            <Modal show={newProductModal} onClose={() =>{setNewProductModal(false)}}>
                <div>
                    <h1> Add a new product </h1>
                    <form className="productForm" onSubmit={createProduct}>
                        <div className="inputContainer">
                            <label>Name:</label>
                            <input
                                type="text"
                                placeholder="Enter your product name"
                                value={newProduct.name}
                                onChange={(e) => updateProduct("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputContainer">
                            <label>Description:</label>
                            <textarea
                                placeholder="Short description about your product"
                                value={newProduct.description}
                                onChange={(e) => updateProduct("description", e.target.value)}
                                required
                            />
                        </div>
                        <div className="outerInputContainer">
                            <div className="inputContainer">
                                <label>Category:</label>
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
                            </div>
                            <div className="inputContainer">
                                <label>Sub Category:</label>
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
                            </div>
                        </div>
                        <div className="outerInputContainer">
                            <div className="inputContainer">
                                <label>Stock:</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => updateProduct("stock", Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div className="inputContainer">
                                <label>Price:</label>
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => updateProduct("price", Number(e.target.value))}
                                    required
                                />
                            </div>
                        </div>
                        <div className="inputContainer">
                            <label>Images: You can have up to 10 images</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                required
                            />
                        </div>
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
                        <button className="subbtn" type="submit"> Add Product </button>
                    </form>
                </div>
            </Modal>

            <Modal show={editVendorModal} onClose={() =>{setEditVendorModal(false)}}>
                <div>
                    <h1> Edit your Store </h1>
                    <form className="vendorForm" onSubmit={(event) =>{editVendorFunc(event)}}>
                        <div className="inputContainer">
                            <label>Store Name</label>
                            <input
                                type="text"
                                value={vendorInfo.storeName}
                                placeholder="Your store name"
                                onChange={(e) => editVendor("storeName", e.target.value)}
                                required={true}
                            />
                            
                        </div>
                        <div className="inputContainer">
                            <label>Store Description</label>
                            <textarea
                                value={vendorInfo.storeDescription}
                                placeholder="Description about your company and what you sell"
                                onChange={(e) => editVendor("storeDescription", e.target.value)}
                                required={true}
                            />
                        </div>
                        
                        <button className="subbtn" type="submit">Submit</button>
                    </form>
                </div>
            </Modal>

            <Modal show={editProductModal} onClose={() =>{setEditProductModal(false)}}> 
                <h1> Edit your Product </h1>
                <form className="productForm" onSubmit={(event) =>{editProduct(event)}}>
                <div className="inputContainer">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={currProduct.name}
                        onChange={(e) => updateCurrProduct("name", e.target.value)}
                        required
                    />
                </div>
                <div className="inputContainer">
                    <label>Description:</label>
                    <textarea
                        value={currProduct.description}
                        onChange={(e) => updateCurrProduct("description", e.target.value)}
                        required
                    />
                </div>
                <div className="outerInputContainer">
                    <div className="inputContainer">
                        <label>Category:</label>
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
                    </div>
                    <div className="inputContainer">
                        <label>Sub Category:</label>
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
                    </div>
                </div>
                <div className="outerInputContainer">
                    <div className="inputContainer">
                        <label>Stock:</label>
                        <input
                            type="number"
                            value={currProduct.stock}
                            onChange={(e) => updateCurrProduct("stock", e.target.value)}
                            required
                        />
                    </div>

                    <div className="inputContainer">
                        <label>Price:</label>
                        <input
                            type="number"
                            value={currProduct.price}
                            onChange={(e) => updateCurrProduct("price", e.target.value)}
                            required
                        />
                    </div>
                </div>
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
                    <button className="subbtn" type="submit"> Update Product </button>
                </form>
            </Modal>
            
            <Modal show={confirmModal} onClose={() => {setConfirmModal(false)}}>
                <div className="confirmModalContainer">
                    <p> Are you sure you want to remove this product? </p>
                    <h1> {currProduct.name} </h1>
                    <div className="btnContainer">
                        <button className="removeBtn" onClick={removeProduct}> Confirm </button> 
                        <button className="cancelBtn" onClick={() =>{ setConfirmModal(false)}}> Cancel </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
