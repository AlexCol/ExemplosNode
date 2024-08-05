import request from 'supertest';
import { app, Shutdown } from '../../src/server';

describe("Our application", () => {
  afterAll((done) => {
    Shutdown(done);
  });

  it("Starts and has the proper test envionment", async () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(app).toBeDefined();
  }, 10000);

  it('Returns all options allowed to be called by customers(http methods)', async () => {
    const response = await request(app).options('/');
    expect(response.status).toBe(200);
    expect(response.headers['acces-control-allow-methods']).toBe('PUT, POST, PATCH, DELETE, GET');
  })
});