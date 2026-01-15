/**
 * POST /api/contact/submit
 * 聯絡表單提交
 */
import type { APIRoute } from 'astro';
import type {
  ContactSubmitRequest,
  ContactSubmitResponse,
  ApiResponse,
} from '../../../services/types/api';

export const prerender = false;

// Mock storage（實際部署時改用資料庫或外部服務）
const submissions: Map<
  string,
  ContactSubmitRequest & { submittedAt: string }
> = new Map();

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: ContactSubmitRequest = await request.json();

    // 驗證必填欄位
    const requiredFields = ['name', 'email', 'message'] as const;
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof ContactSubmitRequest]
    );

    if (missingFields.length > 0) {
      const response: ApiResponse<ContactSubmitResponse> = {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: '缺少必填欄位',
          details: { missing: missingFields },
        },
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      const response: ApiResponse<ContactSubmitResponse> = {
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: '電子郵件格式不正確',
        },
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 生成提交 ID
    const submissionId = `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Mock: 儲存到記憶體（實際部署時改用外部服務）
    submissions.set(submissionId, {
      ...body,
      submittedAt: new Date().toISOString(),
    });

    // Mock: 模擬寄送通知（實際部署時整合 Email 服務）
    console.log(`[Contact Form] New submission: ${submissionId}`, {
      name: body.name,
      email: body.email,
      company: body.company,
      source_page: body.source_page,
    });

    const response: ApiResponse<ContactSubmitResponse> = {
      success: true,
      data: {
        submission_id: submissionId,
        submitted: true,
        message: '感謝您的來信！我們將於 1-2 個工作天內回覆。',
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Contact Form] Error:', error);
    const response: ApiResponse<ContactSubmitResponse> = {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: '伺服器錯誤，請稍後再試',
      },
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
