// single product 
export interface Product {
    _id?: string; 
    name: string; 
    description: string; 
    category: string; 
    subCategory: string; 
    stock: number; 
    price: string; 
    imageUrls: (string | File)[];
    vendor? : {
        storeName: string;
    }
}

export interface PurchaseDetails {
    orderNumber: string;
    purchaseDate: string;
    items: {
        productId: {
            _id: string;
            name: string;
            description: string;
            price: number;
            imageUrls: string[];
            category: string;
            subCategory: string;
            stock: number;
            vendor: string;
        };
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    paymentDetails: {
        cardName: string;
        cardNumber: number;
        cardExpire: number;
        cardCVV: number;
    };
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}