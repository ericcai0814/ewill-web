/**
 * sync-content.ts
 *
 * 將 index.md 內容同步至 index.yml 的 layout.sections
 *
 * 使用方式：
 *   npx tsx sync-content.ts              # 同步所有頁面
 *   npx tsx sync-content.ts --page=about_us  # 同步特定頁面
 *   npx tsx sync-content.ts --check      # 檢查模式（不修改，僅報告差異）
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

// 專案根目錄
const ROOT_DIR = process.cwd()
const PAGES_DIR = join(ROOT_DIR, 'pages')

// Section 類型定義
interface TextSection {
  type: 'text'
  label?: string
  title?: string
  content: string
}

interface ImageSection {
  type: 'image'
  image_id: string
}

type Section = TextSection | ImageSection

// 解析命令列參數
function parseArgs(): { page?: string; check?: boolean; help?: boolean } {
  const args = process.argv.slice(2)
  const result: { page?: string; check?: boolean; help?: boolean } = {}

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      result.help = true
    } else if (arg === '--check') {
      result.check = true
    } else if (arg.startsWith('--page=')) {
      result.page = arg.split('=')[1]
    }
  }

  return result
}

// 顯示使用說明
function printHelp(): void {
  console.log(`
Sync Content - 將 index.md 同步至 index.yml

Usage:
  npx tsx sync-content.ts [options]

Options:
  --page=<name>  同步特定頁面（例如 --page=about_us）
  --check        檢查模式：不修改檔案，僅報告是否需要同步
  --help, -h     顯示此說明

Examples:
  npx tsx sync-content.ts                 # 同步所有頁面
  npx tsx sync-content.ts --page=logsec   # 只同步 logsec 頁面
  npx tsx sync-content.ts --check         # CI 用：檢查是否同步
`)
}

// 從圖片路徑取得 image_id
function getImageId(pagePath: string, imagePath: string): string | null {
  // 處理相對路徑：./assets/xxx.jpg, ./images/xxx.jpg, assets/xxx.jpg, images/xxx.jpg
  let normalizedPath = imagePath
    .replace(/^\.\//, '')
    .replace(/^assets\//, '')
    .replace(/^images\//, '')  // 爬蟲可能使用 images/ 目錄

  // 嘗試多種可能的檔名格式
  const possiblePaths = [
    join(pagePath, 'assets', `${normalizedPath}.yml`),
    join(pagePath, 'assets', normalizedPath.replace(/\.[^.]+$/, '') + '.yml'),
  ]

  for (const ymlPath of possiblePaths) {
    if (existsSync(ymlPath)) {
      try {
        const ymlContent = readFileSync(ymlPath, 'utf-8')
        const data = yaml.load(ymlContent) as { id?: string }
        if (data?.id) {
          return data.id
        }
      } catch {
        // 繼續嘗試下一個
      }
    }
  }

  // 如果找不到 yml，使用檔名作為 fallback id
  const fallbackId = normalizedPath
    .replace(/\.[^.]+$/, '')  // 移除副檔名
    .replace(/[^a-zA-Z0-9_]/g, '_')  // 特殊字元轉底線
    .toLowerCase()

  console.warn(`  ⚠️  找不到圖片描述檔，使用 fallback id: ${fallbackId}`)
  return fallbackId
}

// 解析 Markdown 內容為 sections
function parseMarkdownToSections(mdContent: string, pagePath: string): Section[] {
  const sections: Section[] = []
  const lines = mdContent.split('\n')

  let currentLabel: string | undefined
  let currentTitle: string | undefined
  let currentContent: string[] = []

  const flushTextSection = () => {
    const content = currentContent.join('\n').trim()
    if (currentTitle || content) {
      const section: TextSection = {
        type: 'text',
        content: content || ''
      }
      if (currentLabel) section.label = currentLabel
      if (currentTitle) section.title = currentTitle
      sections.push(section)
    }
    currentLabel = undefined
    currentTitle = undefined
    currentContent = []
  }

  for (const line of lines) {
    // 跳過 deprecated 標記
    if (line.includes('deprecated') || line.includes('This file is deprecated')) {
      continue
    }

    // 圖片引用 ![...](...)
    const imageMatch = line.match(/!\[.*?\]\(([^)]+)\)/)
    if (imageMatch) {
      flushTextSection()
      const imagePath = imageMatch[1]
      const imageId = getImageId(pagePath, imagePath)
      if (imageId) {
        sections.push({
          type: 'image',
          image_id: imageId
        })
      }
      continue
    }

    // ##### 英文標籤
    if (line.startsWith('#####') && !line.startsWith('######')) {
      if (currentTitle || currentContent.length > 0) {
        flushTextSection()
      }
      currentLabel = line.replace(/^#+\s*/, '').trim()
      continue
    }

    // ## 主標題（但不是 ### 或更多）
    if (line.match(/^##\s/) && !line.startsWith('###')) {
      if (currentTitle) {
        flushTextSection()
      }
      currentTitle = line.replace(/^##\s*/, '').trim()
      continue
    }

    // ### 或 #### 副標題（包含在 content 中）
    if (line.startsWith('###')) {
      currentContent.push(line)
      continue
    }

    // 一般內容（保留空行結構）
    currentContent.push(line)
  }

  // 處理最後一個區塊
  flushTextSection()

  // 清理：移除開頭的空 content sections
  while (sections.length > 0 &&
         sections[0].type === 'text' &&
         !sections[0].title &&
         !sections[0].content.trim()) {
    sections.shift()
  }

  return sections
}

