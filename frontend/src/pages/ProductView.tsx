/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../components/Navbar';
import "../styles/products.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { getProduct } from "../api/productAPI";
import { Product } from "../types/productTypes";
import { addToCart } from "../api/cartAPI";

export const ProductView = () =>{
    const navigate = useNavigate();
    const { productId } = useParams();
    const [currProduct, setCurrProduct] = useState<Product>()
    
    const [quantity, setQuantity] = useState<number>(1);

    const getCurrProduct = async() =>{
        const product = await getProduct(productId);
        setCurrProduct(product);
    }

    const addProductToCart = async() =>{
        await addToCart(quantity, productId);
    }

    // handles value when the user is trying to add or remove amt to add to their cart
    const handleQuantityChange = (delta: number) => {
        if(currProduct){
            setQuantity(prevQuantity => {
                const newQuantity = prevQuantity + delta;
                if (newQuantity < 1) return 1; // Minimum quantity is 1
                if (newQuantity > currProduct.stock) return currProduct.stock; // Max quantity is stock
                return newQuantity;
            });
        }
    };

    useEffect(() =>{
        getCurrProduct();
    }, [])

    useEffect(() =>{
        if(currProduct?.name){
            document.title = `${currProduct?.name} | MeowPop`
        }
    }, [currProduct])

    return(
        <div>
            <Navbar/>
            <div className="backBtnContainer">
                <FontAwesomeIcon icon={faArrowLeft} />
                {/* -1 allows you to navigate to the page before */}
                <button className="backBtn" onClick={() =>{ navigate(-1)}}> Back to previous page </button>
            </div>
            {currProduct ? (
                <div className="viewProductContainer">
                    <div className="productCarousel">
                        <Carousel showThumbs={true} showArrows={true} showStatus={false} infiniteLoop useKeyboardArrows autoPlay>
                            {currProduct.imageUrls?.map((url, index) => (
                                <div key={index} className="productViewImg">
                                    <img src={typeof url === "string" ? url : URL.createObjectURL(url)} alt={`Product Image ${index + 1}`} />
                                </div>
                            ))}
                        </Carousel>
                    </div>

                    <div className="productInfo">
                        <div className="productContainer1">
                            <h1 id="productName"> {currProduct.name} </h1>
                            <p id="productVendor"> Sold by: {currProduct.vendor?.storeName} </p>
                            <p id="productPrice"> ${currProduct.price} </p>
                            <br />
                            <div className="quantitySelector">
                                <p> In Stock: {currProduct.stock} </p>
                                <button onClick={() => handleQuantityChange(-1)}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>+</button>
                            </div>
                        </div>

                        <button id="addToCartBtn" onClick={() =>{ addProductToCart()} }> Add to Cart </button>
                        <div className="productDesc">
                            <p> DESCRIPTION: </p>
                            <p>{currProduct.description} </p>
                        </div>
                    </div>
                </div>
            ) : ( 
                <p> Loading Current Product...</p>
            )}
        </div>
    )
}