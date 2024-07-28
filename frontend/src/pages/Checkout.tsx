import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import "../styles/checkout.css";
import Modal from '../components/Modal';
import catShopping3 from "../assets/catShopping3.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface CartItem {
    product: {
        _id: string;
        name: string;
        category: string;
        price: number;
        stock: number;
        imageUrls: string[];
    };
    quantity: number;
}

interface Purchase{
    paymentDetails:{
        cardName: string;
        cardNumber: number;
        cardExpire: number;
        cardCVV: number
    };
    shippingAddress:{
        street: string;
        city: string;
        state: string;
        postalCode: number;
        country: string
    };
    totalAmount: number;
}

export const Checkout = () =>{
    const { priceTotal } = useParams<{ priceTotal?: string }>(); // Make priceTotal optional
    const cartId = localStorage.getItem("cartId");
    const [finalTotal, setFinalTotal] = useState<number>(0);
    const [checkoutModal, setCheckoutModal] = useState<boolean>(false);
    
    useEffect(() => {
        // Convert priceTotal to a number, fallback to 0 if undefined or not a valid number
        const total = parseFloat(priceTotal ?? '0'); // Use '0' as fallback if priceTotal is undefined
        setFinalTotal(total + 3); // Add $3 to the total
    }, [priceTotal]); // Update when priceTotal changes

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [cartItems, setCartItems] = useState<CartItem[]>([{
        product: {
            _id: "",
            name: "",
            category: "",
            price: 0,
            stock: 0,
            imageUrls: []
        },
        quantity: 0
    }]);

    const [purchase, setPurchase] = useState<Purchase>({
        paymentDetails:{
            cardName: "",
            cardNumber: 0,
            cardExpire: 0,
            cardCVV: 0,
        },
        shippingAddress:{
            street: "",
            city: "",
            state: "",
            postalCode: 0,
            country: ""
        },
        totalAmount: finalTotal
    })

    const updatePurchase = (field: string, value: string | number) => {
        setPurchase(prevData => {
            if (field.startsWith('shippingAddress.')) {
                return {
                    ...prevData,
                    shippingAddress: {
                        ...prevData.shippingAddress,
                        [field.replace('shippingAddress.', '')]: value
                    }
                };
            }
            if (field.startsWith('paymentDetails.')) {
                return {
                    ...prevData,
                    paymentDetails: {
                        ...prevData.paymentDetails,
                        [field.replace('paymentDetails.', '')]: value
                    }
                };
            }
            return prevData;
        });
    };

    const getCart = async () =>{
        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/cart/viewCart`, {
                method: "GET",
                headers:{
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })

            const data = await response.json();
            setCartItems(data.items);
        }catch(error){
            console.error("Error getting user cart");
        }
    }

    useEffect(() =>{
        getCart();
    }, [])

    const buyItems = async (event: React.FormEvent) =>{
        event.preventDefault();
        
        //only gets last 4 digits of the credit card to store in the db
        const cardNumber = purchase.paymentDetails.cardNumber.toString().slice(-4);
        updatePurchase("paymentDetails.cardNumber", parseInt(cardNumber, 10));

        const { paymentDetails, shippingAddress } = purchase;

        try{
            const response = await fetch(`https://backend-wild-log-8565.fly.dev/purchase/buyItems/${cartId}`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors",
                body: JSON.stringify({ paymentDetails, shippingAddress, totalAmount: finalTotal })
            });
            
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
            
            setCheckoutModal(true);
            //navigate them to a confimration page or something
        }catch(error){
            console.error("Erroring buying items");
        }
    }

    return(
        <div>
            <Header/>
            <div className="backBtnContainer">
                <FontAwesomeIcon icon={faArrowLeft} />
                {/* -1 allows you to navigate to the page before */}
                <button className="backBtn" onClick={() =>{ navigate(-1)}}> Back to previous page </button>
            </div>
            <div className="checkoutContainer">
                <form className="checkoutForm" onSubmit={buyItems}>
                    <h1>Shipping Address</h1>
                    <div className="inputContainer">
                        <label>Street</label>
                        <input
                            type="text"
                            placeholder="Enter your street"
                            required
                            onChange={(e) => updatePurchase('shippingAddress.street', e.target.value)}
                        />
                    </div>
                    <div className='innerContainer'>
                        <div className="inputContainer">
                            <label>City</label>
                            <input
                                type="text"
                                placeholder="Enter your city"
                                required
                                onChange={(e) => updatePurchase('shippingAddress.city', e.target.value)}
                            />
                        </div>
                        <div className="inputContainer">
                            <label>State</label>
                            <input
                                type="text"
                                placeholder="Enter your state"
                                required
                                onChange={(e) => updatePurchase('shippingAddress.state', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="innerContainer">
                        <div className="inputContainer">
                            <label>Country</label>
                            <input
                                type="text"
                                placeholder="Enter your country"
                                required
                                onChange={(e) => updatePurchase('shippingAddress.country', e.target.value)}
                            />
                        </div>
                        <div className="inputContainer">
                            <label>Postal Code</label>
                            <input
                                type="number"
                                placeholder="01234"
                                required
                                onChange={(e) => updatePurchase('shippingAddress.postalCode', Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <h1>Payment Information</h1>
                    <div className="inputContainer">
                        <label>Name on Card</label>
                        <input
                            type="text"
                            placeholder="First and Last name"
                            required
                            onChange={(e) => updatePurchase('paymentDetails.cardName', e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Card Number</label>
                        <input
                            type="number"
                            placeholder="16 Digit Number"
                            minLength={16}
                            maxLength={16}
                            required
                            onChange={(e) => updatePurchase('paymentDetails.cardNumber', Number(e.target.value))}
                        />
                    </div>
                    <div className="innerContainer">
                        <div className="inputContainer">
                            <label>Expiration Date</label>
                            <input
                                type="text"
                                placeholder="MMYY"
                                minLength={4}
                                maxLength={4}
                                required
                                onChange={(e) => updatePurchase('paymentDetails.cardExpire', e.target.value)}
                            />
                        </div>
                        <div className="inputContainer">
                            <label>CVV</label>
                            <input
                                type="number"
                                placeholder="000"
                                minLength={3}
                                maxLength={3}
                                required
                                onChange={(e) => updatePurchase('paymentDetails.cardCVV', Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <button type="submit" className="subbtn">Place Order</button>
                </form>
                
                <div className="orderSummaryOuter">
                    <h1> Order Summary </h1>
                    <div className="orderSummaryOuter2">
                        {cartItems.map((item, index) => (
                            <div key={index} className="orderSummaryContainer">
                                <img src={item.product.imageUrls[0]} alt="Product" />
                                <div className="cartContainer0">
                                    <div>
                                        <div className="cartContainer1">
                                            <p>{item.product.name}</p>
                                        </div>
                                        <p className="cartProductCategory">{item.product.category}</p>
                                    </div>
                                    <div className="cartContainer1">
                                        <p>In your cart: x{item.quantity}</p>
                                        <p>${item.product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cartPrice">
                        <p> Subtotal: ${priceTotal} </p>
                        <p> Shipping Fees: $3 </p>
                        <p> Total: ${finalTotal} </p>
                    </div>
                </div>
            </div>

            <Modal show={checkoutModal} onClose={() =>{ 
                    setCheckoutModal(false);
                    navigate("/");
                    }}> 
                <div className="checkoutModal">
                    <h1> Thank you for shopping with Meowpop! </h1>
                    <p> Check your purchase in your profile to confirm your order details.
                        Have a pawtastic day!
                    </p>
                    <img src={catShopping3} alt="catShop"/>
                </div>
            </Modal>
        </div>
    )
}
