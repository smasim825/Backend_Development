const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints & Validation', () => {

    describe('POST /api/auth/register', () => {
        it('should register successfully with valid inputs', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'johnDoe',
                    email: 'john@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.user.username).toBe('johnDoe');
        });

        it('should return 400 validation error when email is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'johnDoe',
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: 'email', message: 'Please provide a valid email address' })
                ])
            );
        });

        it('should return 400 validation error when password is too short', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'johnDoe',
                    email: 'john@example.com',
                    password: '123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: 'password', message: 'Password must be at least 6 characters long' })
                ])
            );
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.token).toBeDefined();
        });

        it('should return 400 validation error if password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
        });
    });
});
