import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';

type UserData = {
    email: string;
    username: string;
    password: string;
    confirmPass: string;
};

export const Signup = () =>{
    const navigate = useNavigate(); 
    const [userData, setUserData] = useState<UserData>({
        email: "",
        username: "",
        password: "",
        confirmPass: "",
    })
    const [signupStatus, setSignupStatus] = useState<string>("");

    const updateUserData = (postField: keyof UserData, userInput: string) =>{
        setUserData(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { email, username, password, confirmPass } = userData;

        if(password !== confirmPass){
            setSignupStatus("Passwords don't match");
            return;
        }

        try{
            const response = await fetch(`http://localhost:3001/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: 'cors',
                body: JSON.stringify({ email, username, password }),
            });

            if(response.ok){
                alert("User registered successfully");
                navigate("/login");
            }else{
                setSignupStatus(await response.text());
            }
        }catch(error){
            console.error("Error registering user:", error);
            alert("Server error");
        }
    };
    
    return(
        <div>
            <Header/>
            <div className="signupPage">
                <h1> Signup </h1>
                <form className="signupForm" onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <label> Email: </label>
                        <input 
                            type="text" 
                            placeholder="Email"
                            onChange={(e) => updateUserData('email', e.target.value)}
                            required={true}
                        ></input>
                    </div>
                    <div className="inputContainer">
                        <label> Username: </label>
                        <input 
                            type="text" 
                            placeholder="Name"
                            onChange={(e) => updateUserData('username', e.target.value)}
                            required={true}
                        ></input>
                    </div>
                    <div className="inputContainer">
                        <label> Password: </label>
                        <input 
                            type="password" 
                            placeholder="Password"
                            onChange={(e) => updateUserData('password', e.target.value)}
                            required={true}
                        ></input>
                    </div>
                    <div className="inputContainer">
                        <label> Confirm Password: </label>
                        <input 
                            type="password" 
                            placeholder="Confirm Password"
                            onChange={(e) => updateUserData('confirmPass', e.target.value)}
                            required={true}
                        ></input>
                    </div>
                    <button type="submit"> Signup </button>
                </form>
                <p className="statusmsg"> {signupStatus} </p>
                <div className="captionContainer">
                    <p> Already have an account? </p>
                    <button onClick={() => navigate("/login")}> Login </button>
                </div>
            </div>
        </div>
    )
}