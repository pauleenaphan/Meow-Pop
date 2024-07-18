// import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import "../styles/nav.css";

export const Header = () =>{
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
        </header>
    )
}