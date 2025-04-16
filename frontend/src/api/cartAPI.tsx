const token = localStorage.getItem("token");
const isLogged = localStorage.getItem("isLogged");

export const addToCart = async (quantity?: number, productId?: string) =>{
    if(isLogged == "false"){
        alert("You need to login in order to add items to your cart");
        return;
    }
    try{
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/cart/addItem/${productId}`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: quantity })
        })
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`); 
        }

        alert("item added to cart");

    }catch(error){
        console.error("Error adding item to cart");
    }
}