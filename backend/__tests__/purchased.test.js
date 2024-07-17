const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

let userToken = '';
let cartId = "6697440fad07c0e0183ff6e7";
let purchaseId = '';

beforeAll(async () => {
    // Login as an existing vendor to get the token
    const loginResponse = await request(app)
        .post('/login')
        .send({
            email: 'testuser@example.com', // Use the existing vendor's email
            password: 'password123'          // Use the existing vendor's password
        });

    userToken = loginResponse.body.token;
    console.log("USER TOKEN in login:", userToken);
});

describe.only("Purchase Routes", () =>{
    it("Should complete purchase", async() =>{
        const response = await request(app)
            .post(`/purchase/buyItems/${cartId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                paymentDetails:{
                    transactionId: '38218c',
                    paymentMethod: 'Credit Card'
                },
                shippingAddress: {
                    street: '123 Cat Street',
                    city: 'Cat City',
                    state: 'CA',
                    postalCode: '90001',
                    country: 'USA'
                }
            })
            .expect(200);

        expect(response.body.paymentDetails.transactionId).toBe('38218c');
        purchaseId = response.body._id;
    })

    it("Should view all purchase", async() =>{
        const response = await request(app)
            .get(`/purchase/getAllPurchases/`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200)

        console.log("Purchase History", response.body);
    })

    it("Should view specific purchases", async() =>{
        const response = await request(app)
            .get(`/purchase/getPurchase/${purchaseId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200)
    })
})