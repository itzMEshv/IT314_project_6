const request = require('supertest');

const baseURL = 'http://localhost:3000';

describe('GET /', () => {
  test('should return status 200 for welcome page', async () => {
    const res = await request(baseURL).get('/');
    expect(res.status).toEqual(200);
  });
});
describe('GET /', () => {
  test('should return status 200 for instructor registration page', async () => {
    const res = await request(baseURL).get('/register/instructor');
    expect(res.status).toEqual(200);
  });
  test('should return status 200 for student registration page', async () => {
    const res = await request(baseURL).get('/register/student');
    expect(res.status).toEqual(200);
  });
});


// npm test -- register_test.spec.js