const token = localStorage.getItem("token");
const isLogged = localStorage.getItem("isLogged");

export const getProductsByCategory = async (category?: string) =>{
    console.log(category);
    try {
        const params = new URLSearchParams();
        if (category) {
            const categories = category.split(',');
            categories.forEach(cat => params.append('category', cat));
        }

        const url = `https://backend-wild-log-8565.fly.dev/product/getAllProducts?${params.toString()}`;
        console.log(`Fetching: ${url}`);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error getting products", error);
    }
}

export const getProduct = async(productId?: string) =>{
    try{
        const response = await fetch(`https://backend-wild-log-8565.fly.dev/product/getProduct/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            mode: "cors"
        })
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
        }

        const data = await response.json();
        // setCurrProduct({
        //     name: data.name,
        //     description: data.description,
        //     category: data.category,
        //     subCategory: data.subCategory,
        //     stock: data.stock,
        //     price: data.price,
        //     imageUrls: data.imageUrls,
        //     vendor: {
        //         storeName: data.vendor.storeName
        //     }
        // });
        return data;
    }catch(error){
        console.error("Error getting product")
    }
}