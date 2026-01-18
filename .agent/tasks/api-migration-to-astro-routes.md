# 遷移 API 到 Astro API Routes

> **建立日期**: 2026-01-16
> **完成日期**: 2026-01-16
> **狀態**: 已完成
> **優先級**: 高

---

## 問題描述

### 錯誤訊息

Vercel Preview 部署後，呼叫 `/api/contact/submit` 回傳：

```
FUNCTION_INVOCATION_FAILED
```

### 根本原因

現有 `api/` 目錄使用 **Vercel Functions 格式**（`VercelRequest`/`VercelResponse`），但 Astro + Vercel adapter 編譯時會轉換處理方式，導致 runtime 格式衝突。

**舊格式（Vercel Functions）：**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ success: true });  // ❌ 編譯後 res.status() 不存在
}
```

Astro 編譯後，handler 收到的不再是原生 Vercel request/response 物件，導致 `res.status()` 等方法失效。

---

## 解決方案

將 API 遷移到 **Astro 原生 API Routes**（`src/pages/api/`），使用 Astro 的 `APIRoute` 格式。

**新格式（Astro API Routes）：**
```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## 受影響檔案

### 需遷移

| 舊路徑 | 新路徑 | HTTP Method |
|--------|--------|-------------|
| `api/contact/submit.ts` | `src/pages/api/contact/submit.ts` | POST |
| `api/contact/index.ts` | `src/pages/api/contact/index.ts` | POST |
| `api/events/index.ts` | `src/pages/api/events/index.ts` | GET |
| `api/events/[id].ts` | `src/pages/api/events/[id].ts` | GET |

### 保留不變

| 檔案 | 說明 |
|------|------|
| `lib/db/client.ts` | 資料庫連線 |
| `lib/db/schema.ts` | Drizzle schema |
| `lib/email/resend.ts` | Email 發送 |
| `lib/utils/response.ts` | API 回應工具 |
| `lib/utils/validate.ts` | 驗證工具 |

### 需清理

| 檔案 | 動作 |
|------|------|
| `api/` 目錄 | 刪除整個目錄 |
| `vercel.json` | 移除 rewrites 規則 |

---

## 實作步驟

### Phase 1：建立 Astro API Routes 結構

```
src/pages/api/
├── contact/
│   ├── index.ts       # POST /api/contact（轉發到 submit）
│   └── submit.ts      # POST /api/contact/submit
└── events/
    ├── index.ts       # GET /api/events
    └── [id].ts        # GET /api/events/:id
```

### Phase 2：遷移聯絡表單 API

**檔案**：`src/pages/api/contact/submit.ts`

主要變更：
- 使用 `APIRoute` 類型
- 使用 `request.json()` 取得 body
- 使用 `request.headers.get()` 取得 headers
- 返回 `Response` 物件
- 保留現有的資料庫和 email 邏輯

### Phase 3：遷移活動 API

**檔案**：
- `src/pages/api/events/index.ts`
- `src/pages/api/events/[id].ts`

主要變更：
- 使用 `new URL(request.url)` 取得 query parameters
- 使用 `params.id` 取得動態路由參數

### Phase 4：清理舊檔案

1. 刪除 `api/` 目錄
2. 移除 `vercel.json` 中的 rewrites

---

## 驗證清單

- [x] 本地 `pnpm run build` 成功
- [ ] POST `/api/contact/submit` 回傳 201（待 Vercel 部署後驗證）
- [ ] GET `/api/events` 回傳活動列表（待 Vercel 部署後驗證）
- [ ] GET `/api/events/:id` 回傳活動詳情（待 Vercel 部署後驗證）
- [ ] Vercel Preview 部署成功
- [ ] 聯絡表單提交成功

---

## 注意事項

### Astro 5 重要變更

Astro 5 已移除 `hybrid` 輸出模式。現在使用 `static` 模式搭配 `export const prerender = false` 來標記 server-side routes：

```typescript
// src/pages/api/contact/submit.ts
import type { APIRoute } from 'astro';

// 標記為 server-side route（不預先渲染）
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // ...
};
```

### 環境變數

以下環境變數需在 Vercel 設定：
- `DATABASE_URL` - Neon PostgreSQL 連線字串
- `RESEND_API_KEY` - Resend Email API 金鑰
- `CONTACT_EMAIL` - 接收通知的 Email
- `FROM_EMAIL` - 寄件者 Email

### request.json() 錯誤處理

Astro API Routes 中 `request.json()` 可能拋出例外，需要 try-catch：

```typescript
let body;
try {
  body = await request.json();
} catch {
  return new Response(JSON.stringify(errorResponse(...)), { status: 400 });
}
```

---

## 相關文件

- [Astro API Routes 文件](https://docs.astro.build/en/guides/endpoints/)
- [Vercel Adapter 文件](https://docs.astro.build/en/guides/deploy/vercel/)
- [API_GUIDELINES.md](../../astro-app/src/lib/API_GUIDELINES.md) - 前端 API 呼叫規範
