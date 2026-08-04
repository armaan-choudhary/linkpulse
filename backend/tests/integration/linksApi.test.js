import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { Link } from '../../src/models/link.model.js';

describe('Links API Integration Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Link.deleteMany({});
  });

  describe('GET /health', () => {
    it('returns 200 ok with database status and uptime', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.database).toBe('connected');
      expect(res.body.data).toHaveProperty('uptime');
    });
  });

  describe('POST /api/v1/links', () => {
    it('creates a short link for valid https destination', async () => {
      const res = await request(app)
        .post('/api/v1/links')
        .send({ url: 'https://www.google.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('shortCode');
      expect(res.body.data.shortUrl).toContain(res.body.data.shortCode);
      expect(res.body.data.originalUrl).toBe('https://www.google.com/');
      expect(res.body.data.clickCount).toBe(0);
    });

    it('returns 400 VALIDATION_ERROR for invalid url', async () => {
      const res = await request(app)
        .post('/api/v1/links')
        .send({ url: 'invalid-url' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns existing short link when duplicate URL is posted', async () => {
      const firstRes = await request(app)
        .post('/api/v1/links')
        .send({ url: 'https://www.google.com' });

      const secondRes = await request(app)
        .post('/api/v1/links')
        .send({ url: 'https://www.google.com' });

      expect(secondRes.status).toBe(200);
      expect(secondRes.body.data.shortCode).toBe(firstRes.body.data.shortCode);
      expect(secondRes.body.data.isExisting).toBe(true);
    });
  });

  describe('GET /api/v1/links', () => {
    it('returns empty list when no links exist', async () => {
      const res = await request(app).get('/api/v1/links');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('returns created links in newest-first order', async () => {
      await request(app).post('/api/v1/links').send({ url: 'https://first.com' });
      await new Promise((r) => setTimeout(r, 10));
      await request(app).post('/api/v1/links').send({ url: 'https://second.com' });

      const res = await request(app).get('/api/v1/links');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].originalUrl).toBe('https://second.com/');
      expect(res.body.data[1].originalUrl).toBe('https://first.com/');
    });
  });

  describe('GET /:shortCode (Redirect)', () => {
    it('redirects with 302 and increments click count', async () => {
      const createRes = await request(app)
        .post('/api/v1/links')
        .send({ url: 'https://example.com/target' });

      const { shortCode } = createRes.body.data;

      const redirectRes = await request(app).get(`/${shortCode}`);
      expect(redirectRes.status).toBe(302);
      expect(redirectRes.headers.location).toBe('https://example.com/target');

      // Verify click count increment in list API
      const listRes = await request(app).get('/api/v1/links');
      const updatedLink = listRes.body.data.find((l) => l.shortCode === shortCode);
      expect(updatedLink.clickCount).toBe(1);
    });

    it('returns 404 NOT_FOUND for unknown short code', async () => {
      const res = await request(app).get('/aB3k9Q');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
