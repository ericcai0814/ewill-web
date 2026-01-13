#!/usr/bin/env python3
"""
網站內容爬蟲與備份工具 (Website Content Crawler & Backup Tool)

用途：
    完整備份一個網站的內容，包含頁面、圖片、SEO 設定等。

使用方式：
    # 分階段模式（預設）：先爬首頁確認，再爬全站
    python crawler.py https://example.com
    
    # 預覽模式：只爬首頁，產生預覽供確認
    python crawler.py https://example.com --preview
    
    # 繼續爬取：確認無誤後繼續爬取全站
    python crawler.py https://example.com --continue
    
    # 一次爬完（跳過確認）
    python crawler.py https://example.com --full
    
    # Debug 模式：顯示詳細的圖片擷取過程
    python crawler.py https://example.com --debug

輸出：
    ./{domain}/
    ├── index.md                 # 頁面 Markdown
    ├── index.yml                # SEO/Schema.org 設定
    ├── images/                  # 頁面圖片
    │   ├── image-name.jpg
    │   └── image-name.yml       # 圖片描述
    └── ...

Author: Auto-generated for Agent use
Version: 1.2.0 (修正圖片擷取問題)
"""

import os
import re
import sys
import json
import time
import hashlib
import argparse
import mimetypes
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse, urljoin, unquote
from typing import Optional
from dataclasses import dataclass, field

import requests
from bs4 import BeautifulSoup
import yaml


# ============================================
# 設定區 (Configuration)
# ============================================

@dataclass
class CrawlerConfig:
    """爬蟲設定"""
    # 執行模式
    mode: str = 'preview'  # preview, continue, full
    
    # Debug 模式
    debug: bool = False
    
    # 請求設定
    crawl_delay: float = 2.0  # 請求間隔（秒）
    timeout: int = 30  # 請求超時（秒）
    max_retries: int = 3  # 最大重試次數
    
    # User-Agent
    user_agent: str = "Mozilla/5.0 (compatible; ContentBackupBot/1.0)"
    
    # 輸出設定
    output_dir: str = "../../../"  # 修正：輸出到專案根目錄
    
    # 圖片過濾規則（只排除明確的裝飾圖片和廣告）
    excluded_image_patterns: list = field(default_factory=lambda: [
        r'^favicon', r'sprite',
        r'1x1\.', r'tracking', r'analytics',
        r'advertisement', r'banner[-_]ad',
        r'pixel\.gif', r'spacer\.gif'
    ])
    
    # 最小圖片尺寸（小於此尺寸視為裝飾圖片）
    min_image_size: int = 50  # px（降低門檻）
    
    # 排除的 HTML 元素
    excluded_elements: list = field(default_factory=lambda: [
        'script', 'style', 'noscript', 'iframe', 
        'form', 'button', 'input', 'select', 'textarea'
    ])
    
    # 排除的 class 關鍵字（使用精確匹配）
    excluded_classes: list = field(default_factory=lambda: [
        'advertisement', 'cookie-banner', 'popup', 'modal',
        'social-share', 'comment-form'
    ])
    
    # 排除的 id 關鍵字
    excluded_ids: list = field(default_factory=lambda: [
        'cookie-notice', 'popup-overlay', 'ad-container'
    ])

    # 排除的 URL 路徑（用於過濾不需要爬取的頁面）
    excluded_paths: list = field(default_factory=list)

    # 圖片目錄名稱（default: 'images', pages 格式: 'assets'）
    images_dir_name: str = 'images'


# ============================================
# 工具函式 (Utility Functions)
# ============================================

