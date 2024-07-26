import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header';
import "../styles/login-create.css";
import catShopping from "../assets/catShopping.jpg";

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
                localStorage.setItem('cartId', data.cartId);
                getUser();

                navigate("/");
            }else{
                setLoginStatus(await response.text());
            }
        }catch(error){
            console.error("Error logging in: ", error);
        }
    }

    const getUser = async() =>{
        try{
            const response = await fetch(`http://localhost:3001/auth/getUser/${userData.email}`,{
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                },
                mode: "cors",
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }

            const data = await response.json();
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userName", data.username);
        }catch(error){
            console.error("Errong getting user");
        }
    }

    

    return(
        <div>
            <Header/>
            <div className="loginPage">
                <img src={ catShopping } alt="cat shopping img"/>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <h1 className="header"> Welcome Back! </h1>
                    <p className="statusmsg"> {loginStatus} </p>
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
                    
                    <button className="subbtn" type="submit"> Login </button>
                    
                    <div className="captionContainer">
                        <p> Don't have an account?</p>
                        <button className="signupBtn" onClick={()=> navigate("/signup")}> Sign up </button>
                    </div>
                </form>
            </div>
        </div>
    )
}