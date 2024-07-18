/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
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
    const [newProductModal, setNewProductModal] = useState<boolean>(false);
    const [currContent, setCurrContent] = useState<string>("profile");
    const [vendorInfo, setVendorInfo] = useState<{
        user: { _id: string; username: string; email: string };
        storeName: string;
        storeDescription: string;
        products: { _id: string; name: number; description: string; category: string; 
                subCategory: string; stock: number; price: string; imageUrl: string }[]; 
    }>({
        user: { _id: "", username: "", email: "" },
        storeName: "",
        storeDescription: "",
        products: []
    });

    //!New vendor created values
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

    //!New product values
    const [newProduct, setNewProduct] = useState<{
        name: string;
        description: string;
        category: string;
        subCategory: string;
        stock: number;
        price: number;
        imageUrl: File | null;
    }>({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        stock: 0,
        price: 0,
        imageUrl: null
    });

    const updateProduct = (postField: keyof typeof newProduct, userInput: string | number) =>{
        setNewProduct(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

    //!category of products
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

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [subCategories, setSubCategories] = useState<string[]>([]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        setSelectedCategory(category); //updates selected category with the chosen one

        //finds and sets the subcategory based on the chosen category
        const selectedCategory = categories.find(([cat]) => cat === category);
        setSubCategories(selectedCategory ? selectedCategory[1] : []);
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

    // const createProduct = async () =>{

    // }

    //!renders content in the settings page based on the tab the user clicks
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
                        <p> {localStorage.getItem("userRole")} </p>
                        <h2> VendorId: </h2>
                        <p> {vendorId} </p>
                    </div>
                );
            case "vendor":
                if (localStorage.getItem("userRole") === "vendor") {
                    viewVendor();
                    return (
                        <div>
                            <h1> Vendor </h1>
                            <h2> {vendorInfo.storeName} </h2>
                            <p> {vendorInfo.storeDescription} </p>
                            <br></br>
                            <h2> Your Products </h2>
                            <button onClick={() => setNewProductModal(true)}> Add a new Product </button>
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

                            <form className="vendorForm" onSubmit={createVendor}>
                                <label>Store Name</label>
                                <input
                                    type="text"
                                    placeholder="Your store name"
                                    onChange={(e) => updateVendor("name", e.target.value)}
                                    required={true}
                                />
                                <label>Store Description</label>
                                <textarea
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
                return null; // Render nothing if currContent is empty or undefined
        }
    };

    return (
        <div>
            <Header />
            <div className="accPageContainer">
                <div className="sideContainer">
                    <div className="rowContainer" onClick={() => setCurrContent("profile")}>
                        <FontAwesomeIcon icon={faUser} />
                        <a> Profile </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("vendor")}>
                        <FontAwesomeIcon icon={faMoneyBill} />
                        <a> Vendor </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("purchases")}>
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                        <a> Purchase History </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("settings")}>
                        <FontAwesomeIcon icon={faGear} />
                        <a> Settings </a>
                    </div>
                </div>
                <div className="divider"></div>

                <div className="contentContainer">
                    {renderContent()}
                </div>
            </div>

            <Modal show={newProductModal} onClose={() => setNewProductModal(false)}>
                <div className="modal">
                    <h2> New Product </h2>
                    <form className="newProductForm">
                        <label> Name </label>
                        <input
                            type="text"
                            placeholder="Name of your product"
                            required={true}
                            onChange={(e) => updateProduct("name", e.target.value)}
                        />
                        <label> Description </label>
                        <textarea
                            placeholder="Short description about your product"
                            required={true}
                            onChange={(e) => updateProduct("description", e.target.value)}
                        />
                        <label> Category </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                handleCategoryChange
                                updateProduct("category", e.target.value)
                            }}
                        >
                            <option value="">Select a category</option>
                            {categories.map(([category], index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <label> Subcategory </label>
                        <select
                            disabled={!selectedCategory} //dsisable if no category selected
                            onChange={} //set subcategory to var
                        >
                            <option value="">Select a subcategory</option>
                            {subCategories.map((subCategory, index) => (
                                <option key={index} value={subCategory}>{subCategory}</option>
                            ))}
                        </select>
                        <label> Stock </label>
                        <input 
                            type="number" 
                            placeholder="Item Amount"
                            required={true}
                            onChange={(e) => updateProduct("stock", e.target.value)}
                        />
                        <label> Price </label>
                        <input 
                            type="number"
                            placeholder="Ex: 9.99"
                            required={true}
                            onChange={(e) => updateProduct("price", e.target.value)}
                        />
                        <label> Image of Product </label>
                        <input
                            type="file"
                            required={true}
                            onChange={(e) => updateProduct("imageUrl", e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};
