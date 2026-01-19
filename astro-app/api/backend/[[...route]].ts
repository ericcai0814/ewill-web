/**
 * Vercel Function 入口點
 *
 * 將 /backend/* 路由到 Core Backend (Hono)
 *
 * 路由對應：
 * - /backend/api/health → Core Backend /api/health
 * - /backend/api/events → Core Backend /api/events
 * - /backend/api/contact → Core Backend /api/contact
 */
import { handle } from 'hono/vercel';
import app from '@ewill/api';

// Export Vercel handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
