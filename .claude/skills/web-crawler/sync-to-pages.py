#!/usr/bin/env python3
"""
爬蟲結果同步工具 (Crawl Result Sync Tool)

用途：
    將爬蟲輸出 (crawl-temp/) 智慧合併到 pages/ 目錄。

功能：
    1. 識別 placeholder 頁面 vs 已優化頁面
    2. 智慧合併策略：
       - placeholder 頁面：複製 index.md 和圖片
       - 已優化頁面：可選擇只更新 index.md
    3. 轉換圖片 URL（絕對路徑 → 相對路徑）
    4. 重命名 images/ → assets/
    5. 產生圖片 ID 映射建議

使用方式：
    # 預覽模式（預設）：顯示將執行的操作
    python sync-to-pages.py

    # 執行同步
    python sync-to-pages.py --execute

    # 只處理特定頁面
    python sync-to-pages.py --pages services,contact --execute

    # 強制覆蓋已優化頁面
    python sync-to-pages.py --force --execute

Author: ewill-web Agent
Version: 1.0.0
"""

import os
import re
import sys
import shutil
import argparse
from pathlib import Path
from typing import List, Dict, Set, Tuple
from urllib.parse import urlparse, unquote

import yaml


# ============================================
# 設定區 (Configuration)
# ============================================

# 專案路徑
PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
CRAWL_TEMP_DIR = PROJECT_ROOT / "crawl-temp"
PAGES_DIR = PROJECT_ROOT / "pages"

# 排除的目錄（不同步）
EXCLUDED_DIRS = {
    'images',           # 共用圖片目錄
    'category',         # WordPress 分類頁
    'elementor-hf',     # Elementor 內部頁面
    'hello-world',      # 測試頁面
    'solutions_old2',   # 舊版頁面
}

# placeholder 頁面識別關鍵字
PLACEHOLDER_KEYWORDS = ['建置中', '敬請期待', 'Coming Soon']


# ============================================
# 工具函數
# ============================================

def is_placeholder_page(pages_dir: Path, page_name: str) -> bool:
    """檢查頁面是否為 placeholder"""
    yml_path = pages_dir / page_name / "index.yml"
    if not yml_path.exists():
        return True  # 沒有 yml 視為需要更新

    try:
        with open(yml_path, 'r', encoding='utf-8') as f:
            content = f.read()
            for keyword in PLACEHOLDER_KEYWORDS:
                if keyword in content:
                    return True
    except Exception:
        pass

    return False


def get_crawled_domains(crawl_temp_dir: Path) -> List[str]:
    """取得已爬取的網域列表"""
    domains = []
    if crawl_temp_dir.exists():
        for item in crawl_temp_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                domains.append(item.name)
    return domains


def get_crawled_pages(domain_dir: Path) -> Set[str]:
    """取得爬取的頁面列表"""
    pages = set()
    for item in domain_dir.iterdir():
        if item.is_dir() and item.name not in EXCLUDED_DIRS:
            pages.add(item.name)
    return pages


def get_existing_pages(pages_dir: Path) -> Set[str]:
    """取得現有頁面列表"""
    pages = set()
    for item in pages_dir.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            pages.add(item.name)
    return pages


def convert_image_urls(content: str, page_name: str) -> Tuple[str, List[str]]:
    """
    轉換 Markdown 中的圖片 URL

    絕對 URL → 相對路徑 (./assets/filename.ext)

    Returns:
        (converted_content, list_of_image_filenames)
    """
    images_found = []

    def replace_url(match):
        alt_text = match.group(1)
        url = match.group(2)

        # 解析 URL
        parsed = urlparse(url)

        # 如果是絕對 URL，提取檔名
        if parsed.scheme in ('http', 'https'):
            filename = Path(unquote(parsed.path)).name
            images_found.append(filename)
            return f'![{alt_text}](./assets/{filename})'

        # 已經是相對路徑
        if url.startswith('./'):
            filename = Path(url).name
            images_found.append(filename)
            return match.group(0)

        return match.group(0)

    # 匹配 Markdown 圖片語法 ![alt](url)
    pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    converted = re.sub(pattern, replace_url, content)

    return converted, images_found


