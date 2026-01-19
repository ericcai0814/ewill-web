/**
 * Vercel Serverless Function 入口點
 *
 * 用於將 Hono app 部署到 Vercel
 */
import { handle } from 'hono/vercel';
import app from './index';

// 匯出 Vercel handler
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);

// 預設匯出
export default handle(app);
