#!/usr/bin/env npx tsx
/**
 * normalize-assets.ts
 * 
 * 將非 ASCII 圖片檔名正規化為 ASCII 全小寫，並產出 asset-manifest.json
 * 
 * Usage: npx tsx scripts/normalize-assets.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { parse as parseYaml } from 'yaml'

// ============================================================================
// Types
// ============================================================================

interface AssetMeta {
  id: string
  alt?: string
  variants?: {
    desktop?: string
    mobile?: string
  }
}

interface AssetEntry {
  id: string
  original_path: string
  normalized_path: string
  variants: {
    desktop: string
    mobile: string
  }
  alt: string
}

interface AssetManifest {
  generated_at: string
  assets: AssetEntry[]
}

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  modulesDir: 'pages',  // 改為 pages 以符合專案結構
  distAssetsDir: 'dist/assets',
  manifestPath: 'dist/asset-manifest.json',
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  hashLength: 8,
}

// ============================================================================
// Utilities
// ============================================================================

function generateShortHash(content: Buffer): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, CONFIG.hashLength)
}

function isAsciiLowercase(str: string): boolean {
  return /^[a-z0-9_.-]+$/.test(str)
}

function sanitizeToAscii(str: string): string {
  // Remove extension first
  const ext = path.extname(str).toLowerCase()
  const basename = path.basename(str, path.extname(str))
  
  // If already ASCII lowercase, keep it
  if (isAsciiLowercase(basename)) {
    return basename.toLowerCase() + ext
  }
  
  // Otherwise return empty to trigger hash-based naming
  return ''
}

function loadMetaYml(assetPath: string): AssetMeta | null {
  const metaPath = assetPath + '.meta.yml'
  if (!fs.existsSync(metaPath)) {
    return null
  }
  
  try {
    const content = fs.readFileSync(metaPath, 'utf-8')
    return parseYaml(content) as AssetMeta
  } catch (e) {
    console.warn(`⚠️  Failed to parse ${metaPath}:`, e)
    return null
  }
}

function findVariantFile(baseDir: string, baseName: string, variantSuffix: string): string | null {
  const files = fs.readdirSync(baseDir)
  
  // Look for files matching pattern: {baseName}_{suffix}.{ext} or {baseName}_{dimensions}.{ext}
  for (const file of files) {
    const fileLower = file.toLowerCase()
    const baseNameLower = baseName.toLowerCase()
    
    // Match patterns like: hero_1920x600.jpg, hero_desktop.jpg
    if (fileLower.includes(baseNameLower) && 
        (fileLower.includes(variantSuffix) || 
         fileLower.includes('1920') || 
         fileLower.includes('750'))) {
      return path.join(baseDir, file)
    }
  }
  
  return null
}

// ============================================================================
// Main Logic
// ============================================================================

function discoverAssets(): string[] {
  const assets: string[] = []
  
  if (!fs.existsSync(CONFIG.modulesDir)) {
    console.error(`❌ Modules directory not found: ${CONFIG.modulesDir}`)
    process.exit(1)
  }
  
  const modules = fs.readdirSync(CONFIG.modulesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
  
  for (const mod of modules) {
    const assetsDir = path.join(CONFIG.modulesDir, mod.name, 'assets')
    if (!fs.existsSync(assetsDir)) continue
    
    const files = fs.readdirSync(assetsDir)
    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (CONFIG.imageExtensions.includes(ext) && !file.endsWith('.meta.yml')) {
        assets.push(path.join(assetsDir, file))
      }
    }
  }
  
  return assets
}

function normalizeAsset(assetPath: string, existingIds: Set<string>): AssetEntry {
  const content = fs.readFileSync(assetPath)
  const hash = generateShortHash(content)
  const ext = path.extname(assetPath).toLowerCase()
  const basename = path.basename(assetPath, path.extname(assetPath))
  const dir = path.dirname(assetPath)
  
  // Try to load meta.yml
  const meta = loadMetaYml(assetPath)
  
  // Determine ID and normalized filename
  let id: string
  let normalizedName: string
  
  if (meta?.id) {
    id = meta.id
    normalizedName = `${meta.id}_${hash}${ext}`
  } else {
    const sanitized = sanitizeToAscii(basename)
    if (sanitized) {
      id = sanitized.replace(ext, '')
      normalizedName = `${id}_${hash}${ext}`
    } else {
      id = `img_${hash}`
      normalizedName = `img_${hash}${ext}`
    }
  }
  
  // Ensure unique ID
  let uniqueId = id
  let counter = 1
  while (existingIds.has(uniqueId)) {
    uniqueId = `${id}_${counter}`
    counter++
  }
  existingIds.add(uniqueId)
  
  const normalizedPath = path.join(CONFIG.distAssetsDir, normalizedName)
  
  // Handle variants
  let desktopPath = normalizedPath.replace(ext, `_desktop${ext}`)
  let mobilePath = normalizedPath.replace(ext, `_mobile${ext}`)
  
  // Check if variant files exist from meta or auto-detect
  let desktopSource = assetPath
  let mobileSource = assetPath
  
  if (meta?.variants?.desktop) {
    const variantPath = path.join(dir, meta.variants.desktop)
    if (fs.existsSync(variantPath)) {
      desktopSource = variantPath
    }
  }
  
  if (meta?.variants?.mobile) {
    const variantPath = path.join(dir, meta.variants.mobile)
    if (fs.existsSync(variantPath)) {
      mobileSource = variantPath
    }
  }
  
  // Copy files
  fs.mkdirSync(CONFIG.distAssetsDir, { recursive: true })
  fs.copyFileSync(assetPath, normalizedPath)
  fs.copyFileSync(desktopSource, desktopPath)
  fs.copyFileSync(mobileSource, mobilePath)
  
  return {
    id: uniqueId,
    original_path: assetPath,
    normalized_path: normalizedPath,
    variants: {
      desktop: desktopPath,
      mobile: mobilePath,
    },
    alt: meta?.alt || '',
  }
}

function main() {
  console.log('🔄 Starting asset normalization...\n')
  
  const assets = discoverAssets()
  console.log(`📦 Found ${assets.length} assets to process\n`)
  
  const existingIds = new Set<string>()
  const entries: AssetEntry[] = []
  
  for (const assetPath of assets) {
    try {
      const entry = normalizeAsset(assetPath, existingIds)
      entries.push(entry)
      console.log(`✅ ${assetPath}`)
      console.log(`   → ${entry.normalized_path}`)
      if (entry.alt) {
        console.log(`   alt: "${entry.alt}"`)
      }
      console.log()
    } catch (e) {
      console.error(`❌ Failed to process ${assetPath}:`, e)
    }
  }
  
  // Write manifest
  const manifest: AssetManifest = {
    generated_at: new Date().toISOString(),
    assets: entries,
  }
  
  fs.mkdirSync(path.dirname(CONFIG.manifestPath), { recursive: true })
  fs.writeFileSync(CONFIG.manifestPath, JSON.stringify(manifest, null, 2))
  
  console.log(`\n📋 Manifest written to ${CONFIG.manifestPath}`)
  console.log(`✅ Normalized ${entries.length} assets`)
}

main()
