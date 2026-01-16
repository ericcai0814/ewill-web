/**
 * POST /api/contact
 *
 * 處理傳統表單提交（非 AJAX）
 * 接收 form-data 或 JSON，重導向 /api/contact/submit 處理
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from './submit';

export default async function contactHandler(req: VercelRequest, res: VercelResponse) {
  // 只允許 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  // 如果是 form-data，轉換為 JSON body
  if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    // Vercel 會自動解析 form data 到 req.body
  }

  // 呼叫 submit handler
  return handler(req, res);
}
