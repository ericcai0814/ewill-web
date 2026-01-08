# Testing Plan 測試計畫

## 測試類型

### 1. 單元測試

使用 Jest + React Testing Library

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

#### 測試範圍

| 元件 | 測試項目 |
|------|----------|
| `Button` | 渲染、點擊事件、disabled 狀態 |
| `Card` | 渲染、圖片載入、連結 |
| `ResponsiveImage` | desktop/mobile 切換 |
| `PopupBanner` | 顯示/隱藏、localStorage |

### 2. 視覺回歸測試

使用 Playwright

```bash
npm install -D @playwright/test
```

#### 測試頁面

- 首頁 (desktop)
- 首頁 (mobile)
- 產品頁範例

### 3. E2E 測試

#### 測試情境

| 情境 | 步驟 |
|------|------|
| 首頁載入 | 訪問首頁 → 確認 Hero 顯示 |
| 導覽 | 點擊選單 → 確認跳轉 |
| 彈窗 | 首訪 → 彈窗顯示 → 關閉 → 重載不顯示 |
| RWD | 縮放視窗 → 確認版面正確 |

### 4. 效能測試

#### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://www.ewill.com.tw/
      https://www.ewill.com.tw/about
```

#### 效能指標

| 指標 | 目標 | 最低 |
|------|------|------|
| Performance | > 90 | 80 |
| Accessibility | > 90 | 85 |
| Best Practices | > 90 | 85 |
| SEO | 100 | 95 |

### 5. 無障礙測試

使用 axe-core

```bash
npm install -D @axe-core/react
```

#### 檢查項目

- [ ] 圖片有 alt 文字
- [ ] 表單有 label
- [ ] 色彩對比度 > 4.5:1
- [ ] 鍵盤可操作
- [ ] ARIA 標籤正確

## 測試指令

```bash
# 單元測試
npm run test

# 單元測試 (watch)
npm run test:watch

# E2E 測試
npm run test:e2e

# 視覺測試
npm run test:visual

# 所有測試
npm run test:all
```

## CI/CD 整合

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