def sync_page(
    crawl_dir: Path,
    pages_dir: Path,
    page_name: str,
    force: bool = False,
    execute: bool = False
) -> Dict:
    """
    同步單一頁面

    Returns:
        操作結果報告
    """
    result = {
        'page': page_name,
        'status': 'skipped',
        'actions': [],
        'images_converted': [],
    }

    source_dir = crawl_dir / page_name
    target_dir = pages_dir / page_name

    # 檢查來源是否存在
    if not source_dir.exists():
        result['status'] = 'source_not_found'
        return result

    # 檢查是否為 placeholder 或強制更新
    is_placeholder = is_placeholder_page(pages_dir, page_name)

    if not is_placeholder and not force:
        result['status'] = 'optimized_skipped'
        result['actions'].append('頁面已優化，跳過（使用 --force 強制更新）')
        return result

    # 建立目標目錄
    if execute:
        target_dir.mkdir(parents=True, exist_ok=True)
        (target_dir / 'assets').mkdir(exist_ok=True)

    # 1. 處理 index.md
    source_md = source_dir / 'index.md'
    if source_md.exists():
        with open(source_md, 'r', encoding='utf-8') as f:
            content = f.read()

        # 轉換圖片 URL
        converted_content, images = convert_image_urls(content, page_name)
        result['images_converted'] = images

        if execute:
            target_md = target_dir / 'index.md'
            with open(target_md, 'w', encoding='utf-8') as f:
                f.write(converted_content)

        result['actions'].append(f'更新 index.md（{len(images)} 張圖片 URL 已轉換）')

    # 2. 複製圖片
    source_images = source_dir / 'images'
    if source_images.exists():
        image_count = 0
        for img_file in source_images.iterdir():
            if img_file.is_file():
                if execute:
                    target_img = target_dir / 'assets' / img_file.name
                    shutil.copy2(img_file, target_img)
                image_count += 1

        if image_count > 0:
            result['actions'].append(f'複製 {image_count} 個圖片檔案到 assets/')

    # 3. 建立/更新 index.yml（如果是新頁面）
    if not target_dir.exists() or not (target_dir / 'index.yml').exists():
        source_yml = source_dir / 'index.yml'
        if source_yml.exists():
            # 從爬取的 yml 提取 SEO 資訊
            with open(source_yml, 'r', encoding='utf-8') as f:
                crawled_yml = yaml.safe_load(f)

            # 建立新的 yml 結構
            new_yml = {
                'seo': crawled_yml.get('seo', {}),
                'url_mapping': {
                    'current_url': f'/{page_name}/',
                    'old_url': f'/{page_name}/',
                    'redirect': False
                },
                'layout': {
                    'sections': [
                        {'type': 'content', 'source': 'index.md'}
                    ]
                }
            }

            if execute:
                target_yml = target_dir / 'index.yml'
                with open(target_yml, 'w', encoding='utf-8') as f:
                    yaml.dump(new_yml, f, allow_unicode=True, default_flow_style=False)

            result['actions'].append('建立 index.yml')

    result['status'] = 'success' if result['actions'] else 'no_changes'
    return result


def generate_asset_mapping_suggestions(pages_dir: Path) -> List[Dict]:
    """
    產生圖片 ID 映射建議

    掃描所有頁面的 assets/ 目錄，建議標準化的 ID
    """
    suggestions = []

    for page_dir in pages_dir.iterdir():
        if not page_dir.is_dir():
            continue

        assets_dir = page_dir / 'assets'
        if not assets_dir.exists():
            continue

        for img_file in assets_dir.iterdir():
            if img_file.suffix.lower() in ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'):
                # 建議 ID：頁面名稱_檔名（snake_case）
                suggested_id = f"{page_dir.name}_{img_file.stem}".lower()
                suggested_id = re.sub(r'[^a-z0-9]+', '_', suggested_id)
                suggested_id = re.sub(r'_+', '_', suggested_id).strip('_')

                suggestions.append({
                    'file': str(img_file.relative_to(pages_dir)),
                    'current_name': img_file.name,
                    'suggested_id': suggested_id
                })

    return suggestions


