/*
    Supertest: Used to test HTTP endpoints by making request to the server and checking responses
    Jest: Provides tools for running test and managing test results
 */

const request = require('supertest');
const app = require('../app'); // Adjust the path as needed

describe('Auth Routes', () => {
    // Test for user registration
    it('should register a new user', async () => {
        const response = await request(app)
        .post('/signup')
        .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(201);
        expect(response.text).toBe('User registered');
    });

    // Test for user login
    it('should login a user and return a token', async () => {
        // Register a user first
        await request(app)
        .post('/signup')
        .send({
            username: 'loginuser',
            email: 'loginuser@example.com',
            password: 'password123'
        });

        // Log in
        const response = await request(app)
        .post('/login')
        .send({
            email: 'loginuser@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.role).toBe('user');
    });
});
