#!/usr/bin/env npx tsx
/**
 * build-content.ts
 * 
 * 解析 index.yml，將 image_id 解析為實際路徑，產出 dist/content
 * 
 * Usage: npx tsx scripts/build-content.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { parse as parseYaml } from 'yaml'

// ============================================================================
// Types
// ============================================================================

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

interface ImageRef {
  id: string
  desktop?: string
  mobile?: string
}

interface LayoutConfig {
  hero?: {
    image?: ImageRef
  }
  sections?: Array<{
    type: string
    image_ids?: string[]
    [key: string]: unknown
  }>
  [key: string]: unknown
}

interface PageYml {
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  url_mapping?: {
    current_url?: string
    new_url?: string
  }
  layout?: LayoutConfig
  [key: string]: unknown
}

interface ResolvedImage {
  id: string
  desktop: string
  mobile: string
  alt: string
}

interface PageJson {
  slug: string
  module: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  url_mapping: {
    current_url: string
    new_url: string
  }
  layout: {
    hero?: {
      image?: ResolvedImage
    }
    sections?: Array<{
      type: string
      images?: ResolvedImage[]
      [key: string]: unknown
    }>
    [key: string]: unknown
  }
  content: string
  generated_at: string
}

interface ContentManifest {
  generated_at: string
  pages: Array<{
    slug: string
    module: string
    path: string
  }>
}

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
  modulesDir: 'pages',  // 改為 pages 以符合專案結構
  manifestPath: 'dist/asset-manifest.json',
  contentDir: 'dist/content',
  pagesDir: 'dist/content/pages',
  assetsPublicPath: '/assets',
}

// ============================================================================
// Asset Resolver
// ============================================================================

class AssetResolver {
  private assetMap: Map<string, AssetEntry> = new Map()
  
  constructor(manifestPath: string) {
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Asset manifest not found: ${manifestPath}. Run normalize-assets.ts first.`)
    }
    
    const manifest: AssetManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    
    for (const asset of manifest.assets) {
      this.assetMap.set(asset.id, asset)
    }
  }
  
  resolve(imageRef: ImageRef): ResolvedImage | null {
    const asset = this.assetMap.get(imageRef.id)
    if (!asset) {
      console.warn(`⚠️  Asset not found: ${imageRef.id}`)
      return null
    }
    
    // Use custom variant IDs or default to {id}_desktop/{id}_mobile
    let desktopPath = asset.variants.desktop
    let mobilePath = asset.variants.mobile
    
    // If custom variant IDs specified, try to resolve them
    if (imageRef.desktop && imageRef.desktop !== `${imageRef.id}_desktop`) {
      const desktopAsset = this.assetMap.get(imageRef.desktop)
      if (desktopAsset) {
        desktopPath = desktopAsset.normalized_path
      }
    }
    
    if (imageRef.mobile && imageRef.mobile !== `${imageRef.id}_mobile`) {
      const mobileAsset = this.assetMap.get(imageRef.mobile)
      if (mobileAsset) {
        mobilePath = mobileAsset.normalized_path
      }
    }
    
    // Convert to public paths
    const toPublicPath = (p: string) => {
      const filename = path.basename(p)
      return `${CONFIG.assetsPublicPath}/${filename}`
    }
    
    return {
      id: imageRef.id,
      desktop: toPublicPath(desktopPath),
      mobile: toPublicPath(mobilePath),
      alt: asset.alt,
    }
  }
  
  resolveById(id: string): ResolvedImage | null {
    return this.resolve({ id })
  }
}

// ============================================================================
// Main Logic
// ============================================================================

function discoverModules(): string[] {
  if (!fs.existsSync(CONFIG.modulesDir)) {
    console.error(`❌ Modules directory not found: ${CONFIG.modulesDir}`)
    process.exit(1)
  }
  
  return fs.readdirSync(CONFIG.modulesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function loadModuleYml(moduleName: string): PageYml | null {
  const ymlPath = path.join(CONFIG.modulesDir, moduleName, 'index.yml')
  if (!fs.existsSync(ymlPath)) {
    return null
  }
  
  try {
    const content = fs.readFileSync(ymlPath, 'utf-8')
    return parseYaml(content) as PageYml
  } catch (e) {
    console.warn(`⚠️  Failed to parse ${ymlPath}:`, e)
    return null
  }
}

function loadModuleMd(moduleName: string): string {
  const mdPath = path.join(CONFIG.modulesDir, moduleName, 'index.md')
  if (!fs.existsSync(mdPath)) {
    return ''
  }
  
  return fs.readFileSync(mdPath, 'utf-8')
}

function resolveLayout(layout: LayoutConfig | undefined, resolver: AssetResolver): PageJson['layout'] {
  if (!layout) return {}
  
  const resolved: PageJson['layout'] = {}
  
  // Resolve hero image
  if (layout.hero?.image) {
    const resolvedImage = resolver.resolve(layout.hero.image)
    if (resolvedImage) {
      resolved.hero = { image: resolvedImage }
    }
  }
  
  // Resolve sections
  if (layout.sections) {
    resolved.sections = layout.sections.map(section => {
      const resolvedSection: PageJson['layout']['sections'][0] = {
        type: section.type,
      }
      
      // Resolve image_ids array
      if (section.image_ids) {
        resolvedSection.images = section.image_ids
          .map(id => resolver.resolveById(id))
          .filter((img): img is ResolvedImage => img !== null)
      }
      
      // Copy other properties
      for (const [key, value] of Object.entries(section)) {
        if (key !== 'type' && key !== 'image_ids') {
          resolvedSection[key] = value
        }
      }
      
      return resolvedSection
    })
  }
  
  // Copy other layout properties
  for (const [key, value] of Object.entries(layout)) {
    if (key !== 'hero' && key !== 'sections') {
      resolved[key] = value
    }
  }
  
  return resolved
}

function buildPage(moduleName: string, resolver: AssetResolver): PageJson {
  const yml = loadModuleYml(moduleName) || {}
  const content = loadModuleMd(moduleName)
  
  return {
    slug: moduleName,
    module: moduleName,
    seo: {
      title: yml.seo?.title || '',
      description: yml.seo?.description || '',
      keywords: yml.seo?.keywords || [],
    },
    url_mapping: {
      current_url: yml.url_mapping?.current_url || '',
      new_url: yml.url_mapping?.new_url || '',
    },
    layout: resolveLayout(yml.layout, resolver),
    content,
    generated_at: new Date().toISOString(),
  }
}

function main() {
  console.log('🔄 Starting content build...\n')
  
  // Initialize asset resolver
  let resolver: AssetResolver
  try {
    resolver = new AssetResolver(CONFIG.manifestPath)
  } catch (e) {
    console.error(`❌ ${e.message}`)
    process.exit(1)
  }
  
  const modules = discoverModules()
  console.log(`📦 Found ${modules.length} modules to process\n`)
  
  // Ensure output directories exist
  fs.mkdirSync(CONFIG.pagesDir, { recursive: true })
  
  const manifestEntries: ContentManifest['pages'] = []
  
  for (const moduleName of modules) {
    try {
      const page = buildPage(moduleName, resolver)
      const outputPath = path.join(CONFIG.pagesDir, `${moduleName}.json`)
      
      fs.writeFileSync(outputPath, JSON.stringify(page, null, 2))
      
      manifestEntries.push({
        slug: moduleName,
        module: moduleName,
        path: `pages/${moduleName}.json`,
      })
      
      console.log(`✅ ${moduleName} → ${outputPath}`)
    } catch (e) {
      console.error(`❌ Failed to build ${moduleName}:`, e)
    }
  }
  
  // Write content manifest
  const manifest: ContentManifest = {
    generated_at: new Date().toISOString(),
    pages: manifestEntries,
  }
  
  const manifestOutputPath = path.join(CONFIG.contentDir, 'manifest.json')
  fs.writeFileSync(manifestOutputPath, JSON.stringify(manifest, null, 2))
  
  console.log(`\n📋 Content manifest written to ${manifestOutputPath}`)
  console.log(`✅ Built ${manifestEntries.length} pages`)
}

main()
