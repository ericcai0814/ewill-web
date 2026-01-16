# API 端點文檔

Vercel Functions API 端點，提供動態資料存取。

## 目錄結構

```
api/
├── README.md           # 本文件
├── assets/
│   └── [id].ts         # GET /api/assets/:id
├── contact/
│   └── submit.ts       # POST /api/contact/submit
├── events/
│   ├── index.ts        # GET /api/events
│   └── [id].ts         # GET /api/events/:id
├── manifests/
│   ├── assets.ts       # GET /api/manifests/assets
│   └── content.ts      # GET /api/manifests/content
└── pages/
    ├── index.ts        # GET /api/pages
    └── [slug].ts       # GET /api/pages/:slug
```

---

## 活動 API

### GET /api/events

取得活動列表（支援分頁、篩選、排序）。

**Query Parameters:**

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `page` | number | 1 | 頁碼（從 1 開始） |
| `page_size` | number | 10 | 每頁數量（最大 50） |
| `status` | string | - | 狀態篩選：`draft` \| `published` \| `archived` |
| `category` | string | - | 分類篩選：`seminar` \| `webinar` \| `press_release` \| `exhibition` \| `other` |
| `sort_by` | string | `event_date` | 排序欄位：`event_date` \| `created_at` |
| `sort_order` | string | `desc` | 排序方向：`asc` \| `desc` |

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "event_20251118",
        "title": "智慧製造入門研討會",
        "summary": "...",
        "category": "webinar",
        "event_date": "2025-11-18T14:00:00+08:00",
        "cover_image_id": "images_event_20251118_cover",
        "page_slug": "event_20251118"
      }
    ],
    "total": 4,
    "page": 1,
    "page_size": 10,
    "has_more": false
  },
  "meta": {
    "timestamp": "2026-01-16T12:00:00.000Z",
    "version": "1.0.0",
    "cached": false
  }
}
```

**快取:** `s-maxage=300`（5 分鐘）

---

### GET /api/events/:id

根據 ID 取得活動詳情。

**Path Parameters:**

| 參數 | 類型 | 說明 |
|------|------|------|
| `id` | string | 活動 ID（如 `event_20251118`） |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "event_20251118",
    "title": "智慧製造入門研討會",
    "summary": "...",
    "category": "webinar",
    "status": "published",
    "event_date": "2025-11-18T14:00:00+08:00",
    "end_date": "2025-11-18T16:00:00+08:00",
    "cover_image_id": "images_event_20251118_cover",
    "hero_image_id": "images_event_20251118_hero",
    "page_slug": "event_20251118",
    "content": "活動內容...",
    "seo": {
      "title": "智慧製造入門研討會 | MES、WMS、AI 應用全解析",
      "description": "...",
      "keywords": ["智慧製造", "MES", "WMS"]
    },
    "created_at": "2025-10-01T10:00:00+08:00",
    "updated_at": "2025-11-01T10:00:00+08:00"
  }
}
```

**快取:** `s-maxage=600`（10 分鐘）

---

## 聯絡表單 API

### POST /api/contact/submit

提交聯絡表單。

**Request Body:**

```json
{
  "name": "王小明",
  "email": "user@example.com",
  "phone": "0912-345-678",
  "company": "範例公司",
  "message": "我想了解更多產品資訊...",
  "source_page": "/contact/"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "submission_id": "sub_abc123xyz",
    "submitted": true,
    "message": "感謝您的來信，我們將盡快與您聯繫。"
  }
}
```

---

## 頁面 API

### GET /api/pages

取得所有頁面 slug 清單（排除 header/footer）。

**Response:**

```json
{
  "success": true,
  "data": ["index", "about_us", "solutions", "acunetix", "..."]
}
```

### GET /api/pages/:slug

取得單一頁面完整內容。

---

## 資源 API

### GET /api/assets/:id

根據 image_id 取得圖片資源資訊。

### GET /api/manifests/assets

取得圖片資源清單 manifest。

### GET /api/manifests/content

取得內容清單 manifest。

---

## 錯誤回應格式

所有 API 錯誤回應遵循統一格式：

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "找不到活動: event_xxx"
  },
  "meta": {
    "timestamp": "2026-01-16T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

**常用錯誤碼:**

| Code | HTTP Status | 說明 |
|------|-------------|------|
| `NOT_FOUND` | 404 | 資源不存在 |
| `VALIDATION_ERROR` | 400 | 輸入驗證失敗 |
| `METHOD_NOT_ALLOWED` | 405 | HTTP 方法不允許 |
| `INTERNAL_ERROR` | 500 | 伺服器內部錯誤 |

---

## 資料來源切換

透過環境變數 `DATA_SOURCE` 控制資料來源：

```bash
# 開發環境（使用 Mock 資料）
DATA_SOURCE=mock

# SSG 建置（使用 JSON 檔案）
DATA_SOURCE=json

# 生產環境（使用資料庫）
DATA_SOURCE=api
```

向後相容：`USE_API=true` 等同於 `DATA_SOURCE=api`。
