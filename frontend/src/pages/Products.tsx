/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../components/Navbar';
import "../styles/products.css";

export const Products = () =>{
    const navigate = useNavigate();
    const { category } = useParams();
    const [products, setProducts] = useState<{
        products: { _id: string; name: number; description: string; category: string; 
                subCategory: string; stock: number; price: string; imageUrls: string[] }[]; 
    }>({
        products: []
    });
    const isDivisibleByFour = products.products.length % 4 === 0; //checks so that we can fix spacing

    const [categories] = useState<[string, string[]][]>([
        ["Clothes", ["Costumes", "Hats", "Socks"]],
        ["Toys", ["String Toys", "Balls", "Catnip Toys", "Plush Toys", "Laser Pointers"]],
        ["Accessories", ["Collars", "Leashes", "Harnesses", "Bow Ties", "Carriers"]],
        ["Furniture", ["Beds", "Trees", "Scratching Posts", "Window Perches"]],
        ["Food", ["Dry Food", "Wet Food", "Grain-Free Food", "Dental Treats", "Catnip"]],
        ["Health", ["Vitamins", "Supplements", "Flea Prevention", "Tick Prevention"]],
        ["Grooming", ["Brushes", "Combs", "Nail Clippers", "Shampoos", "Conditioners", "Ear Cleaners", "Dental Care"]],
        ["Litter", ["Litter Boxes", "Litter Mats", "Litter Scoops", "Odor Control"]]
    ]);

    const getProducts = async () => {
        console.log(category);
        try {
            const params = new URLSearchParams();
            if (category) {
                const categories = category.split(',');
                categories.forEach(cat => params.append('category', cat));
            }
    
            const url = `http://localhost:3001/product/getAllProducts?${params.toString()}`;
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
            setProducts({ products: data });
    
        } catch (error) {
            console.error("Error getting products", error);
        }
    };

    const getSubcategories = () => {
        if (!category) return [];
        
        const categoryList = category.split(',');
        const subcategories = categoryList.map(cat => {
            // Check if 'cat' is a main category
            const categoryPair = categories.find(([mainCategory]) => mainCategory === cat);
            
            if (categoryPair) {
                // If 'cat' is a main category, return its subcategories
                return { mainCategory: cat, subCategories: categoryPair[1] };
            } else {
                // Check if 'cat' is a subcategory of any main category
                const mainCategoryPair = categories.find(([mainCategory, subCategories]) =>
                    subCategories.includes(cat)
                );
                
                // If found, return the main category and its subcategories
                if (mainCategoryPair) {
                    return { mainCategory: mainCategoryPair[0], subCategories: mainCategoryPair[1] };
                }
                
                // If 'cat' is neither a main category nor a valid subcategory
                return { mainCategory: cat, subCategories: [] };
            }
        });
        
        return subcategories;
    };

    const subcategories = getSubcategories();
    
    useEffect(() => {
        getProducts();
    }, [category]);

    return(
        <div>
        <Navbar />
        <div className="productPageContainer">
            <div className="categorySideContainer">
                <h1>Products</h1>
                {subcategories.map(({ mainCategory, subCategories }) => (
                    <div key={mainCategory} onClick={(e) =>{ 
                        e.stopPropagation();
                        navigate(`/products/${mainCategory}`)}}
                        className="categoryContainer">
                        <p className="mainCategory">{mainCategory}</p>

                        {subCategories.map(subCategory => (
                            <p key={subCategory} onClick={(e) =>{ 
                                e.stopPropagation();
                                navigate(`/products/${subCategory}`)}}>{subCategory}</p>
                        ))}
                    </div>
                ))}
            </div>
            <div className="productDivider"></div>
            {/* print category at h1 and subcategories as p */}
            <div className="productOuterContainer">
                <div className="productHeaderInfo">
                    <p> Showing results 1...3</p>
                    <p> Sort By: Ratings </p>
                </div>
                <div className={`allProducts ${isDivisibleByFour ? 'evenSpacing' : 'defaultSpacing'}`}>
                    {products.products.length > 0 ? (
                        products.products.map(product => (
                            <div key={product._id} className="productContainer" onClick={() => { navigate(`/productView/${product._id}`) }}>
                                <img src={product.imageUrls[0]} alt="product img"/>
                                <p>{product.name}</p>
                                <p>${product.price}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </div>
        
    </div>
    )
    
}