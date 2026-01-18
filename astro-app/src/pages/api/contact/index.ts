/**
 * POST /api/contact
 *
 * 轉發到 /api/contact/submit
 */
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;
import { POST as submitHandler, ALL as allHandler } from './submit';

// 轉發 POST 請求到 submit handler
export const POST: APIRoute = submitHandler;

// 其他方法返回 405
export const ALL: APIRoute = allHandler;
