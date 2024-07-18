import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';
import "../styles/account.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMoneyBill, faClockRotateLeft, faGear } from '@fortawesome/free-solid-svg-icons';

export const Account = () =>{
    const navigate = useNavigate();
    const [currContent, setCurrContent] = useState<string>("profile");



    const renderContent = () => {
        switch (currContent) {
            case "profile":
                return (
                    <div>
                        <h1>Profile </h1>
                        <p>
                            Email and user info I still need to make the endpoints
                        </p>
                    </div>
                );
            case "vendor":
                if (localStorage.getItem("userRole") === "vendor") {
                    return (
                        <div>
                            <h1> Vendor </h1>
                        </div>
                    );
                } else {
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

                            <form className="vendorForm">

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
                        <button onClick={() =>{
                            localStorage.setItem("isLogged", "false");
                            navigate('/')
                        }}> Log out </button>
                        {/* Add settings content here */}
                    </div>
                );
            default:
                return null; // Render nothing if currContent is empty or undefined
        }
    };

    return(
        <div>
            <Header/>
            <div className="accPageContainer">
                <div className="sideContainer">
                    <div className="rowContainer" onClick={() => setCurrContent("profile")}>
                        <FontAwesomeIcon icon={faUser}/>
                        <a> Profile </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("vendor")}>
                        <FontAwesomeIcon icon={faMoneyBill}/>
                        <a> Vendor </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("purchases")}>
                        <FontAwesomeIcon icon={faClockRotateLeft}/>
                        <a> Purchase History </a>
                    </div>
                    <div className="rowContainer" onClick={() => setCurrContent("settings")}>
                        <FontAwesomeIcon icon={faGear}/>
                        <a> Settings </a>
                    </div>
                </div>
                <div className="divider"></div>

                <div className="contentContainer">
                    {renderContent()}
                </div>
            </div>
            
        </div>
        
    )
}