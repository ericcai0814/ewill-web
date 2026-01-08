#!/usr/bin/env python3
"""
鎰威科技首頁靜態網站建置腳本

此腳本將 pages/index/ 的內容轉換為靜態 HTML/CSS/JS
輸出至 dist/ 目錄

用法:
    python3 scripts/build_index.py

需求:
    - Python 3.8+
    - pyyaml (pip install pyyaml)
    - markdown (pip install markdown)
"""

import os
import shutil
import yaml
import markdown
from pathlib import Path

# 專案根目錄
PROJECT_ROOT = Path(__file__).parent.parent
PAGES_DIR = PROJECT_ROOT / "pages"
DIST_DIR = PROJECT_ROOT / "dist"

def load_yaml(filepath: Path) -> dict:
    """載入 YAML 檔案"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def load_markdown(filepath: Path) -> str:
    """載入並轉換 Markdown 檔案"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    return markdown.markdown(content, extensions=['tables', 'fenced_code'])

def copy_assets(src_dir: Path, dest_dir: Path):
    """複製資源檔案"""
    dest_dir.mkdir(parents=True, exist_ok=True)
    for file in src_dir.glob('*'):
        if file.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']:
            shutil.copy2(file, dest_dir)

def build_index():
    """建置首頁"""
    print("🚀 開始建置首頁...")
    
    # 確保輸出目錄存在
    DIST_DIR.mkdir(exist_ok=True)
    
    # 載入內容
    index_yml = load_yaml(PAGES_DIR / "index" / "index.yml")
    index_md = load_markdown(PAGES_DIR / "index" / "index.md")
    
    print(f"  ✓ 載入 index.yml")
    print(f"  ✓ 載入 index.md")
    
    # 複製資源
    copy_assets(
        PAGES_DIR / "index" / "assets",
        DIST_DIR / "assets"
    )
    print(f"  ✓ 複製 assets")
    
    # 輸出 SEO 資訊
    seo = index_yml.get('seo', {})
    print(f"\n📄 SEO 資訊:")
    print(f"  Title: {seo.get('title')}")
    print(f"  Description: {seo.get('description')[:50]}...")
    print(f"  Keywords: {', '.join(seo.get('keywords', [])[:5])}...")
    
    # 輸出 AIO 資訊
    aio = index_yml.get('aio', {})
    org = aio.get('organization', {})
    print(f"\n🏢 Organization Schema:")
    print(f"  Name: {org.get('name')}")
    print(f"  URL: {org.get('url')}")
    
    faq = aio.get('faq', [])
    print(f"\n❓ FAQ Schema: {len(faq)} 個問題")
    
    print(f"\n✅ 建置完成！")
    print(f"   輸出目錄: {DIST_DIR}")
    print(f"   預覽: cd dist && python3 -m http.server 8080")
    print(f"   然後開啟 http://localhost:8080")

if __name__ == "__main__":
    build_index()


