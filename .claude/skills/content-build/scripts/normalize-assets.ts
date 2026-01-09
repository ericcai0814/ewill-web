#!/usr/bin/env npx tsx
/**
 * normalize-assets.ts
 * 
 * 將非 ASCII 圖片檔名正規化為 ASCII 全小寫，並產出 asset-manifest.json
 * 支援 Next.js、Nuxt、Static 三種框架
 * 
 * Usage: 
 *   npx tsx scripts/normalize-assets.ts
 *   npx tsx scripts/normalize-assets.ts --framework=next
 */

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { parse as parseYaml } from 'yaml'
import { BuildConfig, detectTarget, getConfig, parseArgs, printHelp } from './config'

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
  target: string
  assets: AssetEntry[]
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_CONFIG = {
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
    .substring(0, DEFAULT_CONFIG.hashLength)
}

function isAsciiLowercase(str: string): boolean {
  return /^[a-z0-9_.-]+$/.test(str)
}

function sanitizeToAscii(str: string): string {
  const ext = path.extname(str).toLowerCase()
  const basename = path.basename(str, path.extname(str))
  
  if (isAsciiLowercase(basename)) {
    return basename.toLowerCase() + ext
  }
  
  return ''
}

function loadMetaYml(assetPath: string): AssetMeta | null {
  const ymlPath = assetPath + '.yml'
  
  if (!fs.existsSync(ymlPath)) {
    return null
  }
  
  try {
    const content = fs.readFileSync(ymlPath, 'utf-8')
    return parseYaml(content) as AssetMeta
  } catch (e) {
    console.warn(`⚠️  Failed to parse ${ymlPath}:`, e)
    return null
  }
}

// ============================================================================
// Main Logic
// ============================================================================

function discoverAssets(config: BuildConfig): string[] {
  const assets: string[] = []
  
  if (!fs.existsSync(config.contentDir)) {
    console.error(`❌ Content directory not found: ${config.contentDir}`)
    process.exit(1)
  }
  
  const modules = fs.readdirSync(config.contentDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
  
  for (const mod of modules) {
    const assetsDir = path.join(config.contentDir, mod.name, 'assets')
    if (!fs.existsSync(assetsDir)) continue
    
    const files = fs.readdirSync(assetsDir)
    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (DEFAULT_CONFIG.imageExtensions.includes(ext) && !file.endsWith('.yml')) {
        assets.push(path.join(assetsDir, file))
      }
    }
  }
  
  return assets
}

function toWebPath(absPath: string, webRoot: string): string {
  const relativePath = path.relative(webRoot, absPath);
  return '/' + relativePath.split(path.sep).join('/');
}

function normalizeAsset(
  assetPath: string, 
  existingIds: Set<string>,
  config: BuildConfig
): AssetEntry {
  const content = fs.readFileSync(assetPath)
  const hash = generateShortHash(content)
  const ext = path.extname(assetPath).toLowerCase()
  const basename = path.basename(assetPath, path.extname(assetPath))
  const dir = path.dirname(assetPath)
  
  const distAssetsDir = path.join(config.outputDir, config.assetsDir)
  
  // Try to load .yml metadata
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
  
  const normalizedPath = path.join(distAssetsDir, normalizedName)
  
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
  fs.mkdirSync(distAssetsDir, { recursive: true })
  fs.copyFileSync(assetPath, normalizedPath)
  fs.copyFileSync(desktopSource, desktopPath)
  fs.copyFileSync(mobileSource, mobilePath)
  
  return {
    id: uniqueId,
    original_path: assetPath,
    normalized_path: toWebPath(normalizedPath, config.outputDir),
    variants: {
      desktop: toWebPath(desktopPath, config.outputDir),
      mobile: toWebPath(mobilePath, config.outputDir),
    },
    alt: meta?.alt || '',
  }
}

export async function normalizeAssets(config: BuildConfig): Promise<AssetManifest> {
  console.log(`🔄 Starting asset normalization for ${config.target}...\n`)
  console.log(`   Content dir: ${config.contentDir}`)
  console.log(`   Output dir:  ${config.outputDir}\n`)
  
  const assets = discoverAssets(config)
  console.log(`📦 Found ${assets.length} assets to process\n`)
  
  const existingIds = new Set<string>()
  const entries: AssetEntry[] = []
  
  for (const assetPath of assets) {
    try {
      const entry = normalizeAsset(assetPath, existingIds, config)
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
    target: config.target,
    assets: entries,
  }
  
  const manifestPath = path.join(config.outputDir, 'asset-manifest.json')
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  
  console.log(`\n📋 Manifest written to ${manifestPath}`)
  console.log(`✅ Normalized ${entries.length} assets`)
  
  return manifest
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  const args = parseArgs(process.argv.slice(2))
  
  if (args.help) {
    printHelp()
    process.exit(0)
  }
  
  const target = args.target || detectTarget() || 'static'
  const config = getConfig(target)
  
  await normalizeAssets(config)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
