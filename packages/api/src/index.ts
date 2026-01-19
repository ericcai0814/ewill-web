/**
 * @ewill/api - Core Backend API
 *
 * Hono-based REST API for ewill-web
 * - Events management
 * - Contact form submissions
 * - Email notifications
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';

// Load environment variables
config();

// Import routes
import health from './routes/health';
import events from './routes/events';
import contact from './routes/contact';

// Create Hono app
const app = new Hono().basePath('/api');

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => {
      // 允許的固定 origin
      const allowedOrigins = [
        'http://localhost:4321',
        'http://localhost:3000',
        'https://ewill-web.vercel.app',
      ];
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      // 允許所有 Vercel preview URLs
      if (origin && origin.endsWith('.vercel.app')) {
        return origin;
      }
      // 不允許的 origin 回傳空字串
      return '';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
    credentials: true,
  })
);

// Mount routes
app.route('/health', health);
app.route('/events', events);
app.route('/contact', contact);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${c.req.path}`,
      },
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    },
    500
  );
});

// Start server (for local development)
const port = parseInt(process.env.PORT || '3001', 10);

if (process.env.NODE_ENV !== 'test') {
  console.log(`Starting Core Backend API on port ${port}...`);
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`API server running at http://localhost:${port}/api`);
}

// Export for Vercel adapter
export default app;
export { app };