def slugify(text: str) -> str:
    """將文字轉換為 URL-friendly 的 slug"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def normalize_url(url: str) -> str:
    """
    正規化 URL，確保相同頁面只有一個 URL 表示

    - 移除結尾斜線（首頁除外）
    - 移除 query string 和 fragment

    Examples:
        /about_us/ → /about_us
        /about_us  → /about_us
        /          → /
    """
    parsed = urlparse(url)
    path = parsed.path

    # 移除結尾斜線（但保留根路徑 /）
    if path != '/' and path.endswith('/'):
        path = path.rstrip('/')

    # 重建 URL（不含 query string 和 fragment）
    return f"{parsed.scheme}://{parsed.netloc}{path}"


def url_to_path(url: str, base_domain: str) -> Path:
    """將 URL 轉換為檔案系統路徑"""
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    
    if not path:
        return Path(base_domain)
    
    # 移除 .html, .htm, .php 等副檔名
    path = re.sub(r'\.(html?|php|aspx?)$', '', path, flags=re.IGNORECASE)
    
    # 轉換為安全的路徑
    parts = [slugify(unquote(p)) for p in path.split('/') if p]
    
    return Path(base_domain) / '/'.join(parts) if parts else Path(base_domain)


def get_file_hash(content: bytes) -> str:
    """計算檔案的 MD5 hash"""
    return hashlib.md5(content).hexdigest()


def sanitize_filename(filename: str) -> str:
    """清理檔案名稱"""
    # 移除不安全字元
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # 限制長度
    name, ext = os.path.splitext(filename)
    if len(name) > 100:
        name = name[:100]
    return f"{name}{ext}"


def format_datetime() -> str:
    """取得 ISO 8601 格式的現在時間"""
    return datetime.now().astimezone().isoformat()


# ============================================
# 網頁擷取器 (Web Fetcher)
# ============================================

class WebFetcher:
    """負責網頁請求的類別"""
    
    def __init__(self, config: CrawlerConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': config.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8',
            'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        })
        self.last_request_time = 0
    
    def _wait_for_delay(self):
        """等待爬取間隔"""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.config.crawl_delay:
            time.sleep(self.config.crawl_delay - elapsed)
    
    def fetch(self, url: str, binary: bool = False) -> Optional[bytes | str]:
        """擷取網頁內容"""
        self._wait_for_delay()
        
        for attempt in range(self.config.max_retries):
            try:
                response = self.session.get(
                    url,
                    timeout=self.config.timeout,
                    allow_redirects=True
                )
                response.raise_for_status()
                self.last_request_time = time.time()
                
                if binary:
                    return response.content
                return response.text
                
            except requests.RequestException as e:
                print(f"  ⚠️  嘗試 {attempt + 1}/{self.config.max_retries} 失敗: {e}")
                if attempt < self.config.max_retries - 1:
                    time.sleep(2 ** attempt)  # 指數退避
                    
        return None
    
    def fetch_robots_txt(self, domain: str) -> Optional[str]:
        """擷取 robots.txt"""
        url = f"https://{domain}/robots.txt"
        return self.fetch(url)
    
    def fetch_sitemap(self, domain: str) -> list[str]:
        """擷取 sitemap.xml 中的所有 URL"""
        urls = []
        sitemap_url = f"https://{domain}/sitemap.xml"
        
        content = self.fetch(sitemap_url)
        if not content:
            return urls
        
        try:
            soup = BeautifulSoup(content, 'xml')
            
            # 處理 sitemap index
            sitemaps = soup.find_all('sitemap')
            if sitemaps:
                for sitemap in sitemaps:
                    loc = sitemap.find('loc')
                    if loc:
                        sub_urls = self._parse_sitemap(loc.text)
                        urls.extend(sub_urls)
            else:
                urls = self._parse_sitemap_content(soup)
                
        except Exception as e:
            print(f"  ⚠️  解析 sitemap 失敗: {e}")
            
        return urls
    
    def _parse_sitemap(self, url: str) -> list[str]:
        """解析單個 sitemap"""
        content = self.fetch(url)
        if not content:
            return []
        
        soup = BeautifulSoup(content, 'xml')
        return self._parse_sitemap_content(soup)
    
    def _parse_sitemap_content(self, soup: BeautifulSoup) -> list[str]:
        """從 sitemap soup 中提取 URL"""
        urls = []
        for url_tag in soup.find_all('url'):
            loc = url_tag.find('loc')
            if loc:
                urls.append(loc.text)
        return urls


# ============================================
# 內容解析器 (Content Parser)
# ============================================

class ContentParser:
    """負責解析和清理 HTML 內容"""
    
    def __init__(self, config: CrawlerConfig):
        self.config = config
    
    def parse(self, html: str, base_url: str) -> dict:
        """解析 HTML 並提取主要內容"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # 提取 metadata
        metadata = self._extract_metadata(soup)
        
        # [重要修正] 先從完整頁面提取所有圖片，再清理 HTML
        all_images_before_clean = self._extract_all_images_from_soup(soup, base_url)
        
        if self.config.debug:
            print(f"      [DEBUG] 清理前找到 {len(all_images_before_clean)} 張圖片")
        
        # 清理 HTML
        cleaned_soup = self._clean_html(soup)
        
        # 提取主要內容
        main_content = self._extract_main_content(cleaned_soup)
        
        # 從主要內容區塊提取圖片
        main_content_images = self._extract_images(main_content, base_url)
        
        if self.config.debug:
            print(f"      [DEBUG] 主內容區塊找到 {len(main_content_images)} 張圖片")
        
        # [重要修正] 合併圖片：優先使用主內容的，但補上可能漏掉的
        images = self._merge_images(main_content_images, all_images_before_clean)
        
        if self.config.debug:
            print(f"      [DEBUG] 合併後共 {len(images)} 張圖片")
        
        # 轉換為 Markdown
        markdown = self._to_markdown(main_content, base_url)
        
        return {
            'metadata': metadata,
            'markdown': markdown,
            'images': images,
            'soup': main_content
        }
    
    def _extract_metadata(self, soup: BeautifulSoup) -> dict:
        """提取頁面 metadata"""
        metadata = {
            'title': '',
            'description': '',
            'keywords': [],
            'og_title': '',
            'og_description': '',
            'og_image': '',
            'canonical': ''
        }
        
        # Title
        title_tag = soup.find('title')
        if title_tag:
            metadata['title'] = title_tag.get_text(strip=True)
        
        # Meta tags
        for meta in soup.find_all('meta'):
            name = meta.get('name', '').lower()
            property_attr = meta.get('property', '').lower()
            content = meta.get('content', '')
            
            if name == 'description':
                metadata['description'] = content
            elif name == 'keywords':
                metadata['keywords'] = [k.strip() for k in content.split(',')]
            elif property_attr == 'og:title':
                metadata['og_title'] = content
            elif property_attr == 'og:description':
                metadata['og_description'] = content
            elif property_attr == 'og:image':
                metadata['og_image'] = content
        
        # Canonical
        canonical = soup.find('link', rel='canonical')
        if canonical:
            metadata['canonical'] = canonical.get('href', '')
        
        return metadata
    
    def _clean_html(self, soup: BeautifulSoup) -> BeautifulSoup:
        """清理 HTML，移除不需要的元素（更保守的策略）"""
        soup = BeautifulSoup(str(soup), 'html.parser')
        
        # 只移除確定不需要的元素
        for tag_name in self.config.excluded_elements:
            for tag in soup.find_all(tag_name):
                tag.decompose()
        
        # [修正] 使用精確的 class 匹配（word boundary）
        for class_keyword in self.config.excluded_classes:
            # 只匹配完整的 class 名稱
            for tag in soup.find_all(class_=lambda x: x and class_keyword in x.split()):
                if self.config.debug:
                    print(f"      [DEBUG] 移除元素 (class={class_keyword}): {tag.name}")
                tag.decompose()
        
        # [修正] 使用精確的 id 匹配
        for id_keyword in self.config.excluded_ids:
            for tag in soup.find_all(id=id_keyword):
                if self.config.debug:
                    print(f"      [DEBUG] 移除元素 (id={id_keyword}): {tag.name}")
                tag.decompose()
        
        return soup
    
    def _extract_main_content(self, soup: BeautifulSoup) -> BeautifulSoup:
        """提取主要內容區塊"""
        # 優先尋找 main, article, 或特定 class
        main_selectors = [
            'main',
            'article',
            '[role="main"]',
            '.main-content',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '#content',
            '#main'
        ]
        
        for selector in main_selectors:
            content = soup.select_one(selector)
            if content and len(content.get_text(strip=True)) > 100:
                if self.config.debug:
                    print(f"      [DEBUG] 使用主內容 selector: {selector}")
                return content
        
        # 如果找不到，使用 body
        body = soup.find('body')
        if self.config.debug:
            print(f"      [DEBUG] 找不到主內容區塊，使用 body")
        return body if body else soup
    
    def _extract_all_images_from_soup(self, soup: BeautifulSoup, base_url: str) -> list[dict]:
        """從完整 soup 中提取所有圖片（清理前）"""
        return self._extract_images_internal(soup, base_url, is_pre_clean=True)
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> list[dict]:
        """提取主要內容圖片"""
        return self._extract_images_internal(soup, base_url, is_pre_clean=False)
    
    def _extract_images_internal(self, soup: BeautifulSoup, base_url: str, is_pre_clean: bool = False) -> list[dict]:
        """內部圖片提取邏輯"""
        images = []
        seen_urls = set()
        
        # 收集所有可能包含圖片的元素
        img_elements = []
        
        # 1. 標準 img 標籤
        img_elements.extend(soup.find_all('img'))
        
        # 2. picture > source 標籤
        for source in soup.find_all('source'):
            img_elements.append(source)
        
        # 3. 帶有 background-image 的元素（常見於 lazy-load）
        for tag in soup.find_all(attrs={'data-bg': True}):
            img_elements.append(tag)
        for tag in soup.find_all(attrs={'data-background': True}):
            img_elements.append(tag)
        
        if self.config.debug and not is_pre_clean:
            print(f"      [DEBUG] 找到 {len(img_elements)} 個潛在圖片元素")
        
        for img in img_elements:
            # [修正] 嘗試更多 lazy-load 屬性
            src = self._get_image_src(img)
            
            if not src:
                if self.config.debug and not is_pre_clean:
                    print(f"      [DEBUG] 跳過無 src 的元素: {img.name}")
                continue
            
            # 轉換為絕對 URL
            abs_url = urljoin(base_url, src)
            
            # 跳過已處理的 URL
            if abs_url in seen_urls:
                continue
            seen_urls.add(abs_url)
            
            # 檢查是否應該排除
            if self._should_exclude_image(abs_url, img):
                continue
            
            if self.config.debug and not is_pre_clean:
                print(f"      [DEBUG] ✅ 保留圖片: {abs_url[:80]}...")
            
            images.append({
                'url': abs_url,
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
                'width': img.get('width'),
                'height': img.get('height')
            })
        
        return images
    
    def _get_image_src(self, img) -> Optional[str]:
        """從元素中提取圖片 URL（支援多種 lazy-load 方案）"""
        # 優先順序：data 屬性通常包含高解析度圖片
        src_attrs = [
            'data-src',
            'data-lazy-src', 
            'data-original',
            'data-lazy',
            'data-full-url',
            'data-image',
            'data-bg',
            'data-background',
            'data-hi-res-src',
            'data-large-file',
            'src',  # 原始 src 放後面，因為可能是 placeholder
        ]
        
        for attr in src_attrs:
            value = img.get(attr)
            if value and not value.startswith('data:') and not 'placeholder' in value.lower():
                return value
        
        # 處理 srcset
        srcset = img.get('srcset') or img.get('data-srcset')
        if srcset:
            # 取最大的那張（通常在最後）
            parts = [p.strip().split()[0] for p in srcset.split(',') if p.strip()]
            if parts:
                return parts[-1]  # 取最後一個（通常最大）
        
        # 最後檢查 src（可能是唯一來源）
        src = img.get('src')
        if src and not src.startswith('data:'):
            return src
        
        return None
    
    def _merge_images(self, main_images: list[dict], all_images: list[dict]) -> list[dict]:
        """合併圖片列表，去重"""
        seen_urls = set()
        merged = []
        
        # 優先加入主內容區塊的圖片
        for img in main_images:
            if img['url'] not in seen_urls:
                seen_urls.add(img['url'])
                merged.append(img)
        
        # 補上可能漏掉的圖片（但要更嚴格過濾）
        for img in all_images:
            if img['url'] not in seen_urls:
                # 只補上看起來像內容圖片的（有 alt 或在特定路徑）
                url_lower = img['url'].lower()
                has_alt = bool(img.get('alt', '').strip())
                looks_like_content = any(kw in url_lower for kw in [
                    '/uploads/', '/images/', '/media/', '/content/',
                    '/wp-content/', '/assets/img', '/photos/', '/gallery/'
                ])
                
                if has_alt or looks_like_content:
                    seen_urls.add(img['url'])
                    merged.append(img)
                    if self.config.debug:
                        print(f"      [DEBUG] 補回圖片: {img['url'][:60]}...")
        
        return merged
    
    def _should_exclude_image(self, url: str, img_tag) -> bool:
        """判斷圖片是否應該排除（更寬鬆的策略）"""
        url_lower = url.lower()
        
        # 跳過 data URI
        if url_lower.startswith('data:'):
            if self.config.debug:
                print(f"      [DEBUG] ⏭️  排除 data URI")
            return True
        
        # 跳過明顯的追蹤像素
        if 'pixel' in url_lower and ('gif' in url_lower or '1x1' in url_lower):
            if self.config.debug:
                print(f"      [DEBUG] ⏭️  排除追蹤像素: {url[:60]}...")
            return True
        
        # 檢查 URL pattern（使用更精確的正則）
        for pattern in self.config.excluded_image_patterns:
            if re.search(pattern, url_lower):
                if self.config.debug:
                    print(f"      [DEBUG] ⏭️  排除（符合 pattern: {pattern}）: {url[:60]}...")
                return True
        
        # 檢查尺寸（只有在明確指定且非常小時才排除）
        width = img_tag.get('width')
        height = img_tag.get('height')
        
        if width and height:
            try:
                w = int(re.sub(r'\D', '', str(width)))
                h = int(re.sub(r'\D', '', str(height)))
                # 只排除非常小的圖片（如 1x1 追蹤像素）
                if w > 0 and h > 0 and w <= 10 and h <= 10:
                    if self.config.debug:
                        print(f"      [DEBUG] ⏭️  排除（尺寸 {w}x{h} 太小）: {url[:60]}...")
                    return True
            except ValueError:
                pass
        
        return False
    
    def _to_markdown(self, soup: BeautifulSoup, base_url: str) -> str:
        """將 HTML 轉換為 Markdown"""
        lines = []
        
        for element in soup.descendants:
            if element.name is None:
                continue
            
            text = element.get_text(strip=True) if hasattr(element, 'get_text') else ''
            
            if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                level = int(element.name[1])
                if text:
                    lines.append(f"\n{'#' * level} {text}\n")
            
            elif element.name == 'p':
                if text and not any(text in line for line in lines[-3:] if lines):
                    lines.append(f"\n{text}\n")
            
            elif element.name == 'li':
                if text and not any(text in line for line in lines[-3:] if lines):
                    lines.append(f"- {text}")
            
            elif element.name == 'img':
                src = self._get_image_src(element)
                alt = element.get('alt', '')
                if src:
                    abs_url = urljoin(base_url, src)
                    lines.append(f"\n![{alt}]({abs_url})\n")
            
            elif element.name == 'a':
                href = element.get('href', '')
                if href and text and not href.startswith('#'):
                    abs_url = urljoin(base_url, href)
                    pass
            
            elif element.name == 'blockquote':
                if text:
                    lines.append(f"\n> {text}\n")
            
            elif element.name == 'pre' or element.name == 'code':
                if text and element.parent.name != 'pre':
                    lines.append(f"`{text}`")
                elif text:
                    lines.append(f"\n```\n{text}\n```\n")
        
        # 清理結果
        markdown = '\n'.join(lines)
        markdown = re.sub(r'\n{3,}', '\n\n', markdown)
        markdown = markdown.strip()
        
        return markdown


