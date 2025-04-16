/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from '../components/Navbar';
import "../styles/products.css";

import { Product } from "../types/productTypes";
import { getProductsByCategory } from "../api/productAPI";
import { categories } from "../data/categories";

export const Products = () =>{
    const navigate = useNavigate();
    const { category } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    
    const handleCategoryClick = (mainCategory: string) => {
        setExpandedCategory(expandedCategory === mainCategory ? null : mainCategory);
    };

    const getProducts = async () =>{
        const products = await getProductsByCategory(category);
        setProducts(products);
    }
    
    useEffect(() => {
        getProducts();
    }, [category]);

    return(
        <div>
        <Navbar />
        <div className="productPageContainer">
            <div className="categorySideContainer">
                {categories.map(([mainCategory, subCategories]) => (
                    <div
                        key={mainCategory}
                        className="categoryContainer"
                    >
                        <p
                            className="mainCategory"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(mainCategory);
                            }}
                        >
                            {mainCategory}
                        </p>
                        <div
                            className={`subCategoryDropdown ${expandedCategory === mainCategory ? 'open' : 'closed'}`}
                        >
                            {subCategories.map(subCategory => (
                                <p
                                    key={subCategory}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/products/${subCategory}`);
                                    }}
                                >
                                    {subCategory}
                                </p>
                            ))}
                        </div>
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
                <div className="allProducts">
                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product._id} className="productContainer" onClick={() => { navigate(`/productView/${product._id}`) }}>
                                <img src={product.imageUrls[0]} alt="product img"/>
                                <p>{product.name}</p>
                                <p>${product.price}</p>
                            </div>
                        ))
                    ) : (
                        <p> Loading Products... </p>
                    )}
                </div>
            </div>
        </div>
    </div>
    )
    
}