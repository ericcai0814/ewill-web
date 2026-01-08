# Fixtures

最小回歸測試資料集。

## 使用方式

```bash
# 複製 fixtures 到專案根目錄
cp -r assets/fixtures/modules ./modules

# 執行測試
npx tsx scripts/normalize-assets.ts
npx tsx scripts/audit-content.ts
npx tsx scripts/build-content.ts

# 驗證輸出
ls dist/assets/
cat dist/asset-manifest.json
cat dist/content/pages/home.json
```

## 結構

```
fixtures/
└── modules/
    └── home/
        ├── index.md              # 內容 markdown
        ├── index.yml             # 頁面配置 (含 layout)
        └── assets/
            ├── 首頁橫幅.jpg           # 主圖 (非 ASCII 檔名)
            ├── 首頁橫幅.jpg.meta.yml  # 資源中繼資料
            ├── 首頁橫幅_1920x600.jpg  # 桌面版變體
            └── 首頁橫幅_750x400.jpg   # 行動版變體
```

## 預期輸出

### dist/asset-manifest.json

```json
{
  "assets": [
    {
      "id": "hero_banner",
      "original_path": "modules/home/assets/首頁橫幅.jpg",
      "normalized_path": "dist/assets/hero_banner_xxxxxxxx.jpg",
      "variants": {
        "desktop": "dist/assets/hero_banner_xxxxxxxx_desktop.jpg",
        "mobile": "dist/assets/hero_banner_xxxxxxxx_mobile.jpg"
      },
      "alt": "首頁主視覺橫幅"
    }
  ]
}
```

### dist/content/pages/home.json

```json
{
  "slug": "home",
  "layout": {
    "hero": {
      "image": {
        "id": "hero_banner",
        "desktop": "/assets/hero_banner_xxxxxxxx_desktop.jpg",
        "mobile": "/assets/hero_banner_xxxxxxxx_mobile.jpg",
        "alt": "首頁主視覺橫幅"
      }
    }
  }
}
```
