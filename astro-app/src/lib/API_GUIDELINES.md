# 前端 API 調用規範

> 版本：1.0.0
> 最後更新：2026-01-16

## 核心原則

1. **統一使用 `apiClient`**：所有 API 調用必須通過 `src/lib/api-client.ts`
2. **使用原生 fetch**：輕量、無額外依賴、瀏覽器原生支援
3. **標準化回應格式**：所有 API 返回 `ApiResponse<T>` 格式
4. **AJAX 優先**：表單提交使用 AJAX，提供更好的用戶體驗

---

## 使用方式

### 基本用法

```typescript
import { apiClient } from '@/lib/api-client';

// GET 請求
const result = await apiClient.get('/api/events', { page: 1, status: 'published' });

// POST 請求
const result = await apiClient.post('/api/contact/submit', {
  name: 'John',
  email: 'john@example.com',
  message: 'Hello',
});

// 處理回應
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error?.message);
}
```

### 在 Astro 組件中使用

```astro
<script>
  import { apiClient } from '@/lib/api-client';

  const form = document.getElementById('my-form') as HTMLFormElement;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const result = await apiClient.post('/api/contact/submit', data);

    if (result.success) {
      // 成功處理
      alert('提交成功！');
      form.reset();
    } else {
      // 錯誤處理
      alert(result.error?.message || '提交失敗');
    }
  });
</script>
```

---

## API 回應格式

所有 API 回應遵循統一格式：

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### 成功回應範例

```json
{
  "success": true,
  "data": {
    "submission_id": "sub_abc123",
    "message": "提交成功"
  }
}
```

### 錯誤回應範例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "電子郵件格式不正確",
    "details": { "field": "email" }
  }
}
```

---

## 錯誤代碼

| 代碼 | 說明 |
|------|------|
| `VALIDATION_ERROR` | 輸入驗證失敗 |
| `NOT_FOUND` | 資源不存在 |
| `METHOD_NOT_ALLOWED` | HTTP 方法不允許 |
| `INTERNAL_ERROR` | 伺服器內部錯誤 |
| `TIMEOUT` | 請求逾時 |
| `NETWORK_ERROR` | 網路錯誤 |

---

## 最佳實踐

### 1. 永遠不要使用傳統表單提交

```html
<!-- ❌ 錯誤：傳統表單提交 -->
<form action="/api/contact" method="POST">
  ...
</form>

<!-- ✅ 正確：使用 AJAX -->
<form id="contact-form">
  ...
</form>
<script>
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await apiClient.post('/api/contact/submit', data);
    // 處理結果
  });
</script>
```

### 2. 顯示載入狀態

```typescript
const submitBtn = document.getElementById('submit-btn');

async function handleSubmit() {
  submitBtn.disabled = true;
  submitBtn.textContent = '處理中...';

  try {
    const result = await apiClient.post('/api/contact/submit', data);
    // 處理結果
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
}
```

### 3. 顯示錯誤訊息

```typescript
if (!result.success) {
  const errorMessage = result.error?.message || '發生未知錯誤';
  showErrorMessage(errorMessage);
}
```

### 4. 設定適當的逾時時間

```typescript
// 預設 10 秒，可自訂
const result = await apiClient.post('/api/heavy-operation', data, {
  timeout: 30000, // 30 秒
});
```

---

## 現有組件範例

參考 `ContactFormSection.astro` 的實作：
- AJAX 表單提交
- 載入狀態處理
- 成功/錯誤訊息顯示
- 表單重置

---

## 為什麼選擇原生 fetch？

| 方案 | Bundle Size | 優點 | 缺點 |
|------|-------------|------|------|
| **原生 fetch** | 0 KB | 無依賴、瀏覽器原生 | 需要自己處理錯誤 |
| axios | ~13 KB | API 友善 | 額外依賴 |
| ky | ~3 KB | 輕量 | 額外依賴 |

對於 Astro SSG 網站，保持輕量是重要原則。原生 fetch 配合 `apiClient` 封裝已足夠使用。