# ============================================
# 檔案產生器 (File Generator)
# ============================================

class FileGenerator:
    """負責產生輸出檔案"""
    
    def __init__(self, config: CrawlerConfig):
        self.config = config
    
    def generate_page_yaml(self, url: str, metadata: dict, page_path: Path) -> dict:
        """產生頁面 YAML 設定"""
        parsed = urlparse(url)
        
        return {
            '_generated': {
                'tool': 'website-crawler',
                'version': '1.2.0',
                'crawled_at': format_datetime()
            },
            'seo': {
                'meta_title': metadata.get('title', ''),
                'meta_description': metadata.get('description', ''),
                'meta_keywords': metadata.get('keywords', []),
                'canonical_url': metadata.get('canonical') or url,
                'robots': 'index, follow'
            },
            'url': {
                'original': url,
                'current': url,
                'path': parsed.path or '/',
                'slug': page_path.name or 'index',
                'redirects': []
            },
            'schema': {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                'name': metadata.get('title', ''),
                'description': metadata.get('description', ''),
                'url': url,
                'isPartOf': {
                    '@type': 'WebSite',
                    'name': parsed.netloc,
                    'url': f"{parsed.scheme}://{parsed.netloc}"
                },
                'breadcrumb': self._generate_breadcrumb(url)
            },
            'open_graph': {
                'og_type': 'website',
                'og_title': metadata.get('og_title') or metadata.get('title', ''),
                'og_description': metadata.get('og_description') or metadata.get('description', ''),
                'og_url': url,
                'og_site_name': parsed.netloc,
                'og_locale': 'zh_TW',
                'og_image': metadata.get('og_image', ''),
                'og_image_width': 1200,
                'og_image_height': 630,
                'og_image_alt': ''
            },
            'twitter': {
                'card': 'summary_large_image',
                'title': metadata.get('title', ''),
                'description': metadata.get('description', ''),
                'image': metadata.get('og_image', '')
            },
            'metadata': {
                'page_type': 'general',
                'language': 'zh-TW',
                'last_modified': format_datetime(),
                'crawled_at': format_datetime(),
                'content_status': 'draft'
            }
        }
    
    def _generate_breadcrumb(self, url: str) -> dict:
        """產生麵包屑結構"""
        parsed = urlparse(url)
        path_parts = [p for p in parsed.path.split('/') if p]
        
        items = [{
            '@type': 'ListItem',
            'position': 1,
            'name': '首頁',
            'item': f"{parsed.scheme}://{parsed.netloc}"
        }]
        
        current_path = ''
        for i, part in enumerate(path_parts):
            current_path += f"/{part}"
            items.append({
                '@type': 'ListItem',
                'position': i + 2,
                'name': unquote(part).replace('-', ' ').title(),
                'item': f"{parsed.scheme}://{parsed.netloc}{current_path}"
            })
        
        return {
            '@type': 'BreadcrumbList',
            'itemListElement': items
        }
    
    def generate_image_yaml(self, image_info: dict, local_path: str) -> dict:
        """產生圖片描述 YAML"""
        filename = os.path.basename(local_path)
        name, ext = os.path.splitext(filename)
        
        return {
            '_generated': {
                'tool': 'website-crawler',
                'version': '1.2.0',
                'crawled_at': format_datetime()
            },
            'filename': filename,
            'format': ext.lstrip('.').lower(),
            'description': {
                'alt_text': image_info.get('alt', ''),
                'detailed': '（待 AI 分析產生詳細描述）',
                'text_content': None,
                'main_elements': [],
                'mood': '',
                'suggested_usage': []
            },
            'seo': {
                'suggested_filename': filename,
                'keywords': []
            },
            'source': {
                'original_url': image_info.get('url', ''),
                'original_filename': os.path.basename(urlparse(image_info.get('url', '')).path),
                'page_url': image_info.get('page_url', ''),
                'crawled_at': format_datetime()
            },
            'copyright': {
                'status': 'unknown',
                'attribution': None,
                'license': None
            }
        }
    
    def generate_markdown(self, url: str, metadata: dict, content: str) -> str:
        """產生頁面 Markdown"""
        frontmatter = {
            'source_url': url,
            'crawled_at': format_datetime()
        }
        
        yaml_str = yaml.dump(frontmatter, allow_unicode=True, default_flow_style=False)
        
        title = metadata.get('title', 'Untitled')
        
        return f"""---
{yaml_str.strip()}
---

# {title}

{content}
"""


