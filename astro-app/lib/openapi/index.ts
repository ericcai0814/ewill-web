/**
 * OpenAPI 規格生成
 *
 * 使用 @asteasolutions/zod-to-openapi 從 Zod schemas 生成 OpenAPI 3.0 規格
 */
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  MetaSchema,
  ErrorSchema,
  ApiResponseSchema,
  PageContentSchema,
  PageSlugSchema,
  PageTypeSchema,
  ContactFormInputSchema,
  ContactSubmissionResponseSchema,
  EventListItemSchema,
  EventListResponseSchema,
  EventCategorySchema,
  EventStatusSchema,
  AssetEntrySchema,
  AssetManifestSchema,
  ContentManifestSchema,
} from './schemas';

// 建立 Registry
export const registry = new OpenAPIRegistry();

// 註冊共用 schemas
registry.register('Meta', MetaSchema);
registry.register('Error', ErrorSchema);
registry.register('PageContent', PageContentSchema);
registry.register('PageType', PageTypeSchema);
registry.register('ContactFormInput', ContactFormInputSchema);
registry.register('ContactSubmissionResponse', ContactSubmissionResponseSchema);
registry.register('EventListItem', EventListItemSchema);
registry.register('EventListResponse', EventListResponseSchema);
registry.register('EventCategory', EventCategorySchema);
registry.register('EventStatus', EventStatusSchema);
registry.register('AssetEntry', AssetEntrySchema);
registry.register('AssetManifest', AssetManifestSchema);
registry.register('ContentManifest', ContentManifestSchema);

// ============================================================
// API 路由註冊
// ============================================================

// GET /api/pages - 取得所有頁面 slug 清單
registry.registerPath({
  method: 'get',
  path: '/api/pages',
  tags: ['Pages'],
  summary: '取得所有頁面 slug 清單',
  description: '回傳所有可用頁面的 slug 清單（不含 header/footer）',
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.array(z.string())),
        },
      },
    },
    500: {
      description: '伺服器錯誤',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// GET /api/pages/:slug - 取得單一頁面內容
registry.registerPath({
  method: 'get',
  path: '/api/pages/{slug}',
  tags: ['Pages'],
  summary: '取得單一頁面內容',
  description: '依據 slug 取得頁面的完整內容',
  request: {
    params: z.object({
      slug: PageSlugSchema,
    }),
  },
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(PageContentSchema),
        },
      },
    },
    400: {
      description: '無效的 slug 格式',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
    404: {
      description: '頁面不存在',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// GET /api/pages/type/:type - 取得特定類型的頁面清單
registry.registerPath({
  method: 'get',
  path: '/api/pages/type/{type}',
  tags: ['Pages'],
  summary: '取得特定類型的頁面清單',
  description: '依據頁面類型（security, infrastructure, manufacturing, event, general）取得頁面清單',
  request: {
    params: z.object({
      type: PageTypeSchema,
    }),
  },
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.array(PageContentSchema)),
        },
      },
    },
    400: {
      description: '無效的頁面類型',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// POST /api/contact/submit - 提交聯絡表單
registry.registerPath({
  method: 'post',
  path: '/api/contact/submit',
  tags: ['Contact'],
  summary: '提交聯絡表單',
  description: '提交網站聯絡表單，資料將儲存至資料庫並發送 Email 通知',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ContactFormInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '提交成功',
      content: {
        'application/json': {
          schema: ApiResponseSchema(ContactSubmissionResponseSchema),
        },
      },
    },
    400: {
      description: '驗證失敗',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: '伺服器錯誤',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// GET /api/events - 取得活動列表
registry.registerPath({
  method: 'get',
  path: '/api/events',
  tags: ['Events'],
  summary: '取得活動列表',
  description: '取得活動列表，支援分頁和篩選',
  request: {
    query: z.object({
      page: z.string().optional().openapi({ description: '頁碼（從 1 開始）' }),
      page_size: z.string().optional().openapi({ description: '每頁數量（預設 10，最大 50）' }),
      status: EventStatusSchema.optional(),
      category: EventCategorySchema.optional(),
      sort_by: z.enum(['event_date', 'created_at']).optional(),
      sort_order: z.enum(['asc', 'desc']).optional(),
    }),
  },
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(EventListResponseSchema),
        },
      },
    },
  },
});

