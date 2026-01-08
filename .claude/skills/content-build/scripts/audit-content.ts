#!/usr/bin/env npx tsx
/**
 * audit-content.ts
 * 
 * 檢查 markdown 檔案是否違規直接引用原始（未正規化）assets 檔名
 * 
 * Usage: npx tsx scripts/audit-content.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// ============================================================================
// Types
// ============================================================================

interface Violation {
  file: string
  line: number
  column: number
  rule: string
  message: string
  suggestion: string
}

interface AuditResult {
  passed: boolean
  violations: Violation[]
  filesChecked: number
}

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  modulesDir: 'pages',  // 改為 pages 以符合專案結構
  manifestPath: 'dist/asset-manifest.json',
}

// ============================================================================
// Rules
// ============================================================================

/**
 * Rule: no-raw-asset-ref
 * 禁止在 markdown 中直接引用 assets/ 目錄下的原始檔案
 */
function checkNoRawAssetRef(content: string, filePath: string): Violation[] {
  const violations: Violation[] = []
  const lines = content.split('\n')
  
  // Pattern: ![...](assets/...) or ![...](./assets/...)
  const imagePattern = /!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g
  
  // Pattern: <img src="assets/..." or <img src="./assets/..."
  const htmlImgPattern = /<img[^>]+src=["'](?:\.\/)?assets\/([^"']+)["']/g
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1
    
    // Check markdown image syntax
    let match
    const mdPattern = /!\[([^\]]*)\]\((?:\.\/)?assets\/([^)]+)\)/g
    while ((match = mdPattern.exec(line)) !== null) {
      const assetPath = match[2]
      const column = match.index + 1
      
      // Check if filename contains non-ASCII or is not normalized
      if (!isNormalizedFilename(assetPath)) {
        violations.push({
          file: filePath,
          line: lineNum,
          column,
          rule: 'no-raw-asset-ref',
          message: `禁止直接引用原始 assets/${assetPath}`,
          suggestion: '移至 index.yml 使用 layout.hero.image.id 或其他 image_id 欄位',
        })
      }
    }
    
    // Check HTML img syntax
    const htmlPattern = /<img[^>]+src=["'](?:\.\/)?assets\/([^"']+)["']/g
    while ((match = htmlPattern.exec(line)) !== null) {
      const assetPath = match[1]
      const column = match.index + 1
      
      if (!isNormalizedFilename(assetPath)) {
        violations.push({
          file: filePath,
          line: lineNum,
          column,
          rule: 'no-raw-asset-ref',
          message: `禁止直接引用原始 assets/${assetPath}`,
          suggestion: '移至 index.yml 使用 layout 配置',
        })
      }
    }
  }
  
  return violations
}

/**
 * 檢查檔名是否為正規化格式（ASCII 全小寫 + hash）
 */
function isNormalizedFilename(filename: string): boolean {
  // Normalized pattern: {name}_{hash}.{ext} where name and hash are ASCII lowercase
  const normalizedPattern = /^[a-z0-9_-]+_[a-f0-9]{6,}\.(?:jpg|jpeg|png|gif|webp|svg)$/i
  
  // Also allow already-normalized paths from dist/assets
  if (filename.startsWith('dist/assets/')) {
    return true
  }
  
  // Check if filename is ASCII lowercase
  const basename = path.basename(filename)
  return normalizedPattern.test(basename.toLowerCase()) && /^[a-z0-9_.-]+$/.test(basename)
}

// ============================================================================
// Main Logic
// ============================================================================

function discoverMarkdownFiles(): string[] {
  const files: string[] = []
  
  if (!fs.existsSync(CONFIG.modulesDir)) {
    console.error(`❌ Modules directory not found: ${CONFIG.modulesDir}`)
    process.exit(1)
  }
  
  const modules = fs.readdirSync(CONFIG.modulesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
  
  for (const mod of modules) {
    const mdPath = path.join(CONFIG.modulesDir, mod.name, 'index.md')
    if (fs.existsSync(mdPath)) {
      files.push(mdPath)
    }
  }
  
  return files
}

function auditFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  return checkNoRawAssetRef(content, filePath)
}

function formatViolation(v: Violation): string {
  return [
    `❌ ${v.file}:${v.line}:${v.column} - ${v.message}`,
    `   規則: ${v.rule}`,
    `   建議: ${v.suggestion}`,
  ].join('\n')
}

function main() {
  console.log('🔍 Starting content audit...\n')
  
  const files = discoverMarkdownFiles()
  console.log(`📄 Found ${files.length} markdown files to check\n`)
  
  const allViolations: Violation[] = []
  
  for (const file of files) {
    const violations = auditFile(file)
    allViolations.push(...violations)
  }
  
  // Report results
  if (allViolations.length === 0) {
    console.log(`✅ All ${files.length} modules passed audit\n`)
    console.log('No raw asset references found in markdown files.')
    process.exit(0)
  } else {
    console.log(`Found ${allViolations.length} violation(s):\n`)
    
    for (const v of allViolations) {
      console.log(formatViolation(v))
      console.log()
    }
    
    console.log(`\n❌ Audit failed with ${allViolations.length} violation(s)`)
    console.log('\nTo fix:')
    console.log('1. Remove image references from index.md')
    console.log('2. Add image_id to index.yml layout configuration')
    console.log('3. Create *.yml for each asset with proper id')
    
    process.exit(1)
  }
}

main()
