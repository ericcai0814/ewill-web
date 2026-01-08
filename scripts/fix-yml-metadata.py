#!/usr/bin/env python3
"""
批次補齊 .yml 檔案的 id 和 alt 欄位（無外部依賴版本）
"""

import os
import re
from pathlib import Path

def generate_id_from_filename(filename: str) -> str:
    """從檔名生成 id"""
    # 移除 .yml 副檔名
    name = filename
    if name.endswith('.yml'):
        name = name[:-4]
    # 移除 .jpg, .png 等
    name = re.sub(r'\.(jpg|png|webp|gif)$', '', name, flags=re.IGNORECASE)
    # 轉為小寫，空格和連字號轉底線
    name = name.lower().replace('-', '_').replace(' ', '_')
    # 移除非 ASCII 字元，保留字母數字底線
    name = re.sub(r'[^a-z0-9_]', '', name)
    # 移除連續底線
    name = re.sub(r'_+', '_', name).strip('_')
    return name if name else 'img'

def parse_simple_yaml(content: str) -> dict:
    """簡單解析 YAML（僅支援單層結構）"""
    data = {}
    current_key = None
    
    for line in content.split('\n'):
        # 跳過註解和空行
        if not line.strip() or line.strip().startswith('#'):
            continue
        
        # 檢查是否是 key: value 格式
        match = re.match(r'^(\w+):\s*(.*)$', line)
        if match:
            key = match.group(1)
            value = match.group(2).strip()
            # 移除引號
            if value.startswith('"') and value.endswith('"'):
                value = value[1:-1]
            elif value.startswith("'") and value.endswith("'"):
                value = value[1:-1]
            data[key] = value
    
    return data

def generate_alt_from_description(description: str, filename: str) -> str:
    """從 description 生成 alt"""
    if description:
        # 取前 50 字
        alt = description[:50]
        if len(description) > 50:
            # 嘗試在逗號處截斷
            if '，' in alt:
                alt = alt.rsplit('，', 1)[0]
        return alt
    # 如果沒有 description，從檔名生成
    name = filename
    if name.endswith('.yml'):
        name = name[:-4]
    name = re.sub(r'\.(jpg|png|webp|gif)$', '', name, flags=re.IGNORECASE)
    return name

def fix_yml_file(yml_path: str) -> dict:
    """修復單個 .yml 檔案"""
    result = {'path': yml_path, 'updated': False, 'changes': []}
    
    try:
        with open(yml_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析 YAML
        data = parse_simple_yaml(content)
        
        # 取得原始檔名
        filename = os.path.basename(yml_path)
        
        needs_update = False
        
        # 檢查並補齊 id
        if 'id' not in data or not data['id']:
            data['id'] = generate_id_from_filename(filename)
            result['changes'].append(f"新增 id: {data['id']}")
            needs_update = True
        
        # 檢查並補齊 alt
        if 'alt' not in data or not data['alt']:
            data['alt'] = generate_alt_from_description(
                data.get('description', ''), 
                filename
            )
            result['changes'].append(f"新增 alt: {data['alt'][:30]}...")
            needs_update = True
        
        if needs_update:
            # 重新生成 YAML 內容
            lines = []
            
            # 按順序輸出欄位
            for key in ['id', 'alt', 'description', 'variants']:
                if key in data and data[key]:
                    value = data[key]
                    # 如果值包含特殊字元，用引號包裹
                    if isinstance(value, str) and ('"' in value or ':' in value or '\n' in value):
                        value = f"'{value}'"
                    elif isinstance(value, str) and any(c in value for c in ['，', '。', '、']):
                        value = f"'{value}'"
                    lines.append(f"{key}: {value}")
            
            # 寫回檔案
            with open(yml_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines) + '\n')
            
            result['updated'] = True
            
    except Exception as e:
        result['error'] = str(e)
    
    return result

def main():
    pages_dir = Path('pages')
    
    if not pages_dir.exists():
        print("❌ pages/ 目錄不存在")
        return
    
    # 找出所有 .yml 檔案（在 assets/ 目錄下）
    yml_files = list(pages_dir.glob('*/assets/*.yml'))
    
    print(f"🔍 找到 {len(yml_files)} 個 .yml 檔案")
    print("=" * 60)
    
    updated_count = 0
    error_count = 0
    skipped_count = 0
    
    for yml_path in yml_files:
        result = fix_yml_file(str(yml_path))
        
        if result.get('error'):
            print(f"❌ {yml_path}: {result['error']}")
            error_count += 1
        elif result['updated']:
            print(f"✅ {yml_path}")
            for change in result['changes']:
                print(f"   - {change}")
            updated_count += 1
        else:
            skipped_count += 1
    
    print("=" * 60)
    print(f"📊 結果：")
    print(f"   更新: {updated_count} 個檔案")
    print(f"   跳過: {skipped_count} 個檔案（已完整）")
    print(f"   錯誤: {error_count} 個檔案")

if __name__ == '__main__':
    main()
