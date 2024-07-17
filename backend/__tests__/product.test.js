const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

// Variables to store IDs
let vendorToken = '';
let vendorId = '';
let createdProductId = '';

beforeAll(async () => {
    // Login as an existing vendor to get the token
    const loginResponse = await request(app)
        .post('/login')
        .send({
            email: 'testvendor@example.com', // Use the existing vendor's email
            password: 'password123'          // Use the existing vendor's password
        });

    vendorToken = loginResponse.body.token;
    vendorId = loginResponse.body.roleId;
});

describe("Product Routes", () => {
    it("Should create a new item", async () => {
        const response = await request(app)
            .post(`/product/createProduct/${vendorId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .send({
                name: "pink collar",
                description: "pink collar with jewels on it",
                category: "accessories",
                subCategory: "collars",
                stock: 30,
                price: 12,
                imageUrl: "https://meow-pop-items.s3.us-east-2.amazonaws.com/189971_MAIN._AC_SL1200_V1709924818_.avif",
                vendor: vendorId
            });

        //saves productID so we can modify a specific product
        createdProductId = response.body._id;
        expect(response.status).toBe(201);
    });

    it("Should create another item", async () => {
        const response = await request(app)
            .post(`/product/createProduct/${vendorId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .send({
                name: "long cat tree",
                description: "blue cat tree with clouds as cat paddings",
                category: "furniture",
                subCategory: "trees",
                stock: 10,
                price: 30,
                imageUrl: "https://meow-pop-items.s3.us-east-2.amazonaws.com/OIP.jpg",
                vendor: vendorId
            });

        expect(response.status).toBe(201);
    });

    it("Should view all products", async () => {
        const response = await request(app)
            .get('/product/getAllProducts')
            .expect(200);

        console.log('ALL PRODUCTS', response.body);
    });

    it("Should get a product by ID", async () => {
        console.log("CREATED VENDOR ID", vendorId);
        const response = await request(app)
            .get(`/product/getProduct/${createdProductId}`)
            .expect(200);

        console.log("this res body", response.body);

        expect(response.body).toHaveProperty('name', 'pink collar');
        expect(response.body.vendor._id).toBe(vendorId);
        expect(response.body).toHaveProperty('stock', 30);

        console.log("SPECIFIC PRODUCT", response.body);
    });

    it("Should edit a product by ID", async () => {
        const response = await request(app)
            .patch(`/product/editProduct/${createdProductId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .send({
                name: "light pink collar"
            })
            .expect(200);

        expect(response.body).toHaveProperty('name', 'light pink collar');
        expect(response.body).toHaveProperty('stock', 30);
    });

    it("Should remove a product by ID", async () => {
        await request(app)
            .delete(`/product/deleteProduct/${createdProductId}/${vendorId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .expect(200);
    });

    it("Should return 404 when trying to retrieve the deleted product", async () => {
        await request(app)
            .get(`/product/getProduct/${createdProductId}`)
            .expect(404);
    });
});
