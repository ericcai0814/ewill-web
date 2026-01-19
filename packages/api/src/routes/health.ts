/**
 * Health Check Route
 *
 * GET /api/health - Check API status
 */
import { Hono } from 'hono';
import { isMockMode } from '../db';

const health = new Hono();

health.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: isMockMode() ? 'mock' : 'connected',
    },
  });
});

export default health;
