# Web Crawler 設定調整

## 參數說明

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `--preview` | ✅ 預設 | 預覽模式：只爬首頁 |
| `--continue` | - | 繼續模式：爬取剩餘頁面 |
| `--full` | - | 完整模式：跳過確認，一次爬完 |
| `-o, --output` | `./` | 輸出目錄 |
| `-d, --delay` | `2.0` | 請求間隔秒數 |
| `--min-image-size` | `100` | 最小圖片尺寸 px |

---

## 調整圖片過濾

```python
# 新增排除關鍵字
config.excluded_image_patterns.append(r'banner')
config.excluded_image_patterns.append(r'promo')

# 調整最小尺寸
config.min_image_size = 150  # 排除小於 150px 的圖片
```

---

## 調整內容過濾

```python
# 新增排除的 HTML 元素
config.excluded_elements.append('section.promo')

# 新增排除的 class 關鍵字
config.excluded_classes.append('newsletter')
config.excluded_classes.append('subscribe')
```
