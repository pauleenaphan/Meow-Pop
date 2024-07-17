const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

// Variables to store IDs
let vendorToken = '';
let createdVendorId = '';

beforeAll(async () => {
    const loginResponse = await request(app)
        .post('/login')
        .send({
            email: 'testvendor@example.com',
            password: 'password123'
        });

    vendorToken = loginResponse.body.token;

    // Create a vendor using the token
    const vendorResponse = await request(app)
        .post('/vendor/createVendor')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send({
            storeName: "cutestKit",
            storeDescription: "Cutest cat accessories here"
        });

    createdVendorId = vendorResponse.body._id;
});

describe("Vendor Routes", () => {
    it("should create a new vendor", async () => {
        expect(createdVendorId).toBeTruthy(); // Ensure vendor was created
    });

    it("should view a vendor by ID", async () => {
        const response = await request(app)
            .get(`/vendor/viewVendor/${createdVendorId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .expect(200);

        expect(response.body).toHaveProperty('_id', createdVendorId);
        expect(response.body).toHaveProperty('storeName', 'cutestKit');
        expect(response.body).toHaveProperty('storeDescription', 'Cutest cat accessories here');
    });

    it("should edit a vendor's store", async () => {
        const response = await request(app)
            .put(`/vendor/editVendor/${createdVendorId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .send({
                storeName: "CuterKits"
            })
            .expect(200);

        expect(response.body).toHaveProperty('storeName', 'CuterKits');
        expect(response.body).toHaveProperty('storeDescription', 'Cutest cat accessories here');
    });

    it("should return 404 for a non-existent vendor", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/vendor/viewVendor/${nonExistentId}`)
            .set('Authorization', `Bearer ${vendorToken}`)
            .expect(404);

        expect(response.text).toBe("Vendor not found");
    });
});