// 比較兩個 sections 是否相等
function sectionsEqual(a: Section[], b: Section[]): boolean {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i].type !== b[i].type) return false

    if (a[i].type === 'text' && b[i].type === 'text') {
      const ta = a[i] as TextSection
      const tb = b[i] as TextSection
      if (ta.label !== tb.label || ta.title !== tb.title || ta.content !== tb.content) {
        return false
      }
    } else if (a[i].type === 'image' && b[i].type === 'image') {
      const ia = a[i] as ImageSection
      const ib = b[i] as ImageSection
      if (ia.image_id !== ib.image_id) return false
    }
  }

  return true
}

// 讀取現有 yml 的 sections
function getExistingSections(ymlPath: string): Section[] {
  if (!existsSync(ymlPath)) return []

  try {
    const content = readFileSync(ymlPath, 'utf-8')
    const data = yaml.load(content) as { layout?: { sections?: Section[] } }
    return data?.layout?.sections || []
  } catch {
    return []
  }
}

// 更新 index.yml 的 layout.sections
function updateYmlSections(ymlPath: string, sections: Section[]): boolean {
  if (!existsSync(ymlPath)) {
    console.warn(`  ⚠️  找不到 yml 檔案: ${ymlPath}`)
    return false
  }

  try {
    const ymlContent = readFileSync(ymlPath, 'utf-8')
    const data = yaml.load(ymlContent) as Record<string, unknown>

    // 確保 layout 存在
    if (!data.layout) {
      data.layout = {}
    }

    // 更新 sections
    const layout = data.layout as Record<string, unknown>
    layout.sections = sections

    // 寫回檔案
    const newContent = yaml.dump(data, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false
    })

    writeFileSync(ymlPath, newContent, 'utf-8')
    return true
  } catch (e) {
    console.error(`  ❌ 更新失敗: ${ymlPath}`, e)
    return false
  }
}

// 同步單一頁面
function syncPage(pageName: string, checkOnly: boolean): 'synced' | 'skipped' | 'needs_sync' | 'error' {
  const pagePath = join(PAGES_DIR, pageName)
  const mdPath = join(pagePath, 'index.md')
  const ymlPath = join(pagePath, 'index.yml')

  console.log(`\n📄 ${pageName}`)

  // 檢查檔案是否存在
  if (!existsSync(mdPath)) {
    console.log(`  ⏭️  跳過: 無 index.md`)
    return 'skipped'
  }

  if (!existsSync(ymlPath)) {
    console.log(`  ⏭️  跳過: 無 index.yml`)
    return 'skipped'
  }

  // 讀取 md 內容
  const mdContent = readFileSync(mdPath, 'utf-8')

  // 檢查是否已標記為 deprecated（但仍可能需要處理）
  if (mdContent.trim() === '# This file is deprecated. Content is now managed in index.yml\'s \'sections\' array.') {
    console.log(`  ⏭️  跳過: 空的 deprecated 檔案`)
    return 'skipped'
  }

  // 解析 md 為 sections
  const newSections = parseMarkdownToSections(mdContent, pagePath)

  if (newSections.length === 0) {
    console.log(`  ⚠️  警告: 解析後無內容`)
    return 'skipped'
  }

  // 取得現有 sections
  const existingSections = getExistingSections(ymlPath)

  // 比較是否需要更新
  if (sectionsEqual(newSections, existingSections)) {
    console.log(`  ✓ 已同步（${newSections.length} 個區塊）`)
    return 'skipped'
  }

  console.log(`  📝 ${existingSections.length} → ${newSections.length} 個區塊`)

  if (checkOnly) {
    console.log(`  ⚠️  需要同步`)
    return 'needs_sync'
  }

  // 更新 yml
  if (updateYmlSections(ymlPath, newSections)) {
    console.log(`  ✅ 已更新 index.yml`)
    return 'synced'
  }

  return 'error'
}

// 取得所有頁面目錄
function getAllPages(): string[] {
  if (!existsSync(PAGES_DIR)) {
    return []
  }

  return readdirSync(PAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => !d.name.startsWith('.'))
    .filter(d => d.name !== 'header') // 排除 header（共用元件）
    .map(d => d.name)
    .sort()
}

// 主程式
async function main() {
  const args = parseArgs()

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  console.log('🔄 Sync Content - md → yml')
  console.log('='.repeat(50))

  if (args.check) {
    console.log('📋 檢查模式：不會修改檔案')
  }

  let pages: string[]

  if (args.page) {
    if (!existsSync(join(PAGES_DIR, args.page))) {
      console.error(`❌ 頁面不存在: ${args.page}`)
      process.exit(1)
    }
    pages = [args.page]
  } else {
    pages = getAllPages()
  }

  console.log(`📂 處理 ${pages.length} 個頁面`)

  let syncedCount = 0
  let skippedCount = 0
  let needsSyncCount = 0
  let errorCount = 0

  for (const page of pages) {
    const result = syncPage(page, args.check || false)
    switch (result) {
      case 'synced': syncedCount++; break
      case 'skipped': skippedCount++; break
      case 'needs_sync': needsSyncCount++; break
      case 'error': errorCount++; break
    }
  }

  console.log('\n' + '='.repeat(50))

  if (args.check) {
    if (needsSyncCount > 0) {
      console.log(`❌ ${needsSyncCount} 個頁面需要同步`)
      console.log('   執行 npm run sync-content 來同步')
      process.exit(1)
    } else {
      console.log(`✅ 所有頁面已同步`)
    }
  } else {
    console.log(`✅ 完成: ${syncedCount} 個已同步, ${skippedCount} 個跳過`)
    if (errorCount > 0) {
      console.log(`❌ ${errorCount} 個錯誤`)
      process.exit(1)
    }
  }
}

main().catch(e => {
  console.error('❌ 執行失敗:', e)
  process.exit(1)
})
