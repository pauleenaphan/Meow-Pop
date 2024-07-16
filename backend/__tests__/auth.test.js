const request = require('supertest');
const app = require('../app');

let vendorToken = '';

beforeAll(async () => {
    // Register a new vendor
    await request(app)
        .post('/signup')
        .send({
            username: 'testvendor',
            email: 'testvendor@example.com',
            password: 'password123',
            role: 'vendor'
        });

    // Log in as vendor to get a token
    const loginResponse = await request(app)
        .post('/login')
        .send({
            email: 'testvendor@example.com',
            password: 'password123'
        });

    vendorToken = loginResponse.body.token;
    global.vendorToken = vendorToken; // Set the token as a global variable
});

describe('Auth Setup Tests', () => {
    it('should set a global vendorToken', () => {
        expect(global.vendorToken).toBeDefined();
    });
});
