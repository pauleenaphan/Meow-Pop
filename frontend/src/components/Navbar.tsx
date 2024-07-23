import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import "../styles/nav.css";

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

export const Navbar = () =>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem('isLogged') === 'true';
    const [showCartModal, setShowCartModal] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [confirmModal, setConfirmModal] = useState<{
        status: boolean,
        productId: string,
        productName: string,
    }>({
        status: false,
        productId: "",
        productName: "",
    });

    const updateConfirmValues = (postField: keyof typeof confirmModal, userInput: string | boolean) =>{
        setConfirmModal(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

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


    const handleUserIconClick = () => {
        if (isLoggedIn) {
            navigate("/account");
        } else {
            navigate("/login");
        }
    };

    const getCart = async () =>{
        try{
            const response = await fetch(`http://localhost:3001/cart/viewCart`, {
                method: "GET",
                headers:{
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })

            const data = await response.json();
            setCartItems(data.items);
            console.log("data", data.items);
            console.log("data", data.user);
            console.log("cart ID", data._id);
        }catch(error){
            console.error("Error getting user cart");
        }
    }

    const removeCartItem = async () =>{
        try{
            const response = await fetch(`http://localhost:3001/cart/removeItem/${confirmModal.productId}`, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                mode: "cors"
            })
            if(response.ok){
                alert("item was delete");
                getCart();
                updateConfirmValues("status", false);
            }
        }catch(error){
            console.error("Error removing item from cart");
        }
    }

    //if cart modal is visible then disable the scroll for the outer page
    useEffect(() => {
        if (showCartModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showCartModal]);

    useEffect(() => {
        const newTotalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        setTotalPrice(Number(newTotalPrice.toFixed(2)));
    }, [cartItems]);

    return(
        <header> 
            <section className="subHeader">
                <div className="subContainer">
                    <a className="title" href="/">MeowPop</a>
                    <p className="caption">Everything your cat deserves</p>
                </div>
                <div className="icons">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <FontAwesomeIcon icon={faCartShopping} onClick={() =>{
                                                                getCart();
                                                                setShowCartModal(true)
                                                            }}/>
                    <FontAwesomeIcon icon={faUser} onClick={handleUserIconClick} />
                </div>
            </section>
            <nav>
                <ul>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Clothes,Accessories") }}>APPAREL</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Clothes") }}>Clothing</h1></li>
                            <li><a onClick={() => { navigate("/products/Hats") }}>Hats</a></li>
                            <li><a onClick={() => { navigate("/products/Costumes") }}>Costumes</a></li>
                            <li><h1 onClick={() => { navigate("/products/Accessories") }}>Accessories</h1></li>
                            <li><a onClick={() => { navigate("/products/Collars") }}>Collars</a></li>
                            <li><a onClick={() => { navigate("/products/Harnesses") }}>Harnesses</a></li>
                            <li><a onClick={() => { navigate("/products/Carriers") }}>Carriers</a></li>
                            <li><a onClick={() => { navigate("/products/Bow Ties") }}>Bowties</a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Grooming,Health") }}>PET CARE</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Grooming") }}>Grooming</h1></li>
                            <li><a onClick={() => { navigate("/products/Brushes") }}>Brushes</a></li>
                            <li><a onClick={() => { navigate("/products/Nail Clippers") }}>Nail Clippers</a></li>
                            <li><a onClick={() => { navigate("/products/Shampoos") }}>Shampoos</a></li>
                            <li><a onClick={() => { navigate("/products/Conditioners") }}>Conditioners</a></li>
                            <li><a onClick={() => { navigate("/products/Ear Cleaners") }}>Ear Cleaners</a></li>
                            <li><a onClick={() => { navigate("/products/Dental Care") }}>Dental Care</a></li>
                            <li><h1 onClick={() => { navigate("/products/Health") }}>Health</h1></li>
                            <li><a onClick={() => { navigate("/products/Vitamins") }}>Vitamins</a></li>
                            <li><a onClick={() => { navigate("/products/Supplements") }}>Supplements</a></li>
                            <li><a onClick={() => { navigate("/products/Flea Prevention") }}>Flea Prevention</a></li>
                            <li><a onClick={() => { navigate("/products/Tick Prevention") }}>Tick Prevention</a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Toys") }}>TOYS</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Toys") }}>Interactive</h1></li>
                            <li><a onClick={() => { navigate("/products/String Toys") }}>String Toys</a></li>
                            <li><a onClick={() => { navigate("/products/Balls") }}>Balls</a></li>
                            <li><a onClick={() => { navigate("/products/Laser Pointers") }}>Laser Pointers</a></li>
                            <li><a onClick={() => { navigate("/products/Catnip Toys") }}>Catnip Toys</a></li>
                            <li><a onClick={() => { navigate("/products/Plush Toys") }}>Plush Toys</a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Furniture") }}>FURNITURE</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Furniture") }}>Sleeping</h1></li>
                            <li><a onClick={() => { navigate("/products/Beds") }}>Beds</a></li>
                            <li><a onClick={() => { navigate("/products/Window Perches") }}>Window Perches</a></li>
                            <li><h1 onClick={() => { navigate("/products/Furniture") }}>Scratching</h1></li>
                            <li><a onClick={() => { navigate("/products/Scratching Posts") }}>Scratching Posts</a></li>
                            <li><a onClick={() => { navigate("/products/Trees") }}>Trees</a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Food") }}>FOOD</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Food") }}>Standard</h1></li>
                            <li><a onClick={() => { navigate("/products/Dry Food") }}>Dry Food</a></li>
                            <li><a onClick={() => { navigate("/products/Wet Food") }}>Wet Food</a></li>
                            <li><h1 onClick={() => { navigate("/products/Food") }}>Other</h1></li>
                            <li><a onClick={() => { navigate("/products/Catnip") }}>Catnip</a></li>
                            <li><a onClick={() => { navigate("/products/Treats") }}>Treats</a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() => { navigate("/products/Litter") }}>LITTER</a>
                        <ul className="dropdown">
                            <li><h1 onClick={() => { navigate("/products/Litter") }}>Accessories</h1></li>
                            <li><a onClick={() => { navigate("/products/Litter Boxes") }}>Litter Boxes</a></li>
                            <li><a onClick={() => { navigate("/products/Litter Mats") }}>Litter Mats</a></li>
                            <li><a onClick={() => { navigate("/products/Litter Scoops") }}>Litter Scoops</a></li>
                            <li><a onClick={() => { navigate("/products/Odor Control") }}>Odor Control</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>

            <Modal 
                className="cartModal" 
                contentClassName="cartModalContainer" 
                show={showCartModal} 
                onClose={() => { setShowCartModal(false); }}
            >
                <h1>Your Cart</h1>
                <div className="cartItemOuterContainer">
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((item, index) => (
                                <div key={index} className="cartItemContainer">
                                    <img src={item.product.imageUrls[0]} alt="Product" />
                                    <div className="cartProductInfo">
                                        <div>
                                            <div className="cartContainer1">
                                                <p>{item.product.name}</p>
                                                <button 
                                                    className="rmvItemBtn" 
                                                    onClick={() => {
                                                        setConfirmModal({
                                                            status: true,
                                                            productId: item.product._id,
                                                            productName: item.product.name
                                                        });
                                                    }}
                                                >
                                                    x
                                                </button>
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
                            <p className="cartTotal"> Total: ${totalPrice} </p>
                            <button className="checkoutBtn" onClick={() => { navigate(`/checkout/${totalPrice}`) }}>
                                Proceed to Checkout
                            </button>
                        </>
                    ) : (
                        <p>There are currently no items in your cart. Start shopping today!</p>
                    )}
                </div>
            </Modal>

            <Modal show={confirmModal.status} onClose={() => {updateConfirmValues("status", false)}}>
                <div className="confirmModalContainer">
                    <p> Are you sure you want to remove this product from your cart? </p>
                    <h1> {confirmModal.productName} </h1>
                    <div className="btnContainer">
                        <button className="removeBtn" onClick={() =>{removeCartItem()}}> Confirm </button> 
                        <button className="cancelBtn" onClick={() =>{updateConfirmValues("status", false)}}> Cancel </button>
                    </div>
                </div>
            </Modal>
        </header>
    )
}