import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';

type UserData = {
    email: string;
    password: string;
};

export const Login = () =>{
    const navigate = useNavigate(); 
    const [userData, setUserData] = useState<UserData>({
        email: "",
        password: "",
    })

    const [loginStatus, setLoginStatus] = useState("");

    const updateUserData = (postField: keyof UserData, userInput: string) =>{
        setUserData(prevData => ({
            ...prevData,
            [postField]: userInput
        }))
    }

    const handleSubmit = async (e: FormEvent) =>{
        e.preventDefault();
        const { email, password } = userData;

        try{
            const response = await fetch(`http://localhost:3001/auth/login`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: 'cors',
                body: JSON.stringify({ email, password })
            });

            if(response.ok){
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userRoleId', data.roleId);
                localStorage.setItem('isLogged', "true");

                navigate("/");
            }else{
                setLoginStatus(await response.text());
            }
        }catch(error){
            console.error("Error logging in: ", error);
        }
    }

    return(
        <div>
            <Header/>
            <div className="loginPage">
                <h1> Login </h1>
                <form className="loginForm" onSubmit={handleSubmit}>
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
                        <label> Password: </label>
                        <input 
                            type="password" 
                            placeholder="Password"
                            onChange={(e) => updateUserData('password', e.target.value)}
                        ></input>
                    </div>
                    
                    <button type="submit"> Login </button>
                </form>
                <p className="statusmsg"> {loginStatus} </p>
                <div className="captionContainer">
                    <p> Don't have an account?</p>
                    <button onClick={()=> navigate("/signup")}> Sign up </button>
                </div>
            </div>
        </div>
    )
}