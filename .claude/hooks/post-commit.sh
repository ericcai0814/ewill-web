#!/bin/bash
# Claude Code Post-Commit Hook
# 只在最近有新 commit 時輸出提示

# 檢查是否在 git repo 內
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    exit 0
fi

# 取得最新 commit 的時間戳（Unix epoch）
COMMIT_TIMESTAMP=$(git log -1 --format="%ct" 2>/dev/null)
CURRENT_TIMESTAMP=$(date +%s)

# 如果最新 commit 是在 5 秒內，才輸出提示
if [ -n "$COMMIT_TIMESTAMP" ]; then
    TIME_DIFF=$((CURRENT_TIMESTAMP - COMMIT_TIMESTAMP))

    if [ "$TIME_DIFF" -le 5 ]; then
        COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null)
        COMMIT_MSG=$(git log -1 --pretty=format:"%s" 2>/dev/null)
        COMMIT_TIME=$(date +"%H:%M")

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📝 Commit 完成！請更新 run-log"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "  時間: $COMMIT_TIME"
        echo "  Hash: $COMMIT_HASH"
        echo "  訊息: $COMMIT_MSG"
        echo ""
        echo "  執行: /run-log"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
fi
