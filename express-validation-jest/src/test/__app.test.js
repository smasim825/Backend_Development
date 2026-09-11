const request = require('supertest');
const app = require('../app');

describe('API Health Check Endpoint GET /', () => {
    it('should return status 200 and success message', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: 'success',
            message: 'API is running smoothly'
        });
    });
});
