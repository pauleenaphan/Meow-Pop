const token = localStorage.getItem("token");
const vendorId = localStorage.getItem("userRoleId");

export const createVendor = async (event: React.FormEvent, name: string, description: string) =>{
    event.preventDefault(); // Prevent default form submission
    try {
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/createVendor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ storeName: name, storeDescription: description }),
        });
        if (response.ok) {
            alert("Thank you for submitting your request! Please login again to check your status");
            localStorage.setItem("isLogged", "false");
            return true;
        }
    } catch (error) {
        console.error("Error creating vendor", error);
    }
}

export const viewVendor = async() =>{
    try {
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/viewVendor/${vendorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
        }

        const data = await response.json();
        console.log("vendor data", data);
        return data;
    } catch (error) {
        console.error("Error getting specific vendor", error);
    }
}

export const editVendor = async(name: string, desc: string) =>{
    try{
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/vendor/editVendor/${vendorId}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            mode: "cors",
            body: JSON.stringify({ storeName: name, storeDescription: desc })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
        }
        
        alert("Vendor has been edited");
        viewVendor();
        return true;
    }catch(error){
        console.error("Error editing vendor");
    }
}