// GET /api/events/:id - 取得單一活動詳情
registry.registerPath({
  method: 'get',
  path: '/api/events/{id}',
  tags: ['Events'],
  summary: '取得單一活動詳情',
  description: '依據活動 ID 取得活動的完整資訊',
  request: {
    params: z.object({
      id: z.string().openapi({ description: '活動 ID' }),
    }),
  },
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(EventListItemSchema),
        },
      },
    },
    404: {
      description: '活動不存在',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// GET /api/assets/:imageId - 取得圖片資源
registry.registerPath({
  method: 'get',
  path: '/api/assets/{imageId}',
  tags: ['Assets'],
  summary: '取得圖片資源資訊',
  description: '依據圖片 ID 取得圖片資源的詳細資訊',
  request: {
    params: z.object({
      imageId: z.string().openapi({ description: '圖片 ID（格式：images_*）' }),
    }),
  },
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(AssetEntrySchema),
        },
      },
    },
    404: {
      description: '資源不存在',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.null()),
        },
      },
    },
  },
});

// GET /api/manifests/assets - 取得資源清單
registry.registerPath({
  method: 'get',
  path: '/api/manifests/assets',
  tags: ['Manifests'],
  summary: '取得資源清單',
  description: '取得所有圖片資源的清單',
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(AssetManifestSchema),
        },
      },
    },
  },
});

// GET /api/manifests/content - 取得內容清單
registry.registerPath({
  method: 'get',
  path: '/api/manifests/content',
  tags: ['Manifests'],
  summary: '取得內容清單',
  description: '取得所有頁面內容的清單',
  responses: {
    200: {
      description: '成功回應',
      content: {
        'application/json': {
          schema: ApiResponseSchema(ContentManifestSchema),
        },
      },
    },
  },
});

// ============================================================
// 生成 OpenAPI 文件
// ============================================================

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'ewill-web API',
      version: '1.0.0',
      description: `
鎰威科技網站 API 文件

## 概述

此 API 提供以下功能：
- **Pages**: 頁面內容管理
- **Contact**: 聯絡表單提交
- **Events**: 活動資訊查詢
- **Assets**: 圖片資源管理
- **Manifests**: 內容與資源清單

## 回應格式

所有 API 回應遵循統一格式：

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-16T12:00:00.000Z",
    "version": "1.0.0",
    "cached": false
  }
}
\`\`\`

## 錯誤處理

錯誤回應包含錯誤碼和訊息：

\`\`\`json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "找不到指定的資源"
  }
}
\`\`\`

## 常見錯誤碼

| 錯誤碼 | 說明 |
|--------|------|
| NOT_FOUND | 找不到資源 |
| VALIDATION_ERROR | 輸入驗證失敗 |
| INTERNAL_ERROR | 伺服器內部錯誤 |
| METHOD_NOT_ALLOWED | HTTP 方法不被允許 |
| RATE_LIMITED | 請求頻率過高 |
      `,
      contact: {
        name: '鎰威科技',
        url: 'https://www.ewill.com.tw',
        email: 'info@ewill.com.tw',
      },
    },
    servers: [
      {
        url: 'https://www.ewill.com.tw',
        description: 'Production',
      },
      {
        url: 'http://localhost:4321',
        description: 'Development',
      },
    ],
    tags: [
      { name: 'Pages', description: '頁面內容管理' },
      { name: 'Contact', description: '聯絡表單' },
      { name: 'Events', description: '活動資訊' },
      { name: 'Assets', description: '圖片資源' },
      { name: 'Manifests', description: '內容與資源清單' },
    ],
  });
}
