/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../components/Navbar';
import "../styles/products.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const ProductView = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLogged = localStorage.getItem("isLogged");
    const { productId } = useParams();
    const [currProduct, setCurrProduct] = useState<{
        name: string, 
        description: string,
        category: string,
        subCategory: string,
        stock: number,
        price: number,
        imageUrls: (string | File)[],
        vendor: { storeName: string }
    }>({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        stock: 1,
        price: 0,
        imageUrls: [],
        vendor: { storeName: "" }
    })
    
    const [quantity, setQuantity] = useState<number>(1);

    const getProduct = async () =>{
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
                name: data.name,
                description: data.description,
                category: data.category,
                subCategory: data.subCategory,
                stock: data.stock,
                price: data.price,
                imageUrls: data.imageUrls,
                vendor: {
                    storeName: data.vendor.storeName
                }
            });
        }catch(error){
            console.error("Error getting product")
        }
    }

    //handles value when the user is trying to add or remove amt to add to their cart
    const handleQuantityChange = (delta: number) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + delta;
            if (newQuantity < 1) return 1; // Minimum quantity is 1
            if (newQuantity > currProduct.stock) return currProduct.stock; // Max quantity is stock
            return newQuantity;
        });
    };

    const addToCart = async () =>{
        if(isLogged == "false"){
            alert("You need to login in order to add items to your cart");
            return;
        }
        try{
            const response = await fetch(`http://localhost:3001/cart/addItem/${productId}`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: quantity })
            })
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`); 
            }

            alert("item added to cart");

        }catch(error){
            console.error("Error adding item to cart");
        }
    }

    useEffect(() =>{
        getProduct();
    }, [])

    return(
        <div>
            <Navbar/>
            <div className="backBtnContainer">
                <FontAwesomeIcon icon={faArrowLeft} />
                {/* -1 allows you to navigate to the page before */}
                <button className="backBtn" onClick={() =>{ navigate(-1)}}> Back to previous page </button>
            </div>
            <div className="viewProductContainer">
                <div className="productCarousel">
                    <Carousel showThumbs={true} showArrows={true} showStatus={false} infiniteLoop useKeyboardArrows autoPlay>
                        {currProduct.imageUrls.map((url, index) => (
                            <div key={index} className="productViewImg">
                                <img src={typeof url === "string" ? url : URL.createObjectURL(url)} alt={`Product Image ${index + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="productInfo">
                    <div className="productContainer1">
                        <h1 id="productName"> {currProduct.name} </h1>
                        <p id="productVendor"> Sold by: {currProduct.vendor.storeName} </p>
                        <p id="productPrice"> ${currProduct.price} </p>
                        {/* <p className="productCat"> {currProduct.subCategory} </p> */}
                        <br></br>
                        <div className="quantitySelector">
                            <p> In Stock: {currProduct.stock} </p>
                            <button onClick={() => handleQuantityChange(-1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                    </div>
                    
                    <button id="addToCartBtn" onClick={addToCart}> Add to Cart </button>
                    <div className="productDesc">
                        <p> DESCRIPTION: </p>
                        <p>{currProduct.description} </p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}