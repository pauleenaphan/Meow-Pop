export const LoginUser = async(email: string, password: string) =>{
    try{
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/auth/login`,{
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
            GetUser(email);

            return true;
        }else{
            return await response.text();
        }
    }catch(error){
        console.error("Error logging in: ", error);
    }
}

export const GetUser = async(userEmail: string) =>{
    try{
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/auth/getUser/${userEmail}`,{
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