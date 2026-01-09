#!/bin/bash
# ============================================================
# Header 圖片下載腳本
# 目標頁面: https://www.ewill.com.tw/
# 生成時間: 2026-01-09
# ============================================================

TARGET_DIR="$(dirname "$0")"
cd "$TARGET_DIR" || exit 1

echo "開始下載圖片..."
echo "目標目錄: $TARGET_DIR"
echo ""

download_image() {
    local url="$1"
    local filename="$2"

    if [ -f "$filename" ]; then
        echo "⏭️  $filename 已存在，跳過"
        return
    fi

    curl -L -C - -o "$filename" "$url" && \
        echo "✓ $filename" || \
        echo "✗ $filename 下載失敗"
}

# Logo 圖片
download_image "https://www.ewill.com.tw/storage/twjohnson309/2024/10/Logo.png" "logo.png"

echo ""
echo "下載完成！"
echo "請檢查 $TARGET_DIR 目錄"
echo ""
echo "下一步：為圖片建立 .yml 描述檔"
