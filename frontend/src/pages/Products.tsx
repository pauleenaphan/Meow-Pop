import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../components/Navbar';

export const Products = () =>{
    const { category } = useParams();
    const [products, setProducts] = useState<{
        products: { _id: string; name: number; description: string; category: string; 
                subCategory: string; stock: number; price: string; imageUrls: string[] }[]; 
    }>({
        products: []
    });


    const getProducts = async () =>{
        try{
            const params = new URLSearchParams();
            if (category) {
                params.append('category', category);
                // Add additional categories if needed
                // params.append('category', 'AnotherCategory');
            }
            const response = await fetch(`http://localhost:3001/product/getAllProducts?${params.toString()}`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json"
                },
                mode: "cors"
            })

            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            setProducts({ products: data });

        }catch(error){
            console.error("Error getting products");
        }
    }

    useEffect(() => {
        getProducts();
    }, [category]);

    return(
        <div>
        <Navbar />
        <h1>Products</h1>
        {category && <p>Category: {category}</p>}
        <div>
            {products.products.length > 0 ? (
                products.products.map(product => (
                    <div key={product._id} style={{ marginBottom: '20px' }}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Category: {product.category}</p>
                        <p>Sub Category: {product.subCategory}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Price: ${product.price}</p>
                        <div>
                            {product.imageUrls.map((imageUrl, index) => (
                                <img key={index} src={imageUrl} alt={`Product ${product._id} image ${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
    </div>
    )
    
}