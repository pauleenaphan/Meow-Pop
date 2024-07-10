const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Vendor = require('../models/vendor'); 

//generate a valid JWT token for testing
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//example user to test with
const testUser = {
    _id: '668efc7c7815493960ce9ca7',
    role: 'vendor'
};

//used to save vendor's store ID
let createdVendorId = "";
const token = generateToken(testUser);

beforeAll(async () => {
    // Create a vendor before running tests
    const response = await request(app)
        .post('/vendor/createVendor')
        .set('Authorization', `Bearer ${token}`)
        .send({
            storeName: "cutestKit",
            storeDescription: "Cutest cat accessories here",
        });

    //save the vendor's store ID
    createdVendorId = response.body._id;
});

afterAll(async () => {
    // await Vendor.deleteMany({ 'user': testUser._id }); //remove user we added to the db
    await mongoose.connection.close(); //close the database connection
});

describe("Vendor Routes", () => {
    it("should create a new vendor", async () => {
        expect(createdVendorId).toBeTruthy(); //ensure vendor was created
    });

    it("should view a vendor by ID", async () => {
        const response = await request(app)
            .get(`/vendor/viewVendor/${createdVendorId}`)
            .expect(200);

        expect(response.body).toHaveProperty('_id', createdVendorId);
        expect(response.body).toHaveProperty('storeName', 'cutestKit');
        expect(response.body).toHaveProperty('storeDescription', 'Cutest cat accessories here');
    });

    it("should edit a vendor's store", async() =>{
        const response = await request(app)
            .put(`/vendor/editVendor/${createdVendorId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                storeName: "CuterKits"
            })
            .expect(200)

            expect(response.body).toHaveProperty('storeName', 'CuterKits');
            expect(response.body).toHaveProperty('storeDescription', 'Cutest cat accessories here');
    })

    it("should return 404 for a non-existent vendor", async () => {
        //creates a random ID
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/vendor/viewVendor/${nonExistentId}`)
            .expect(404);

        expect(response.text).toBe("Vendor not found");
    });
});
