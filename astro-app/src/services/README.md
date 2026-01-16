# Data Service 架構

統一的資料存取層，支援多種資料來源切換。

## 目錄結構

```
services/
├── README.md              # 本文件
├── index.ts               # 匯出入口
├── config.ts              # 環境設定
├── dataService.ts         # 主要服務（單例）
├── types/
│   ├── api.ts             # API 請求/回應類型
│   └── provider.ts        # Provider 介面定義
├── providers/
│   ├── index.ts           # Provider 匯出
│   ├── jsonProvider.ts    # JSON 檔案 Provider
│   ├── apiProvider.ts     # HTTP API Provider
│   └── mockProvider.ts    # Mock 資料 Provider
└── mock/
    ├── events.json        # 活動 Mock 資料
    └── form-fields.json   # 表單欄位配置
```

## 架構設計

### 三層 Provider 模式

```
┌─────────────┐
│ DataService │ ← 單例，統一介面
└──────┬──────┘
       │
  ┌────┴────┬────────────┐
  ▼         ▼            ▼
JsonProvider  ApiProvider  MockProvider
  │           │            │
  ▼           ▼            ▼
JSON 檔案   Vercel API   Mock JSON
```

### Provider 職責

| Provider | 用途 | 頁面內容 | 動態資料 |
|----------|------|----------|----------|
| **JsonProvider** | SSG 建置 | ✅ 支援 | ❌ 不支援 |
| **ApiProvider** | 生產環境 | ✅ 支援 | ✅ 支援 |
| **MockProvider** | 開發測試 | ✅ 委託 JsonProvider | ✅ 支援 |

## 環境變數

```bash
# 資料來源（推薦）
DATA_SOURCE=mock   # 開發/測試：使用 Mock 資料
DATA_SOURCE=json   # SSG 建置：使用 JSON 檔案
DATA_SOURCE=api    # 生產環境：使用資料庫 API

# 向後相容
USE_API=true       # 等同於 DATA_SOURCE=api

# API 設定
API_BASE_URL=/api  # API 基礎路徑
API_TIMEOUT=5000   # 請求超時（毫秒）
```

## 使用方式

### 基本使用

```typescript
import { dataService } from '@/services';

// 取得頁面內容
const page = await dataService.getPageContent('acunetix');

// 取得活動列表
const events = await dataService.getEvents({
  status: 'published',
  page: 1,
  page_size: 10,
});

// 取得活動詳情
const event = await dataService.getEventById('event_20251118');

// 取得表單配置
const formConfig = await dataService.getFormConfig('contact');

// 提交聯絡表單
const result = await dataService.submitContactForm({
  name: '王小明',
  email: 'user@example.com',
  message: '諮詢內容...',
});
```

### DataProvider 介面

所有 Provider 必須實作以下介面：

```typescript
interface DataProvider {
  // 頁面內容
  getPageContent(slug: string): Promise<PageContent | null>;
  getAllPages(): Promise<string[]>;
  getContentManifest(): Promise<ContentManifest | null>;

  // 圖片資源
  getAssetManifest(): Promise<AssetManifest | null>;
  getAssetById(imageId: string): Promise<AssetEntry | null>;

  // 活動（動態資料）
  getEvents(params?: EventQueryParams): Promise<EventListResponse>;
  getEventById(id: string): Promise<EventDetail | null>;

  // 表單配置（動態資料）
  getFormConfig(formId: string): Promise<FormConfigResponse | null>;
}
```

## Mock 資料

### events.json

```json
{
  "events": [
    {
      "id": "event_20251118",
      "title": "智慧製造入門研討會",
      "summary": "...",
      "category": "webinar",
      "status": "published",
      "event_date": "2025-11-18T14:00:00+08:00",
      ...
    }
  ]
}
```

### form-fields.json

```json
{
  "forms": {
    "contact": {
      "form_id": "contact",
      "title": "聯絡我們",
      "fields": [
        { "name": "name", "label": "姓名", "type": "text", "required": true },
        { "name": "email", "label": "電子郵件", "type": "email", "required": true },
        ...
      ],
      "submit_button_text": "送出諮詢",
      "success_message": "感謝您的諮詢！"
    }
  }
}
```

## 新增 Provider

1. 在 `providers/` 建立新檔案（如 `redisProvider.ts`）
2. 實作 `DataProvider` 介面
3. 在 `providers/index.ts` 匯出
4. 在 `config.ts` 新增環境變數支援
5. 在 `dataService.ts` 的 constructor 加入 switch case

## 類型定義

所有共用類型定義在 `@ewill/shared` 套件：

- `EventListItem`, `EventDetail`, `EventListResponse`
- `EventStatus`, `EventCategory`, `EventQueryParams`
- `FormFieldConfig`, `FormConfigResponse`, `FieldValidation`
- `ApiResponse`, `ContactFormSubmission`
