#!/usr/bin/env python3
"""
audit-image-refs.py - 稽核頁面圖片引用完整性

用途：
- 檢查 md 檔案是否包含正確的圖片引用
- 驗證引用的圖片是否存在於 assets/ 目錄
- 比對 md 與 yml 的圖片數量是否一致

架構說明：
- index.md 是 source of truth（包含圖片引用）
- index.yml 的 layout.sections 由 sync-content.ts 自動生成
- 此腳本僅作稽核用途，不會修改任何檔案

使用方式：
  python3 .agent/scripts/audit-image-refs.py [--page PAGE_NAME] [--verbose]

選項：
  --page      只檢查指定頁面
  --verbose   顯示詳細資訊
"""

import os
import re
import sys
from pathlib import Path

# 嘗試載入 yaml，若無則使用 regex fallback
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


def extract_md_image_refs(md_path: Path) -> list:
    """從 markdown 內容提取圖片引用"""
    if not md_path.exists():
        return []

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r'!\[([^\]]*)\]\(assets/([^)]+)\)'
    matches = re.findall(pattern, content)

    return [{'alt': alt, 'filename': filename} for alt, filename in matches]


def extract_yml_image_count(yml_path: Path) -> int:
    """從 yml 提取 layout.sections 中的圖片數量"""
    if not yml_path.exists():
        return 0

    with open(yml_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if HAS_YAML:
        try:
            data = yaml.safe_load(content)
            if not data or 'layout' not in data:
                return 0

            layout = data['layout']
            count = 0

            # Sections images
            if 'sections' in layout:
                for section in layout['sections']:
                    if isinstance(section, dict) and section.get('type') == 'image':
                        count += 1

            return count
        except Exception:
            pass

    # Fallback: 使用 regex 計算 type: image 數量
    matches = re.findall(r'type:\s*image', content)
    return len(matches)


def get_assets_count(assets_dir: Path) -> int:
    """獲取 assets 目錄中的圖片數量"""
    if not assets_dir.exists():
        return 0

    count = 0
    for f in assets_dir.iterdir():
        if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']:
            count += 1

    return count


def audit_page(page_dir: Path, verbose: bool = False) -> dict:
    """稽核單一頁面的圖片引用"""
    result = {
        'page': page_dir.name,
        'md_refs': 0,
        'yml_refs': 0,
        'assets_count': 0,
        'missing_files': [],
        'status': 'ok',
        'issues': []
    }

    md_path = page_dir / 'index.md'
    yml_path = page_dir / 'index.yml'
    assets_dir = page_dir / 'assets'

    # 提取各來源的圖片資訊
    md_refs = extract_md_image_refs(md_path)
    yml_count = extract_yml_image_count(yml_path)
    assets_count = get_assets_count(assets_dir)

    result['md_refs'] = len(md_refs)
    result['yml_refs'] = yml_count
    result['assets_count'] = assets_count

    # 檢查 md 引用的圖片是否存在
    for ref in md_refs:
        file_path = assets_dir / ref['filename']
        if not file_path.exists():
            result['missing_files'].append(ref['filename'])
            result['issues'].append(f"md 引用的圖片不存在: {ref['filename']}")

    # 檢查 md 是否有圖片引用
    if result['md_refs'] == 0 and result['assets_count'] > 0:
        result['issues'].append(f"md 沒有圖片引用，但 assets/ 有 {result['assets_count']} 張圖片")
        result['status'] = 'warning'

    # 檢查 md 與 yml sections 的圖片數量
    if result['md_refs'] > 0 and result['yml_refs'] > 0:
        if result['md_refs'] != result['yml_refs']:
            result['issues'].append(
                f"md ({result['md_refs']}) 與 yml ({result['yml_refs']}) 圖片數量不一致"
            )
            result['status'] = 'warning'

    # 有缺失檔案則標記為錯誤
    if result['missing_files']:
        result['status'] = 'error'

    return result


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='稽核頁面圖片引用完整性',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
範例：
  python3 audit-image-refs.py              # 稽核所有頁面
  python3 audit-image-refs.py --page wms   # 只稽核 wms 頁面
  python3 audit-image-refs.py --verbose    # 顯示詳細資訊
        """
    )
    parser.add_argument('--page', help='只檢查指定頁面')
    parser.add_argument('--verbose', '-v', action='store_true', help='顯示詳細資訊')

    args = parser.parse_args()

    pages_dir = Path('pages')
    if not pages_dir.exists():
        print("❌ pages/ 目錄不存在")
        sys.exit(1)

    # 收集要檢查的頁面
    if args.page:
        page_dirs = [pages_dir / args.page]
        if not page_dirs[0].exists():
            print(f"❌ 頁面不存在: {args.page}")
            sys.exit(1)
    else:
        page_dirs = sorted([d for d in pages_dir.iterdir() if d.is_dir()])

    print("🔍 圖片引用稽核報告")
    print("=" * 60)
    if not HAS_YAML:
        print("⚠️  PyYAML 未安裝，使用 regex fallback")
    print()

    stats = {'ok': 0, 'warning': 0, 'error': 0}
    all_results = []

    for page_dir in page_dirs:
        result = audit_page(page_dir, verbose=args.verbose)
        all_results.append(result)
        stats[result['status']] += 1

        # 顯示結果
        if result['status'] == 'ok':
            icon = '✅'
        elif result['status'] == 'warning':
            icon = '⚠️ '
        else:
            icon = '❌'

        print(f"{icon} {result['page']}")
        print(f"   md: {result['md_refs']} | assets: {result['assets_count']}")

        if args.verbose or result['status'] != 'ok':
            for issue in result['issues']:
                print(f"   └─ {issue}")

        if result['missing_files']:
            print(f"   └─ 缺失: {', '.join(result['missing_files'])}")

        print()

    # 總結
    print("=" * 60)
    print("📊 稽核結果")
    print(f"   ✅ 正常: {stats['ok']}")
    print(f"   ⚠️  警告: {stats['warning']}")
    print(f"   ❌ 錯誤: {stats['error']}")
    print()

    total_md_refs = sum(r['md_refs'] for r in all_results)
    total_assets = sum(r['assets_count'] for r in all_results)
    print(f"   總圖片引用 (md): {total_md_refs}")
    print(f"   總圖片檔案 (assets): {total_assets}")

    # 如果有錯誤，以非零狀態退出
    if stats['error'] > 0:
        print()
        print("💡 提示：執行 `git checkout <commit> -- pages/<page>/index.md` 可從歷史恢復")
        sys.exit(1)
    elif stats['warning'] > 0:
        print()
        print("💡 提示：建議執行 `npm run sync-content` 同步 md 與 yml")


if __name__ == '__main__':
    main()
