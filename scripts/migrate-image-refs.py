#!/usr/bin/env python3
"""
遷移圖片引用：從 index.md 移至 index.yml layout
"""

import os
import re
from pathlib import Path

def extract_image_refs(md_content: str) -> list:
    """從 markdown 內容提取圖片引用"""
    # 匹配 ![alt](path) 或 ![](path) 格式
    pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    matches = re.findall(pattern, md_content)
    
    refs = []
    for alt, path in matches:
        if path.startswith('assets/'):
            refs.append({
                'alt': alt,
                'path': path,
                'filename': os.path.basename(path)
            })
    return refs

def get_image_id(assets_dir: str, filename: str) -> str:
    """從 .yml 檔案獲取 image id"""
    yml_path = os.path.join(assets_dir, f"{filename}.yml")
    if os.path.exists(yml_path):
        with open(yml_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('id:'):
                    return line.split(':', 1)[1].strip()
    # 如果沒有 .yml，從檔名生成
    name = Path(filename).stem
    name = re.sub(r'\.(jpg|png|webp|gif)$', '', name, flags=re.IGNORECASE)
    name = name.lower().replace('-', '_').replace(' ', '_')
    name = re.sub(r'[^a-z0-9_]', '', name)
    name = re.sub(r'_+', '_', name).strip('_')
    return name if name else 'img'

def remove_image_refs_from_md(md_content: str) -> str:
    """從 markdown 移除圖片引用（保留其他內容）"""
    # 移除獨立行的圖片引用
    lines = md_content.split('\n')
    new_lines = []
    
    for line in lines:
        # 檢查是否是純圖片引用行
        stripped = line.strip()
        if re.match(r'^!\[([^\]]*)\]\(assets/[^)]+\)$', stripped):
            # 跳過這行（圖片引用）
            continue
        new_lines.append(line)
    
    # 移除連續的空行（超過2個）
    result = '\n'.join(new_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    
    return result

def generate_layout_yaml(image_refs: list, assets_dir: str) -> str:
    """生成 layout YAML 內容"""
    if not image_refs:
        return ""
    
    lines = ["layout:"]
    
    # 第一張圖作為 hero
    if image_refs:
        first_ref = image_refs[0]
        image_id = get_image_id(assets_dir, first_ref['filename'])
        lines.append("  hero:")
        lines.append("    image:")
        lines.append(f"      id: {image_id}")
    
    # 其餘圖片作為 content_images
    if len(image_refs) > 1:
        lines.append("  content_images:")
        for ref in image_refs[1:]:
            image_id = get_image_id(assets_dir, ref['filename'])
            lines.append(f"    - id: {image_id}")
    
    return '\n'.join(lines)

def update_index_yml(yml_path: str, layout_yaml: str) -> bool:
    """更新 index.yml 添加 layout 區塊"""
    if not os.path.exists(yml_path):
        # 創建新檔案
        with open(yml_path, 'w', encoding='utf-8') as f:
            f.write(layout_yaml + '\n')
        return True
    
    with open(yml_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 檢查是否已有 layout
    if 'layout:' in content:
        return False  # 已有 layout，不覆蓋
    
    # 添加 layout 到檔案末尾
    with open(yml_path, 'a', encoding='utf-8') as f:
        f.write('\n' + layout_yaml + '\n')
    
    return True

def migrate_page(page_dir: str) -> dict:
    """遷移單個頁面"""
    result = {
        'page': page_dir,
        'refs_found': 0,
        'refs_migrated': 0,
        'md_updated': False,
        'yml_updated': False,
        'error': None
    }
    
    md_path = os.path.join(page_dir, 'index.md')
    yml_path = os.path.join(page_dir, 'index.yml')
    assets_dir = os.path.join(page_dir, 'assets')
    
    if not os.path.exists(md_path):
        result['error'] = 'index.md not found'
        return result
    
    try:
        # 讀取 markdown
        with open(md_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # 提取圖片引用
        image_refs = extract_image_refs(md_content)
        result['refs_found'] = len(image_refs)
        
        if not image_refs:
            return result
        
        # 生成 layout YAML
        layout_yaml = generate_layout_yaml(image_refs, assets_dir)
        
        # 更新 index.yml
        if update_index_yml(yml_path, layout_yaml):
            result['yml_updated'] = True
            result['refs_migrated'] = len(image_refs)
        
        # 移除 md 中的圖片引用
        new_md_content = remove_image_refs_from_md(md_content)
        if new_md_content != md_content:
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(new_md_content)
            result['md_updated'] = True
        
    except Exception as e:
        result['error'] = str(e)
    
    return result

def main():
    pages_dir = Path('pages')
    
    if not pages_dir.exists():
        print("❌ pages/ 目錄不存在")
        return
    
    # 找出所有頁面目錄
    page_dirs = [d for d in pages_dir.iterdir() if d.is_dir()]
    
    print(f"🔍 找到 {len(page_dirs)} 個頁面")
    print("=" * 60)
    
    total_refs = 0
    migrated_refs = 0
    updated_pages = 0
    skipped_pages = 0
    
    for page_dir in sorted(page_dirs):
        # 跳過 index 頁面（已經處理過）
        if page_dir.name == 'index':
            print(f"⏭️  {page_dir} (已處理，跳過)")
            skipped_pages += 1
            continue
        
        result = migrate_page(str(page_dir))
        
        if result['error']:
            print(f"❌ {page_dir}: {result['error']}")
        elif result['refs_found'] == 0:
            print(f"⏭️  {page_dir} (無圖片引用)")
            skipped_pages += 1
        else:
            status = "✅" if result['yml_updated'] else "⚠️ "
            print(f"{status} {page_dir}")
            print(f"   - 圖片引用: {result['refs_found']}")
            if result['yml_updated']:
                print(f"   - yml 已更新 layout")
            if result['md_updated']:
                print(f"   - md 已移除圖片引用")
            
            total_refs += result['refs_found']
            migrated_refs += result['refs_migrated']
            if result['yml_updated'] or result['md_updated']:
                updated_pages += 1
    
    print("=" * 60)
    print(f"📊 結果：")
    print(f"   總圖片引用: {total_refs}")
    print(f"   已遷移: {migrated_refs}")
    print(f"   更新頁面: {updated_pages}")
    print(f"   跳過頁面: {skipped_pages}")

if __name__ == '__main__':
    main()

