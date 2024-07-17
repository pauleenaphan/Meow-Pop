const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

let userToken = '';
let itemId = "6696ca8b6f7658ecc4cb59da";

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

describe.only("Cart Routes", () =>{
    it("Should add a new item to the user's cart", async() =>{
        console.log("USER TOKEN in add item :", userToken);
        const response = await request(app)
            .post(`/cart/addItem/${itemId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                productId: itemId,
                quantity: 2
            })

        expect(response.status).toBe(201);
        expect(response.body.items).toEqual(expect.arrayContaining([
            expect.objectContaining({ product: itemId, quantity: 2 })
        ]));
    })

    it("Should retrieve the user's cart with product details and quantities", async () => {
        const response = await request(app)
            .get('/cart/viewCart')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        console.log('User Cart:', response.body);

        // Example assertions
        expect(response.body.items).toBeInstanceOf(Array);

        // Check that items include product details and quantity
        response.body.items.forEach(item => {
            expect(item).toHaveProperty('product');
            expect(item).toHaveProperty('quantity');
        });
    });

    it("Should edit quantity in cart", async() =>{
        const response = await request(app)
            .patch(`/cart/editCart/${itemId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                quantity: 5
            })
            .expect(200);

        const updatedItem = response.body.items.find(item => item.product.toString() === itemId);
        expect(updatedItem).toHaveProperty('quantity', 5);
    })

    it("Should remove item from the cart", async() => {
        // Add the item again with a different quantity to test updating
        await request(app)
            .delete(`/cart/removeItem/${itemId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
    });
})

