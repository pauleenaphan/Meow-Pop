// import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import "../styles/nav.css";

export const Navbar = () =>{
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('isLogged') === 'true';

    const handleUserIconClick = () => {
        if (isLoggedIn) {
            navigate("/account");
        } else {
            navigate("/login");
        }
    };

    return(
        <header> 
            <section className="subHeader">
                <div className="subContainer">
                    <a className="title" href="/">MeowPop</a>
                    <p className="caption">Everything your cat deserves</p>
                </div>
                <div className="icons">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <FontAwesomeIcon icon={faCartShopping}/>
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
        </header>
    )
}