# ============================================
# 主爬蟲類別 (Main Crawler)
# ============================================

class WebsiteCrawler:
    """網站爬蟲主類別"""
    
    def __init__(self, config: Optional[CrawlerConfig] = None):
        self.config = config or CrawlerConfig()
        self.fetcher = WebFetcher(self.config)
        self.parser = ContentParser(self.config)
        self.generator = FileGenerator(self.config)
        
        self.crawled_urls = set()
        self.failed_urls = []
        self.image_hashes = {}
        self.all_urls = []
        
        self.stats = {
            'pages_found': 0,
            'pages_crawled': 0,
            'pages_failed': 0,
            'images_found': 0,
            'images_downloaded': 0,
            'images_excluded': 0,
            'images_duplicates': 0
        }
    
    def crawl(self, target_url: str) -> dict:
        """執行爬蟲"""
        if not target_url.startswith(('http://', 'https://')):
            target_url = f"https://{target_url}"
        
        parsed = urlparse(target_url)
        domain = parsed.netloc
        
        print(f"\n{'='*60}")
        print(f"🕷️  網站內容爬蟲 v1.2.0")
        print(f"{'='*60}")
        print(f"📍 目標網站: {domain}")
        print(f"📁 輸出目錄: {self.config.output_dir}/{domain}")
        print(f"🔧 執行模式: {self.config.mode}")
        if self.config.debug:
            print(f"🐛 Debug 模式: 開啟")
        print(f"{'='*60}\n")
        
        output_base = Path(self.config.output_dir) / domain
        output_base.mkdir(parents=True, exist_ok=True)
        
        if self.config.mode == 'preview':
            return self._crawl_preview(target_url, domain, output_base)
        elif self.config.mode == 'continue':
            return self._crawl_continue(target_url, domain, output_base)
        else:
            return self._crawl_full(target_url, domain, output_base)
    
    def _crawl_preview(self, target_url: str, domain: str, output_base: Path) -> dict:
        """預覽模式：只爬首頁"""
        parsed = urlparse(target_url)
        
        print("📋 檢查 robots.txt...")
        robots = self.fetcher.fetch_robots_txt(domain)
        if robots:
            robots_path = output_base / 'robots.txt'
            robots_path.write_text(robots, encoding='utf-8')
            print(f"   ✅ 已儲存 robots.txt")
        else:
            print(f"   ⚠️  找不到 robots.txt")
        
        print("\n🔍 取得網站頁面列表...")
        self.all_urls = self._discover_urls(domain, target_url)
        self.stats['pages_found'] = len(self.all_urls)
        print(f"   📄 發現 {len(self.all_urls)} 個頁面")
        
        urls_file = output_base / '_pending_urls.json'
        with open(urls_file, 'w', encoding='utf-8') as f:
            json.dump({
                'target_url': target_url,
                'domain': domain,
                'urls': self.all_urls,
                'crawled': []
            }, f, ensure_ascii=False, indent=2)
        
        print(f"\n{'='*60}")
        print("🏠 預覽模式：爬取首頁...")
        print(f"{'='*60}\n")
        
        homepage_url = f"{parsed.scheme}://{parsed.netloc}"
        self._crawl_page(homepage_url, domain, output_base)
        
        preview_report = self._generate_preview_report(domain, output_base)
        report_path = output_base / '_preview_report.yml'
        with open(report_path, 'w', encoding='utf-8') as f:
            yaml.dump(preview_report, f, allow_unicode=True, default_flow_style=False)
        
        print(f"\n{'='*60}")
        print("👀 首頁預覽完成")
        print(f"{'='*60}")
        print(f"\n📄 預覽檔案位置:")
        print(f"   • Markdown: {output_base}/index.md")
        print(f"   • YAML 設定: {output_base}/index.yml")
        images_dir = output_base / self.config.images_dir_name
        if images_dir.exists():
            img_count = len(list(images_dir.glob('*.*'))) // 2  # 除以2因為有yml
            print(f"   • 圖片: {images_dir}/ ({img_count} 張)")
        
        print(f"\n📊 網站概況:")
        print(f"   • 總共發現 {len(self.all_urls)} 個頁面待爬取")
        print(f"   • 首頁圖片: {self.stats['images_downloaded']} 張下載 / {self.stats['images_excluded']} 張排除")
        
        print(f"\n{'='*60}")
        print("⏸️  請檢查以上預覽結果是否符合預期")
        print(f"{'='*60}")
        print(f"\n若符合預期，執行以下指令繼續爬取全站：")
        print(f"   python crawler.py {target_url} --continue")
        print(f"\n若需要調整，請告知以下資訊：")
        print(f"   • 內容擷取是否正確？")
        print(f"   • 圖片過濾是否正確？")
        print(f"   • Markdown 格式是否正確？")
        print(f"{'='*60}\n")
        
        return preview_report
    
    def _crawl_continue(self, target_url: str, domain: str, output_base: Path) -> dict:
        """繼續模式"""
        urls_file = output_base / '_pending_urls.json'
        if not urls_file.exists():
            print("❌ 找不到之前的爬取狀態，請先執行預覽模式")
            print(f"   python crawler.py {target_url} --preview")
            return {}
        
        with open(urls_file, 'r', encoding='utf-8') as f:
            state = json.load(f)
        
        self.all_urls = state['urls']
        crawled = set(state.get('crawled', []))
        pending_urls = [u for u in self.all_urls if u not in crawled]
        
        self.stats['pages_found'] = len(self.all_urls)
        
        print(f"\n📂 載入之前的爬取狀態")
        print(f"   • 總頁面: {len(self.all_urls)}")
        print(f"   • 已爬取: {len(crawled)}")
        print(f"   • 待爬取: {len(pending_urls)}")
        
        print(f"\n{'='*60}")
        print("🚀 繼續爬取剩餘頁面...")
        print(f"{'='*60}\n")
        
        for i, url in enumerate(pending_urls, 1):
            print(f"[{i}/{len(pending_urls)}] 處理: {url}")
            self._crawl_page(url, domain, output_base)
            
            crawled.add(url)
            state['crawled'] = list(crawled)
            with open(urls_file, 'w', encoding='utf-8') as f:
                json.dump(state, f, ensure_ascii=False, indent=2)
            
            print()
        
        report = self._generate_report(domain)
        report_path = output_base / 'crawl-report.yml'
        with open(report_path, 'w', encoding='utf-8') as f:
            yaml.dump(report, f, allow_unicode=True, default_flow_style=False)
        
        urls_file.unlink(missing_ok=True)
        preview_report = output_base / '_preview_report.yml'
        preview_report.unlink(missing_ok=True)
        
        self._print_final_summary(output_base, report_path)
        
        return report
    
    def _crawl_full(self, target_url: str, domain: str, output_base: Path) -> dict:
        """完整模式"""
        print("📋 檢查 robots.txt...")
        robots = self.fetcher.fetch_robots_txt(domain)
        if robots:
            robots_path = output_base / 'robots.txt'
            robots_path.write_text(robots, encoding='utf-8')
            print(f"   ✅ 已儲存 robots.txt")
            self._parse_robots(robots)
        else:
            print(f"   ⚠️  找不到 robots.txt")
        
        print("\n🔍 取得網站頁面列表...")
        urls = self._discover_urls(domain, target_url)
        self.stats['pages_found'] = len(urls)
        print(f"   📄 發現 {len(urls)} 個頁面")
        
        if not urls:
            print("   ⚠️  找不到任何頁面，嘗試只爬取首頁...")
            urls = [target_url]
        
        print(f"\n{'='*60}")
        print("🚀 開始爬取頁面內容...")
        print(f"{'='*60}\n")
        
        for i, url in enumerate(urls, 1):
            print(f"[{i}/{len(urls)}] 處理: {url}")
            self._crawl_page(url, domain, output_base)
            print()
        
        report = self._generate_report(domain)
        report_path = output_base / 'crawl-report.yml'
        with open(report_path, 'w', encoding='utf-8') as f:
            yaml.dump(report, f, allow_unicode=True, default_flow_style=False)
        
        self._print_final_summary(output_base, report_path)
        
        return report
    
    def _print_final_summary(self, output_base: Path, report_path: Path):
        """輸出最終摘要"""
        print(f"\n{'='*60}")
        print("📊 爬取完成摘要")
        print(f"{'='*60}")
        print(f"   📄 頁面: {self.stats['pages_crawled']}/{self.stats['pages_found']} 成功")
        print(f"   🖼️  圖片: {self.stats['images_downloaded']} 下載 / {self.stats['images_excluded']} 排除 / {self.stats['images_duplicates']} 重複")
        print(f"   📁 輸出: {output_base}")
        print(f"   📋 報告: {report_path}")
        print(f"{'='*60}\n")
    
    def _generate_preview_report(self, domain: str, output_base: Path) -> dict:
        """產生預覽報告"""
        return {
            'preview_report': {
                'status': 'pending_confirmation',
                'target_domain': domain,
                'preview_completed': format_datetime(),
                'homepage': {
                    'url': f"https://{domain}",
                    'markdown_file': str(output_base / 'index.md'),
                    'yaml_file': str(output_base / 'index.yml'),
                    'images_downloaded': self.stats['images_downloaded'],
                    'images_excluded': self.stats['images_excluded']
                },
                'site_overview': {
                    'total_pages_found': len(self.all_urls),
                    'pages_to_crawl': len(self.all_urls) - 1
                },
                'next_steps': {
                    'if_satisfied': f"python crawler.py https://{domain} --continue",
                    'if_not_satisfied': "請告知需要調整的地方"
                }
            }
        }
    
    def _parse_robots(self, robots_txt: str):
        """解析 robots.txt"""
        disallowed = []
        for line in robots_txt.split('\n'):
            line = line.strip().lower()
            if line.startswith('disallow:'):
                path = line.replace('disallow:', '').strip()
                if path:
                    disallowed.append(path)
        
        if disallowed:
            print(f"   ℹ️  發現 {len(disallowed)} 個禁止路徑")
    
    def _discover_urls(self, domain: str, start_url: str) -> list[str]:
        """發現網站所有 URL"""
        urls = set()

        print("   嘗試 sitemap.xml...")
        sitemap_urls = self.fetcher.fetch_sitemap(domain)
        if sitemap_urls:
            print(f"   ✅ 從 sitemap 取得 {len(sitemap_urls)} 個 URL")
            # 正規化 sitemap URLs
            urls.update(normalize_url(u) for u in sitemap_urls)

        print("   掃描首頁連結...")
        html = self.fetcher.fetch(start_url)
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a['href']
                abs_url = urljoin(start_url, href)
                parsed = urlparse(abs_url)

                if parsed.netloc == domain:
                    # 正規化 URL（移除結尾斜線）
                    clean_url = normalize_url(f"{parsed.scheme}://{parsed.netloc}{parsed.path}")
                    urls.add(clean_url)

        # 正規化 start_url
        urls.add(normalize_url(start_url))

        # 過濾排除路徑
        if self.config.excluded_paths:
            filtered_urls = set()
            for url in urls:
                path = urlparse(url).path.strip('/')
                # 檢查是否匹配任何排除路徑
                excluded = False
                for excluded_path in self.config.excluded_paths:
                    if path == excluded_path or path.startswith(f"{excluded_path}/"):
                        excluded = True
                        break
                if not excluded:
                    filtered_urls.add(url)

            excluded_count = len(urls) - len(filtered_urls)
            if excluded_count > 0:
                print(f"   ⏭️  過濾 {excluded_count} 個排除路徑")
            urls = filtered_urls

        urls = sorted(list(urls))

        return urls

    def _crawl_page(self, url: str, domain: str, output_base: Path):
        """爬取單一頁面"""
        # 正規化 URL 以避免重複爬取
        url = normalize_url(url)

        if url in self.crawled_urls:
            print("   ⏭️  已處理過，跳過")
            return

        self.crawled_urls.add(url)
        
        html = self.fetcher.fetch(url)
        if not html:
            print("   ❌ 無法取得頁面內容")
            self.failed_urls.append({'url': url, 'error': 'Fetch failed'})
            self.stats['pages_failed'] += 1
            return
        
        try:
            parsed = self.parser.parse(html, url)
        except Exception as e:
            print(f"   ❌ 解析失敗: {e}")
            self.failed_urls.append({'url': url, 'error': str(e)})
            self.stats['pages_failed'] += 1
            return
        
        parsed_url = urlparse(url)
        url_path = parsed_url.path.strip('/')
        
        if not url_path:
            page_dir = output_base
        else:
            url_path = re.sub(r'\.(html?|php|aspx?)$', '', url_path, flags=re.IGNORECASE)
            page_dir = output_base / url_path
        
        page_dir.mkdir(parents=True, exist_ok=True)

        images_dir = page_dir / self.config.images_dir_name
        downloaded_images = []
        
        print(f"   🔍 發現 {len(parsed['images'])} 張圖片")
        
        if parsed['images']:
            images_dir.mkdir(exist_ok=True)
            self.stats['images_found'] += len(parsed['images'])
            
            for img in parsed['images']:
                result = self._download_image(img, images_dir, url)
                if result:
                    downloaded_images.append(result)
        else:
            print(f"   ⚠️  沒有找到符合條件的圖片")
        
        markdown = parsed['markdown']
        for img in downloaded_images:
            old_url = img['original_url']
            new_path = f"./{self.config.images_dir_name}/{img['filename']}"
            markdown = markdown.replace(old_url, new_path)
        
        md_content = self.generator.generate_markdown(
            url, 
            parsed['metadata'], 
            markdown
        )
        md_path = page_dir / 'index.md'
        md_path.write_text(md_content, encoding='utf-8')
        print(f"   📝 已產生: {md_path.relative_to(output_base)}" if page_dir != output_base else f"   📝 已產生: index.md")
        
        yaml_content = self.generator.generate_page_yaml(
            url,
            parsed['metadata'],
            page_dir.relative_to(output_base) if page_dir != output_base else Path('.')
        )
        yml_path = page_dir / 'index.yml'
        with open(yml_path, 'w', encoding='utf-8') as f:
            yaml.dump(yaml_content, f, allow_unicode=True, default_flow_style=False)
        print(f"   📋 已產生: {yml_path.relative_to(output_base)}" if page_dir != output_base else f"   📋 已產生: index.yml")
        
        self.stats['pages_crawled'] += 1
    
    def _download_image(self, image_info: dict, images_dir: Path, page_url: str) -> Optional[dict]:
        """下載單張圖片"""
        url = image_info['url']
        
        content = self.fetcher.fetch(url, binary=True)
        if not content:
            print(f"   ⚠️  無法下載圖片: {url[:60]}...")
            return None
        
        img_hash = get_file_hash(content)
        if img_hash in self.image_hashes:
            print(f"   🔄 重複圖片，跳過: {url[:60]}...")
            self.stats['images_duplicates'] += 1
            return None
        
        parsed_url = urlparse(url)
        original_name = os.path.basename(parsed_url.path)
        if not original_name or '.' not in original_name:
            ext = mimetypes.guess_extension('image/jpeg') or '.jpg'
            original_name = f"image-{img_hash[:8]}{ext}"
        
        filename = sanitize_filename(slugify(os.path.splitext(original_name)[0]) + os.path.splitext(original_name)[1])
        
        filepath = images_dir / filename
        counter = 1
        while filepath.exists():
            name, ext = os.path.splitext(filename)
            filepath = images_dir / f"{name}-{counter}{ext}"
            counter += 1
        
        filepath.write_bytes(content)
        self.image_hashes[img_hash] = str(filepath)
        
        image_info['page_url'] = page_url
        img_yaml = self.generator.generate_image_yaml(image_info, str(filepath))
        yaml_path = filepath.with_suffix('.yml')
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(img_yaml, f, allow_unicode=True, default_flow_style=False)
        
        print(f"   🖼️  已下載: {filepath.name}")
        self.stats['images_downloaded'] += 1
        
        return {
            'original_url': url,
            'filename': filepath.name,
            'local_path': str(filepath)
        }
    
    def _generate_report(self, domain: str) -> dict:
        """產生爬取報告"""
        return {
            'crawl_report': {
                'target_domain': domain,
                'crawl_completed': format_datetime(),
                'pages': {
                    'total_found': self.stats['pages_found'],
                    'successfully_crawled': self.stats['pages_crawled'],
                    'failed': self.stats['pages_failed'],
                    'failed_urls': self.failed_urls
                },
                'images': {
                    'total_found': self.stats['images_found'],
                    'downloaded': self.stats['images_downloaded'],
                    'excluded': self.stats['images_excluded'],
                    'duplicates': self.stats['images_duplicates']
                },
                'files_generated': {
                    'markdown_files': self.stats['pages_crawled'],
                    'yaml_config_files': self.stats['pages_crawled'],
                    'image_description_files': self.stats['images_downloaded']
                }
            }
        }


