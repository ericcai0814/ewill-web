#!/usr/bin/env python3
"""
網站設計分析腳本
分析 ewill.com.tw 的設計架構與風格規範
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import re
import json
from collections import defaultdict, Counter
import cssutils
import logging

# Suppress cssutils warnings
cssutils.log.setLevel(logging.CRITICAL)

BASE_URL = "https://www.ewill.com.tw/"

class WebsiteDesignAnalyzer:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.html_content = None
        self.soup = None
        self.css_contents = []
        self.inline_styles = []
        
        # Design tokens
        self.colors = defaultdict(int)
        self.fonts = defaultdict(int)
        self.font_sizes = defaultdict(int)
        self.spacing = defaultdict(int)
        self.breakpoints = []
        
    def fetch_page(self, url=None):
        """抓取網頁內容"""
        url = url or self.base_url
        print(f"正在抓取: {url}")
        response = self.session.get(url, timeout=30)
        response.encoding = 'utf-8'
        self.html_content = response.text
        self.soup = BeautifulSoup(self.html_content, 'html.parser')
        return self.soup
    
    def fetch_css_files(self):
        """抓取所有 CSS 檔案"""
        css_links = self.soup.find_all('link', rel='stylesheet')
        for link in css_links:
            href = link.get('href')
            if href:
                css_url = urljoin(self.base_url, href)
                try:
                    print(f"正在抓取 CSS: {css_url}")
                    response = self.session.get(css_url, timeout=30)
                    response.encoding = 'utf-8'
                    self.css_contents.append({
                        'url': css_url,
                        'content': response.text
                    })
                except Exception as e:
                    print(f"無法抓取 CSS {css_url}: {e}")
        
        # 收集 inline styles
        style_tags = self.soup.find_all('style')
        for style in style_tags:
            if style.string:
                self.inline_styles.append(style.string)
        
        return self.css_contents
    
    def extract_colors(self):
        """從 CSS 提取顏色"""
        color_patterns = [
            r'#[0-9a-fA-F]{6}\b',
            r'#[0-9a-fA-F]{3}\b',
            r'rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)',
            r'rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)',
        ]
        
        all_css = '\n'.join([css['content'] for css in self.css_contents] + self.inline_styles)
        
        for pattern in color_patterns:
            matches = re.findall(pattern, all_css, re.IGNORECASE)
            for match in matches:
                self.colors[match.lower().replace(' ', '')] += 1
        
        return dict(sorted(self.colors.items(), key=lambda x: x[1], reverse=True))
    
    def extract_fonts(self):
        """從 CSS 提取字型"""
        all_css = '\n'.join([css['content'] for css in self.css_contents] + self.inline_styles)
        
        # font-family
        font_pattern = r'font-family\s*:\s*([^;]+)'
        matches = re.findall(font_pattern, all_css, re.IGNORECASE)
        for match in matches:
            font = match.strip().strip('"\'')
            self.fonts[font] += 1
        
        # font-size
        size_pattern = r'font-size\s*:\s*([^;]+)'
        matches = re.findall(size_pattern, all_css, re.IGNORECASE)
        for match in matches:
            size = match.strip()
            self.font_sizes[size] += 1
        
        return {
            'families': dict(sorted(self.fonts.items(), key=lambda x: x[1], reverse=True)),
            'sizes': dict(sorted(self.font_sizes.items(), key=lambda x: x[1], reverse=True))
        }
    
    def extract_spacing(self):
        """從 CSS 提取間距值"""
        all_css = '\n'.join([css['content'] for css in self.css_contents] + self.inline_styles)
        
        spacing_patterns = [
            r'(?:margin|padding)(?:-(?:top|right|bottom|left))?\s*:\s*([^;]+)',
            r'gap\s*:\s*([^;]+)',
        ]
        
        for pattern in spacing_patterns:
            matches = re.findall(pattern, all_css, re.IGNORECASE)
            for match in matches:
                self.spacing[match.strip()] += 1
        
        return dict(sorted(self.spacing.items(), key=lambda x: x[1], reverse=True)[:30])
    
    def extract_breakpoints(self):
        """從 CSS 提取響應式斷點"""
        all_css = '\n'.join([css['content'] for css in self.css_contents] + self.inline_styles)
        
        media_pattern = r'@media[^{]+\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}'
        query_pattern = r'@media\s+([^{]+)'
        
        queries = re.findall(query_pattern, all_css, re.IGNORECASE)
        breakpoint_values = []
        
        for query in queries:
            # Extract pixel values
            px_matches = re.findall(r'(\d+)px', query)
            for px in px_matches:
                breakpoint_values.append(int(px))
        
        self.breakpoints = sorted(set(breakpoint_values))
        return self.breakpoints
    
    def analyze_navigation(self):
        """分析導覽結構"""
        nav_info = {
            'main_nav': [],
            'sub_nav': [],
            'footer_nav': [],
            'breadcrumb': None
        }
        
        # 主選單
        header = self.soup.find('header') or self.soup.find('nav') or self.soup.find(class_=re.compile(r'header|nav', re.I))
        if header:
            links = header.find_all('a')
            for link in links[:20]:  # 限制數量
                nav_info['main_nav'].append({
                    'text': link.get_text(strip=True)[:50],
                    'href': link.get('href', '')
                })
        
        # 頁尾
        footer = self.soup.find('footer') or self.soup.find(class_=re.compile(r'footer', re.I))
        if footer:
            links = footer.find_all('a')
            for link in links[:20]:
                nav_info['footer_nav'].append({
                    'text': link.get_text(strip=True)[:50],
                    'href': link.get('href', '')
                })
        
        # 麵包屑
        breadcrumb = self.soup.find(class_=re.compile(r'breadcrumb', re.I))
        if breadcrumb:
            nav_info['breadcrumb'] = breadcrumb.get_text(strip=True)[:200]
        
        return nav_info
    
    def analyze_ui_components(self):
        """分析 UI 元件"""
        components = {
            'buttons': [],
            'forms': [],
            'cards': [],
            'images': [],
            'icons': []
        }
        
        # 按鈕
        buttons = self.soup.find_all(['button', 'a'])
        btn_classes = set()
        for btn in buttons:
            classes = btn.get('class', [])
            if classes:
                for cls in classes:
                    if 'btn' in cls.lower() or 'button' in cls.lower():
                        btn_classes.add(cls)
        components['buttons'] = list(btn_classes)[:20]
        
        # 表單
        forms = self.soup.find_all('form')
        for form in forms[:5]:
            form_info = {
                'action': form.get('action', ''),
                'method': form.get('method', ''),
                'inputs': len(form.find_all(['input', 'textarea', 'select']))
            }
            components['forms'].append(form_info)
        
        # 圖片
        images = self.soup.find_all('img')
        for img in images[:20]:
            components['images'].append({
                'src': img.get('src', '')[:100],
                'alt': img.get('alt', '')[:50],
                'class': ' '.join(img.get('class', []))
            })
        
        # 圖示 (font icons, svg)
        icons = self.soup.find_all(class_=re.compile(r'icon|fa-|bi-', re.I))
        icon_classes = set()
        for icon in icons:
            classes = icon.get('class', [])
            icon_classes.update(classes)
        components['icons'] = list(icon_classes)[:30]
        
        return components
    
    def analyze_layout(self):
        """分析版面結構"""
        layout = {
            'sections': [],
            'grid_classes': [],
            'container_classes': []
        }
        
        # 區塊
        sections = self.soup.find_all(['section', 'div'], class_=re.compile(r'section|container|wrapper|row|col', re.I))
        section_classes = set()
        for section in sections:
            classes = section.get('class', [])
            section_classes.update(classes)
        
        layout['sections'] = list(section_classes)[:30]
        
        # Grid 相關類別
        grid_elements = self.soup.find_all(class_=re.compile(r'grid|row|col|flex', re.I))
        grid_classes = set()
        for elem in grid_elements:
            classes = elem.get('class', [])
            grid_classes.update(classes)
        layout['grid_classes'] = list(grid_classes)[:30]
        
        return layout
    
    def extract_css_classes(self):
        """提取 CSS 類別命名慣例"""
        all_css = '\n'.join([css['content'] for css in self.css_contents] + self.inline_styles)
        
        # 提取所有 class 選擇器
        class_pattern = r'\.([a-zA-Z_-][a-zA-Z0-9_-]*)'
        matches = re.findall(class_pattern, all_css)
        
        class_counter = Counter(matches)
        
        # 分類
        categorized = {
            'layout': [],
            'typography': [],
            'color': [],
            'spacing': [],
            'component': [],
            'utility': [],
            'other': []
        }
        
        for cls, count in class_counter.most_common(100):
            if any(x in cls.lower() for x in ['container', 'wrapper', 'row', 'col', 'grid', 'flex']):
                categorized['layout'].append(cls)
            elif any(x in cls.lower() for x in ['text', 'font', 'title', 'heading', 'h1', 'h2', 'h3']):
                categorized['typography'].append(cls)
            elif any(x in cls.lower() for x in ['color', 'bg', 'background', 'primary', 'secondary']):
                categorized['color'].append(cls)
            elif any(x in cls.lower() for x in ['margin', 'padding', 'mt', 'mb', 'pt', 'pb', 'gap']):
                categorized['spacing'].append(cls)
            elif any(x in cls.lower() for x in ['btn', 'button', 'card', 'nav', 'header', 'footer', 'modal']):
                categorized['component'].append(cls)
            elif any(x in cls.lower() for x in ['d-', 'w-', 'h-', 'hidden', 'visible', 'show']):
                categorized['utility'].append(cls)
            else:
                categorized['other'].append(cls)
        
        return categorized
    
    def analyze_typography_hierarchy(self):
        """分析文字層級"""
        hierarchy = {}
        
        for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a']:
            elements = self.soup.find_all(tag)
            if elements:
                sample_texts = []
                classes = set()
                for elem in elements[:5]:
                    text = elem.get_text(strip=True)[:100]
                    if text:
                        sample_texts.append(text)
                    elem_classes = elem.get('class', [])
                    classes.update(elem_classes)
                
                hierarchy[tag] = {
                    'count': len(elements),
                    'sample_classes': list(classes)[:10],
                    'samples': sample_texts[:3]
                }
        
        return hierarchy
    
    def analyze_accessibility(self):
        """分析無障礙設計"""
        a11y = {
            'images_with_alt': 0,
            'images_without_alt': 0,
            'aria_labels': [],
            'form_labels': 0,
            'skip_links': False,
            'lang_attribute': None,
            'semantic_elements': {}
        }
        
        # 圖片 alt
        images = self.soup.find_all('img')
        for img in images:
            if img.get('alt'):
                a11y['images_with_alt'] += 1
            else:
                a11y['images_without_alt'] += 1
        
        # ARIA
        aria_elements = self.soup.find_all(attrs={'aria-label': True})
        for elem in aria_elements[:10]:
            a11y['aria_labels'].append(elem.get('aria-label'))
        
        # 表單標籤
        labels = self.soup.find_all('label')
        a11y['form_labels'] = len(labels)
        
        # 跳過連結
        skip = self.soup.find(attrs={'href': '#main'}) or self.soup.find(class_=re.compile(r'skip', re.I))
        a11y['skip_links'] = skip is not None
        
        # 語言屬性
        html_tag = self.soup.find('html')
        if html_tag:
            a11y['lang_attribute'] = html_tag.get('lang')
        
        # 語意化元素
        for tag in ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer']:
            count = len(self.soup.find_all(tag))
            if count > 0:
                a11y['semantic_elements'][tag] = count
        
        return a11y
    
    def generate_report(self):
        """生成完整分析報告"""
        print("\n" + "="*60)
        print("開始分析網站設計...")
        print("="*60 + "\n")
        
        # 抓取資料
        self.fetch_page()
        self.fetch_css_files()
        
        report = {
            'url': self.base_url,
            'colors': self.extract_colors(),
            'fonts': self.extract_fonts(),
            'spacing': self.extract_spacing(),
            'breakpoints': self.extract_breakpoints(),
            'navigation': self.analyze_navigation(),
            'ui_components': self.analyze_ui_components(),
            'layout': self.analyze_layout(),
            'css_classes': self.extract_css_classes(),
            'typography_hierarchy': self.analyze_typography_hierarchy(),
            'accessibility': self.analyze_accessibility()
        }
        
        return report
    
    def format_markdown_report(self, report):
        """將報告格式化為 Markdown"""
        md = []
        
        md.append("# 鎰威科技網站設計規範指南")
        md.append(f"\n**分析網址**: {report['url']}")
        md.append(f"**分析日期**: 2026-01-06")
        md.append("\n---\n")
        
        # 1. 色彩系統
        md.append("## 1. 網站整體視覺風格定義\n")
        md.append("### 1.1 色彩系統\n")
        md.append("| 顏色代碼 | 使用次數 | 用途推測 |")
        md.append("|----------|----------|----------|")
        
        colors = list(report['colors'].items())[:15]
        for color, count in colors:
            md.append(f"| `{color}` | {count} | - |")
        
        # 字型
        md.append("\n### 1.2 字型系統\n")
        md.append("**字型家族：**\n")
        for font, count in list(report['fonts']['families'].items())[:10]:
            md.append(f"- `{font}` (使用 {count} 次)")
        
        md.append("\n**字級：**\n")
        for size, count in list(report['fonts']['sizes'].items())[:15]:
            md.append(f"- `{size}` (使用 {count} 次)")
        
        # 間距
        md.append("\n### 1.3 間距系統\n")
        md.append("常用間距值：\n")
        for spacing, count in list(report['spacing'].items())[:15]:
            md.append(f"- `{spacing}` (使用 {count} 次)")
        
        # 2. 導覽架構
        md.append("\n---\n")
        md.append("## 2. 導覽與資訊架構規則\n")
        md.append("### 2.1 主選單結構\n")
        for item in report['navigation']['main_nav'][:10]:
            md.append(f"- [{item['text']}]({item['href']})")
        
        md.append("\n### 2.2 頁尾導覽\n")
        for item in report['navigation']['footer_nav'][:10]:
            md.append(f"- [{item['text']}]({item['href']})")
        
        if report['navigation']['breadcrumb']:
            md.append("\n### 2.3 麵包屑\n")
            md.append(f"範例: `{report['navigation']['breadcrumb']}`")
        
        # 3. UI 元件
        md.append("\n---\n")
        md.append("## 3. UI 元件設計規範\n")
        md.append("### 3.1 按鈕類別\n")
        for btn in report['ui_components']['buttons'][:10]:
            md.append(f"- `.{btn}`")
        
        md.append("\n### 3.2 表單元件\n")
        for form in report['ui_components']['forms']:
            md.append(f"- 表單: action=`{form['action']}`, 包含 {form['inputs']} 個輸入欄位")
        
        md.append("\n### 3.3 圖示類別\n")
        for icon in report['ui_components']['icons'][:15]:
            md.append(f"- `.{icon}`")
        
        # 4. 響應式斷點
        md.append("\n---\n")
        md.append("## 4. 響應式設計斷點與行為規則\n")
        md.append("### 4.1 斷點值\n")
        if report['breakpoints']:
            md.append("| 斷點 | 像素值 | 裝置類型推測 |")
            md.append("|------|--------|--------------|")
            for bp in report['breakpoints']:
                device = "手機" if bp < 768 else ("平板" if bp < 1024 else "桌面")
                md.append(f"| breakpoint | {bp}px | {device} |")
        else:
            md.append("未偵測到明確的斷點定義")
        
        # 5. 版面網格
        md.append("\n---\n")
        md.append("## 5. 版面網格系統與佈局規則\n")
        md.append("### 5.1 Grid 類別\n")
        for cls in report['layout']['grid_classes'][:15]:
            md.append(f"- `.{cls}`")
        
        md.append("\n### 5.2 區塊類別\n")
        for cls in report['layout']['sections'][:15]:
            md.append(f"- `.{cls}`")
        
        # 6. CSS 類別命名
        md.append("\n---\n")
        md.append("## 6. 可重用樣式類別與命名慣例\n")
        
        for category, classes in report['css_classes'].items():
            if classes:
                md.append(f"\n### 6.{list(report['css_classes'].keys()).index(category)+1} {category.title()} 類別\n")
                for cls in classes[:10]:
                    md.append(f"- `.{cls}`")
        
        # 7. 色彩與圖像
        md.append("\n---\n")
        md.append("## 7. 色彩與圖像使用規則\n")
        md.append("### 7.1 圖像資源\n")
        for img in report['ui_components']['images'][:10]:
            md.append(f"- 來源: `{img['src']}`")
            if img['alt']:
                md.append(f"  - Alt: {img['alt']}")
            if img['class']:
                md.append(f"  - Class: `.{img['class']}`")
        
        # 8. 文字層級
        md.append("\n---\n")
        md.append("## 8. 文字樣式級別與階層\n")
        
        for tag, info in report['typography_hierarchy'].items():
            md.append(f"\n### `<{tag}>` 標籤\n")
            md.append(f"- 數量: {info['count']}")
            if info['sample_classes']:
                md.append(f"- 類別: {', '.join(['`.'+c+'`' for c in info['sample_classes'][:5]])}")
            if info['samples']:
                md.append("- 範例:")
                for sample in info['samples'][:2]:
                    md.append(f"  - \"{sample[:60]}...\"" if len(sample) > 60 else f"  - \"{sample}\"")
        
        # 9. 無障礙設計
        md.append("\n---\n")
        md.append("## 9. 無障礙設計與可用性要點\n")
        a11y = report['accessibility']
        
        md.append("### 9.1 圖片替代文字\n")
        md.append(f"- 有 alt 屬性: {a11y['images_with_alt']} 張")
        md.append(f"- 缺少 alt 屬性: {a11y['images_without_alt']} 張")
        
        md.append("\n### 9.2 ARIA 標籤\n")
        for label in a11y['aria_labels'][:5]:
            md.append(f"- `{label}`")
        
        md.append("\n### 9.3 語意化 HTML\n")
        md.append(f"- 語言屬性: `{a11y['lang_attribute']}`")
        md.append(f"- 表單標籤數量: {a11y['form_labels']}")
        md.append(f"- Skip Link: {'有' if a11y['skip_links'] else '無'}")
        md.append("\n語意化元素使用:")
        for elem, count in a11y['semantic_elements'].items():
            md.append(f"- `<{elem}>`: {count} 個")
        
        # 10. 實例摘錄
        md.append("\n---\n")
        md.append("## 10. 實例摘錄與規範範例片段\n")
        md.append("\n### 10.1 主要色彩範例\n")
        md.append("```css")
        md.append(":root {")
        for color, count in colors[:5]:
            md.append(f"  --color-{colors.index((color, count))+1}: {color};")
        md.append("}")
        md.append("```")
        
        md.append("\n### 10.2 字型範例\n")
        md.append("```css")
        fonts_list = list(report['fonts']['families'].keys())[:3]
        if fonts_list:
            md.append(f"font-family: {fonts_list[0]};")
        md.append("```")
        
        md.append("\n### 10.3 按鈕樣式範例\n")
        md.append("```css")
        for btn in report['ui_components']['buttons'][:3]:
            md.append(f".{btn} {{ /* 按鈕樣式 */ }}")
        md.append("```")
        
        return '\n'.join(md)


def main():
    analyzer = WebsiteDesignAnalyzer(BASE_URL)
    report = analyzer.generate_report()
    
    # 輸出 JSON 報告
    json_path = '/Users/ericcai/project/ewill-legacy-assets/docs/design-analysis.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"\nJSON 報告已儲存至: {json_path}")
    
    # 輸出 Markdown 報告
    md_content = analyzer.format_markdown_report(report)
    md_path = '/Users/ericcai/project/ewill-legacy-assets/docs/DESIGN_GUIDELINE.md'
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    print(f"Markdown 報告已儲存至: {md_path}")
    
    print("\n分析完成！")


if __name__ == '__main__':
    main()
