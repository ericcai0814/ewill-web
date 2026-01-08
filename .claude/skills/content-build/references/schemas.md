# Schemas Reference

本文件定義 asset-normalize-rwd 流程的資料結構。

## 目錄

- [asset-manifest.schema.json](#asset-manifestschemajson)
- [image.schema.json](#imageschemajson)
- [page.schema.json](#pageschemajson)

---

## asset-manifest.schema.json

資源清單結構，由 `normalize-assets.ts` 產出。

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "asset-manifest.schema.json",
  "title": "Asset Manifest",
  "type": "object",
  "required": ["generated_at", "assets"],
  "properties": {
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "產出時間 (ISO 8601)"
    },
    "assets": {
      "type": "array",
      "items": { "$ref": "#/$defs/AssetEntry" }
    }
  },
  "$defs": {
    "AssetEntry": {
      "type": "object",
      "required": ["id", "original_path", "normalized_path", "variants"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z0-9_-]+$",
          "description": "資源唯一識別碼 (ASCII 小寫)"
        },
        "original_path": {
          "type": "string",
          "description": "原始檔案路徑"
        },
        "normalized_path": {
          "type": "string",
          "pattern": "^dist/assets/[a-z0-9_.-]+$",
          "description": "正規化後路徑 (ASCII 全小寫)"
        },
        "variants": {
          "type": "object",
          "required": ["desktop", "mobile"],
          "properties": {
            "desktop": { "type": "string" },
            "mobile": { "type": "string" }
          }
        },
        "alt": {
          "type": "string",
          "description": "圖片替代文字"
        }
      }
    }
  }
}
```

---

## image.schema.json

圖片資源結構，用於 index.yml 中的 layout 配置。

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "image.schema.json",
  "title": "Image Reference",
  "type": "object",
  "required": ["id"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9_-]+$",
      "description": "對應 asset-manifest 中的資源 ID"
    },
    "desktop": {
      "type": "string",
      "description": "桌面版變體 ID (可選，預設 {id}_desktop)"
    },
    "mobile": {
      "type": "string",
      "description": "行動版變體 ID (可選，預設 {id}_mobile)"
    }
  }
}
```

### 使用範例

```yaml
# index.yml
layout:
  hero:
    image:
      id: hero_banner
      desktop: hero_banner_desktop  # 可省略
      mobile: hero_banner_mobile    # 可省略
```

---

## page.schema.json

頁面 JSON 結構，由 `build-content.ts` 產出至 `dist/content/pages/*.json`。

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "page.schema.json",
  "title": "Page Content",
  "type": "object",
  "required": ["slug", "module", "seo", "layout", "content", "generated_at"],
  "properties": {
    "slug": {
      "type": "string",
      "description": "頁面 slug (模組名稱)"
    },
    "module": {
      "type": "string",
      "description": "來源模組名稱"
    },
    "seo": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "description": { "type": "string" },
        "keywords": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "url_mapping": {
      "type": "object",
      "properties": {
        "current_url": { "type": "string" },
        "new_url": { "type": "string" }
      }
    },
    "layout": {
      "$ref": "#/$defs/Layout"
    },
    "content": {
      "type": "string",
      "description": "Markdown 內容"
    },
    "generated_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "$defs": {
    "Layout": {
      "type": "object",
      "properties": {
        "hero": {
          "type": "object",
          "properties": {
            "image": { "$ref": "#/$defs/ResolvedImage" }
          }
        },
        "sections": {
          "type": "array",
          "items": { "$ref": "#/$defs/Section" }
        }
      }
    },
    "ResolvedImage": {
      "type": "object",
      "required": ["id", "desktop", "mobile"],
      "properties": {
        "id": { "type": "string" },
        "desktop": {
          "type": "string",
          "pattern": "^/assets/[a-z0-9_.-]+$",
          "description": "已解析的桌面版圖片公開路徑"
        },
        "mobile": {
          "type": "string",
          "pattern": "^/assets/[a-z0-9_.-]+$",
          "description": "已解析的行動版圖片公開路徑"
        },
        "alt": { "type": "string" }
      }
    },
    "Section": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": { "type": "string" },
        "images": {
          "type": "array",
          "items": { "$ref": "#/$defs/ResolvedImage" }
        }
      },
      "additionalProperties": true
    }
  }
}
```

---

## 驗證範例

使用 ajv-cli 驗證：

```bash
# 安裝 ajv-cli
npm install -g ajv-cli

# 驗證 asset-manifest.json
ajv validate -s schemas/asset-manifest.schema.json -d dist/asset-manifest.json

# 驗證頁面 JSON
ajv validate -s schemas/page.schema.json -d dist/content/pages/home.json
```

或在 TypeScript 中使用 ajv：

```typescript
import Ajv from 'ajv'
import pageSchema from './schemas/page.schema.json'

const ajv = new Ajv()
const validate = ajv.compile(pageSchema)

const page = JSON.parse(fs.readFileSync('dist/content/pages/home.json', 'utf-8'))
if (!validate(page)) {
  console.error(validate.errors)
}
```