# ============================================
# 主程式
# ============================================

def main():
    parser = argparse.ArgumentParser(
        description='將爬蟲結果同步到 pages/ 目錄',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        '--execute', '-e',
        action='store_true',
        help='執行同步（預設為預覽模式）'
    )

    parser.add_argument(
        '--pages', '-p',
        type=str,
        help='只處理指定頁面（逗號分隔）'
    )

    parser.add_argument(
        '--force', '-f',
        action='store_true',
        help='強制更新已優化頁面'
    )

    parser.add_argument(
        '--domain', '-d',
        type=str,
        help='指定網域（預設使用第一個找到的）'
    )

    parser.add_argument(
        '--suggestions', '-s',
        action='store_true',
        help='產生圖片 ID 映射建議'
    )

    args = parser.parse_args()

    print("=" * 60)
    print("📦 爬蟲結果同步工具 v1.0.0")
    print("=" * 60)

    # 檢查目錄
    if not CRAWL_TEMP_DIR.exists():
        print(f"❌ 找不到 crawl-temp 目錄：{CRAWL_TEMP_DIR}")
        sys.exit(1)

    if not PAGES_DIR.exists():
        print(f"❌ 找不到 pages 目錄：{PAGES_DIR}")
        sys.exit(1)

    # 取得網域
    domains = get_crawled_domains(CRAWL_TEMP_DIR)
    if not domains:
        print("❌ crawl-temp 目錄中沒有爬取結果")
        sys.exit(1)

    domain = args.domain if args.domain else domains[0]
    domain_dir = CRAWL_TEMP_DIR / domain

    if not domain_dir.exists():
        print(f"❌ 找不到網域目錄：{domain}")
        sys.exit(1)

    print(f"📍 來源：{domain_dir}")
    print(f"📁 目標：{PAGES_DIR}")
    print(f"🔧 模式：{'執行' if args.execute else '預覽'}")
    print("=" * 60)

    # 取得頁面列表
    crawled_pages = get_crawled_pages(domain_dir)
    existing_pages = get_existing_pages(PAGES_DIR)

    # 過濾指定頁面
    if args.pages:
        target_pages = set(args.pages.split(','))
        crawled_pages = crawled_pages & target_pages

    print(f"\n📊 頁面統計：")
    print(f"   爬取頁面：{len(crawled_pages)}")
    print(f"   現有頁面：{len(existing_pages)}")
    print(f"   新增頁面：{len(crawled_pages - existing_pages)}")

    # 同步每個頁面
    results = []
    for page_name in sorted(crawled_pages):
        result = sync_page(
            domain_dir,
            PAGES_DIR,
            page_name,
            force=args.force,
            execute=args.execute
        )
        results.append(result)

    # 輸出結果
    print(f"\n📋 同步結果：")
    print("-" * 60)

    status_counts = {}
    for result in results:
        status = result['status']
        status_counts[status] = status_counts.get(status, 0) + 1

        icon = {
            'success': '✅',
            'optimized_skipped': '⏭️',
            'source_not_found': '❌',
            'no_changes': '➖',
            'skipped': '⏭️'
        }.get(status, '❓')

        print(f"{icon} {result['page']}")
        for action in result['actions']:
            print(f"   └─ {action}")

    print("-" * 60)
    print(f"\n📊 統計：")
    for status, count in status_counts.items():
        print(f"   {status}: {count}")

    # 產生圖片映射建議
    if args.suggestions:
        print(f"\n🖼️ 圖片 ID 映射建議：")
        print("-" * 60)
        suggestions = generate_asset_mapping_suggestions(PAGES_DIR)
        for s in suggestions[:20]:  # 只顯示前 20 個
            print(f"   {s['current_name']} → {s['suggested_id']}")
        if len(suggestions) > 20:
            print(f"   ... 還有 {len(suggestions) - 20} 個")

    if not args.execute:
        print(f"\n💡 這是預覽模式。使用 --execute 執行實際同步。")


if __name__ == '__main__':
    main()
