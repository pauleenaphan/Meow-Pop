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
                        <a className="categories" onClick={() =>{ navigate("/products/Clothes,Accessories")}}>APPAREL</a>
                        <ul className="dropdown">
                            <li><h1> Clothing </h1></li>
                                <li><a> Hats </a></li>
                                <li><a> Socks </a></li>
                                <li><a> Costumes </a></li>
                            <li><h1> Accessories </h1></li>  
                                <li><a> Collars & Leashes </a></li>
                                <li><a> Harnesses </a></li>
                                <li><a> Carriers </a></li>
                                <li><a> Bowties </a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() =>{ navigate("/products/Grooming,Health")}}>PET CARE</a>
                        <ul className="dropdown">
                            <li><h1> Grooming </h1></li>
                                <li><a> Combs & Brushes </a></li>
                                <li><a> Nail Clippers </a></li>
                                <li><a> Shampoos & Conditioners </a></li>
                                <li><a> Ear Cleaners </a></li>
                            <li><h1> Health </h1></li>
                                <li><a> Dental Treats </a></li>
                                <li><a> Dental Care </a></li>
                                <li><a> Vitamins & Supplements </a></li>
                                <li><a> Flea & Tick Prevention </a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() =>{ navigate("/products/Toys")}}>TOYS</a>
                        <ul className="dropdown">
                            <li><h1> Interactive </h1></li>
                                <li><a> String Toys </a></li>
                                <li><a> Balls </a></li>
                                <li><a> Laser pointers </a></li>
                                <li><a> Catnip toys </a></li>
                                <li><a> Plush Toys </a></li>
                        </ul>
                    </li> 
                    <li>
                        <a className="categories" onClick={() =>{ navigate("/products/Furniture")}}>FURNITURE</a>
                        <ul className="dropdown">
                            <li><h1> Sleeping </h1></li>
                                <li><a> Beds </a></li>
                                <li><a> Window Perches </a></li>
                            <li><h1> Scratching </h1></li>
                                <li><a> Scratching Post </a></li>
                                <li><a> Cat Trees </a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() =>{ navigate("/products/Food")}}>FOOD</a>
                        <ul className="dropdown">
                            <li><h1> Standard </h1></li>
                                <li><a> Hard Food </a></li>
                                <li><a> Wet Food </a></li>
                                <li><a> Grain-Free food </a></li>
                            <li><h1> Other </h1></li>
                                <li><a> Catnip </a></li>
                                <li><a> Treats </a></li>
                        </ul>
                    </li>
                    <li>
                        <a className="categories" onClick={() =>{ navigate("/products/Litter")}}>LITTER</a>
                        <ul className="dropdown">
                            <li><h1> Accessories </h1></li>
                                <li><a> Litter Boxes </a></li>
                                <li><a> Litter Mats </a></li>
                                <li><a> Litter Scoops </a></li>
                                <li><a> Odor Control </a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    )
}