# ============================================
# CLI 介面
# ============================================

def main():
    parser = argparse.ArgumentParser(
        description='網站內容爬蟲與備份工具 v1.2.0',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
執行模式:
  預設模式    只爬首頁，產生預覽供確認（安全模式）
  --preview   同上，明確指定預覽模式
  --continue  確認預覽無誤後，繼續爬取全站
  --full      跳過確認，直接一次爬完（慎用）
  --debug     顯示詳細的圖片擷取過程（診斷用）

範例:
  python crawler.py https://example.com              # 預覽模式
  python crawler.py https://example.com --debug      # 預覽 + debug 訊息
  python crawler.py https://example.com --continue   # 繼續爬取全站
  python crawler.py https://example.com --full       # 直接爬全站
        """
    )
    
    parser.add_argument(
        'url',
        nargs='?',
        help='目標網站網址'
    )
    
    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument(
        '--preview',
        action='store_true',
        help='預覽模式：只爬首頁供確認（預設模式）'
    )
    mode_group.add_argument(
        '--continue',
        dest='continue_crawl',
        action='store_true',
        help='繼續模式：爬取剩餘頁面'
    )
    mode_group.add_argument(
        '--full',
        action='store_true',
        help='完整模式：直接一次爬完'
    )
    
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Debug 模式：顯示詳細的圖片擷取過程'
    )
    
    parser.add_argument(
        '-o', '--output',
        default='../../../',  # 修正：輸出到專案根目錄
        help='輸出目錄 (預設: ../../../ 專案根目錄)'
    )
    
    parser.add_argument(
        '-d', '--delay',
        type=float,
        default=2.0,
        help='請求間隔秒數 (預設: 2.0)'
    )
    
    parser.add_argument(
        '-t', '--timeout',
        type=int,
        default=30,
        help='請求超時秒數 (預設: 30)'
    )
    
    parser.add_argument(
        '-r', '--retries',
        type=int,
        default=3,
        help='最大重試次數 (預設: 3)'
    )
    
    parser.add_argument(
        '--min-image-size',
        type=int,
        default=50,
        help='最小圖片尺寸 px (預設: 50)'
    )

    parser.add_argument(
        '--exclude',
        type=str,
        default='',
        help='排除的路徑（逗號分隔），例如: elementor-hf,category,hello-world'
    )

    parser.add_argument(
        '--format',
        type=str,
        choices=['default', 'pages'],
        default='default',
        help='輸出格式：default (images/) 或 pages (assets/)'
    )

    args = parser.parse_args()
    
    if args.continue_crawl:
        mode = 'continue'
    elif args.full:
        mode = 'full'
    else:
        mode = 'preview'
        if not args.preview and not args.continue_crawl and not args.full:
            print("\n⚠️  未指定執行模式，使用預設的 preview 模式")
            print("   → 只會爬取首頁供您確認")
            print("   → 確認無誤後，請執行: --continue\n")
    
    target_url = args.url
    if not target_url:
        print("\n🕷️  網站內容爬蟲與備份工具")
        print("=" * 40)
        target_url = input("\n請輸入要爬取的網站網址: ").strip()
        
        if not target_url:
            print("❌ 未提供網址，結束程式")
            sys.exit(1)
    
    # 解析排除路徑
    excluded_paths = [p.strip() for p in args.exclude.split(',') if p.strip()]

    # 設定圖片目錄名稱
    images_dir_name = 'assets' if args.format == 'pages' else 'images'

    config = CrawlerConfig(
        mode=mode,
        debug=args.debug,
        output_dir=args.output,
        crawl_delay=args.delay,
        timeout=args.timeout,
        max_retries=args.retries,
        min_image_size=args.min_image_size,
        excluded_paths=excluded_paths,
        images_dir_name=images_dir_name
    )
    
    crawler = WebsiteCrawler(config)
    
    try:
        crawler.crawl(target_url)
    except KeyboardInterrupt:
        print("\n\n⚠️  使用者中斷執行")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ 執行錯誤: {e}")
        if args.debug:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()