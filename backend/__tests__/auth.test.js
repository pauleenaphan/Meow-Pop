const request = require('supertest');
const app = require('../app');

describe('Auth Setup', () => {
    it('should register a vendor', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                username: 'testvendor',
                email: 'testvendor@example.com',
                password: 'password123',
                role: 'vendor'
            });

        expect(response.status).toBe(201);
        expect(response.text).toBe('User registered');
    });

    it('should register a user', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                username: 'testUser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'user'
            });

        expect(response.status).toBe(201);
        expect(response.text).toBe('User registered');
    });

    it('should register an admin', async () => {
        const response = await request(app)
            .post('/signup')
            .send({
                username: 'testAdmin',
                email: 'testadmin@example.com',
                password: 'password123',
                role: 'admin'
            });

        expect(response.status).toBe(201);
        expect(response.text).toBe('User registered');
    });

    it('should log in as vendor and get a token', async () => {
        // Register the vendor if not already registered
        await request(app)
            .post('/signup')
            .send({
                username: 'testvendor',
                email: 'testvendor@example.com',
                password: 'password123',
                role: 'vendor'
            });

        // Log in to get a token
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testvendor@example.com',
                password: 'password123'
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
        expect(loginResponse.body).toHaveProperty('role', 'vendor');
    });
});
