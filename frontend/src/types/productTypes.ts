// single product 
export interface Product {
    _id?: string; 
    name: number; 
    description: string; 
    category: string; 
    subCategory: string; 
    stock: number; 
    price: string; 
    imageUrls: string[];
    vendor? : {
        storeName: string;
    }
}