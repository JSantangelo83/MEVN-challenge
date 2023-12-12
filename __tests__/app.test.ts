import request from 'supertest';
import app from '../src/app';

describe('Express app', () => {
  it('should respond with a 404 for non-existent routes', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
  });

  it('should respond with a 200 for the /ping route', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });
});