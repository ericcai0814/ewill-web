#!/usr/bin/env python3
"""
find_undescribed.py - 找出缺少 .yml 描述檔的圖片

使用方式：
    python scripts/find_undescribed.py              # 掃描整個專案
    python scripts/find_undescribed.py pages/       # 掃描所有頁面
    python scripts/find_undescribed.py pages/logsec # 掃描指定頁面

相關 SOP：
    - .agent/SOP/02b_image_metadata.md
    - .claude/commands/daily_check.md
"""

import os
import sys
from pathlib import Path


def find_undescribed_images(root_dir: Path, skip_dirs: set = None) -> list:
    """
    找出指定目錄下缺少 .yml 描述檔的圖片
    
    Args:
        root_dir: 要掃描的根目錄
        skip_dirs: 要跳過的目錄名稱集合
    
    Returns:
        缺少描述檔的圖片路徑列表
    """
    skip_dirs = skip_dirs or {'.git', '.agent', '.claude', 'scripts', 'design', 'design_reference'}
    undescribed = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # 跳過指定目錄
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        
        # 找出圖片檔案
        images = [f for f in filenames if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
        
        for img in images:
            yml = img + ".yml"
            if yml not in filenames:
                undescribed.append(Path(dirpath) / img)
    
    return sorted(undescribed)


def print_report(undescribed: list, root_dir: Path):
    """輸出檢查報告"""
    print("=" * 60)
    print("圖片描述檔檢查報告")
    print("=" * 60)
    print(f"掃描目錄: {root_dir}")
    print(f"缺少描述檔: {len(undescribed)} 張")
    print("-" * 60)
    
    if undescribed:
        # 按目錄分組
        by_dir = {}
        for path in undescribed:
            dir_name = path.parent.name
            if dir_name not in by_dir:
                by_dir[dir_name] = []
            by_dir[dir_name].append(path.name)
        
        for dir_name, images in sorted(by_dir.items()):
            print(f"\n📁 {dir_name}/ ({len(images)} 張)")
            for img in images:
                print(f"   - {img}")
        
        print("\n" + "-" * 60)
        print("💡 執行 /gen_image_meta 可自動生成描述檔")
    else:
        print("\n✅ 所有圖片都有對應的描述檔！")
    
    print("=" * 60)


def main():
    # 決定掃描目錄
    if len(sys.argv) > 1:
        root_dir = Path(sys.argv[1]).resolve()
    else:
        # 預設為腳本所在目錄的上層（專案根目錄）
        root_dir = Path(__file__).parent.parent.resolve()
    
    if not root_dir.exists():
        print(f"錯誤: 目錄不存在 - {root_dir}")
        sys.exit(1)
    
    undescribed = find_undescribed_images(root_dir)
    print_report(undescribed, root_dir)
    
    # 返回狀態碼（用於 CI/CD）
    sys.exit(0 if not undescribed else 1)


if __name__ == "__main__":
    main()

