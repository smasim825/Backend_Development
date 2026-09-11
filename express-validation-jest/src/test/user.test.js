const request = require('supertest');
const app = require('../app');

describe('User Endpoints & Validation', () => {

    describe('GET /api/user/profile', () => {
        it('should return user profile details', async () => {
            const res = await request(app).get('/api/user/profile');

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.user).toHaveProperty('username');
            expect(res.body.user).toHaveProperty('email');
        });
    });

    describe('PUT /api/user/profile', () => {
        it('should update user profile successfully with valid data', async () => {
            const res = await request(app)
                .put('/api/user/profile')
                .send({
                    age: 25,
                    role: 'artist'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.updatedFields.age).toBe(25);
            expect(res.body.updatedFields.role).toBe('artist');
        });

        it('should fail validation when age is under 18', async () => {
            const res = await request(app)
                .put('/api/user/profile')
                .send({
                    age: 15
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.errors[0].message).toBe('Age must be an integer between 18 and 100');
        });

        it('should fail validation when role is invalid', async () => {
            const res = await request(app)
                .put('/api/user/profile')
                .send({
                    role: 'superman'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.errors[0].message).toBe('Role must be user, artist, or admin');
        });
    });
});
