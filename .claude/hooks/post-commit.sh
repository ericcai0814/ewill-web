#!/bin/bash
# Claude Code Post-Commit Hook
# 在 git commit 成功後提取 commit 資訊供 run-log 使用

# 取得最新 commit 資訊
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null)
COMMIT_MSG=$(git log -1 --pretty=format:"%s" 2>/dev/null)
COMMIT_TIME=$(date +"%H:%M")
COMMIT_DATE=$(date +"%Y-%m-%d")

# 如果成功取得 commit 資訊
if [ -n "$COMMIT_HASH" ] && [ -n "$COMMIT_MSG" ]; then
    # 輸出結構化資訊供 Claude 使用
    echo "---"
    echo "POST_COMMIT_INFO:"
    echo "  date: $COMMIT_DATE"
    echo "  time: $COMMIT_TIME"
    echo "  hash: $COMMIT_HASH"
    echo "  message: $COMMIT_MSG"
    echo "---"
    echo ""
    echo "請執行 /run-log 更新今日記錄"
fi
