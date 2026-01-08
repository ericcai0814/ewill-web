# 鎰威科技官網重構規格文件

本目錄包含 Next.js 重構專案的完整規格文件。

## 文件清單

| 文件 | 說明 | 狀態 |
|------|------|:----:|
| `phase-1-project-setup.md` | 專案初始化 | ✅ |
| `phase-2-shared-components.md` | 共用元件 | ✅ |
| `phase-3-homepage.md` | 首頁開發 | ✅ |
| `phase-4-inner-pages.md` | 內頁開發 | 📋 |
| `phase-5-optimization-deployment.md` | 優化與部署 | 📋 |
| `design-system.md` | 設計系統規範 | ✅ |
| `testing-plan.md` | 測試計畫 | 📋 |
| `content-guide.md` | 內容填充指南 | ✅ |

## 已完成項目

### Phase 1: 專案初始化 ✅

- Next.js 16+ (App Router) + TypeScript
- Tailwind CSS 配置
- 專案結構建立

### Phase 2: 共用元件 ✅

已實作元件：
- `Button` - 按鈕元件
- `Card` - 卡片元件
- `ResponsiveImage` - RWD 圖片
- `PopupBanner` - 首訪彈窗
- `Header` - 導覽列
- `Footer` - 頁尾

### Phase 3: 首頁開發 ✅

已實作區塊：
- `HeroSection` - 主視覺（desktop/mobile）
- `AboutSection` - 關於我們
- `ServicesSection` - 服務項目
- `SolutionsSection` - 產品解決方案
- 首訪彈窗（LOGSEC 廣告）

## 執行專案

```bash
cd ewill-next
npm run dev
```

開啟 http://localhost:3000 查看首頁。

## 待完成項目

1. **Phase 4**: 內頁開發（17 個內頁）
2. **Phase 5**: 效能優化與部署
3. **Testing**: 單元測試 + E2E 測試

