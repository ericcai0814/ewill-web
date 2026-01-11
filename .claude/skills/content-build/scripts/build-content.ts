#!/usr/bin/env npx tsx
/**
 * build-content.ts
 * 
 * 解析 index.yml，將 image_id 解析為實際路徑，產出 content JSON
 * 支援 Next.js、Nuxt、Static 三種框架
 * 
 * Usage: 
 *   npx tsx scripts/build-content.ts
 *   npx tsx scripts/build-content.ts --framework=next
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
const parseYaml = (content: string) => yaml.load(content) as Record<string, unknown>
import { BuildConfig, detectTarget, getConfig, parseArgs, printHelp } from './config'

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
  target: string
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
  target: string
  pages: Array<{
    slug: string
    module: string
    path: string
  }>
}

// ============================================================================
// Asset Resolver
// ============================================================================

class AssetResolver {
  private assetMap: Map<string, AssetEntry> = new Map()
  private assetsPublicPath: string
  
  constructor(manifestPath: string, assetsPublicPath: string = '/assets') {
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Asset manifest not found: ${manifestPath}. Run normalize-assets.ts first.`)
    }
    
    this.assetsPublicPath = assetsPublicPath
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
    
    let desktopPath = asset.variants.desktop
    let mobilePath = asset.variants.mobile
    
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
    
    const toPublicPath = (p: string) => {
      const filename = path.basename(p)
      return `${this.assetsPublicPath}/${filename}`
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

function discoverModules(config: BuildConfig): string[] {
  if (!fs.existsSync(config.contentDir)) {
    console.error(`❌ Content directory not found: ${config.contentDir}`)
    process.exit(1)
  }
  
  return fs.readdirSync(config.contentDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function loadModuleYml(moduleName: string, config: BuildConfig): PageYml | null {
  const ymlPath = path.join(config.contentDir, moduleName, 'index.yml')
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

function loadModuleMd(moduleName: string, config: BuildConfig): string {
  const mdPath = path.join(config.contentDir, moduleName, 'index.md')
  if (!fs.existsSync(mdPath)) {
    return ''
  }
  
  return fs.readFileSync(mdPath, 'utf-8')
}

function resolveLayout(layout: LayoutConfig | undefined, resolver: AssetResolver): PageJson['layout'] {
  if (!layout) return {}
  
  const resolved: PageJson['layout'] = {}
  
  if (layout.hero?.image) {
    const resolvedImage = resolver.resolve(layout.hero.image)
    if (resolvedImage) {
      resolved.hero = { image: resolvedImage }
    }
  }
  
  if (layout.sections) {
    resolved.sections = layout.sections.map(section => {
      const resolvedSection: PageJson['layout']['sections'][0] = {
        type: section.type,
      }
      
      if (section.image_ids) {
        resolvedSection.images = section.image_ids
          .map(id => resolver.resolveById(id))
          .filter((img): img is ResolvedImage => img !== null)
      }
      
      for (const [key, value] of Object.entries(section)) {
        if (key !== 'type' && key !== 'image_ids') {
          resolvedSection[key] = value
        }
      }
      
      return resolvedSection
    })
  }
  
  for (const [key, value] of Object.entries(layout)) {
    if (key !== 'hero' && key !== 'sections') {
      resolved[key] = value
    }
  }
  
  return resolved
}

// Layout component modules that should preserve all YAML fields
const LAYOUT_COMPONENTS = ['header', 'footer']

function isLayoutComponent(moduleName: string): boolean {
  return LAYOUT_COMPONENTS.includes(moduleName)
}

function buildPage(moduleName: string, resolver: AssetResolver, config: BuildConfig): PageJson | Record<string, unknown> {
  const yml = loadModuleYml(moduleName, config) || {}
  const content = loadModuleMd(moduleName, config)

  // Layout components (header/footer) preserve all YAML fields
  if (isLayoutComponent(moduleName)) {
    return {
      ...yml,
      slug: moduleName,
      module: moduleName,
      content,
      generated_at: new Date().toISOString(),
    }
  }

  // Regular pages use standard structure
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

export async function buildContent(config: BuildConfig): Promise<ContentManifest> {
  console.log(`🔄 Starting content build for ${config.target}...\n`)
  console.log(`   Content dir: ${config.contentDir}`)
  console.log(`   Output dir:  ${config.outputDir}\n`)
  
  const manifestPath = path.join(config.outputDir, 'asset-manifest.json')
  const contentOutputDir = path.join(config.outputDir, config.contentSubDir)
  const pagesOutputDir = path.join(contentOutputDir, 'pages')
  
  // Initialize asset resolver
  let resolver: AssetResolver
  try {
    resolver = new AssetResolver(manifestPath, `/${config.assetsDir}`)
  } catch (e) {
    console.error(`❌ ${(e as Error).message}`)
    process.exit(1)
  }
  
  const modules = discoverModules(config)
  console.log(`📦 Found ${modules.length} modules to process\n`)
  
  fs.mkdirSync(pagesOutputDir, { recursive: true })
  
  const manifestEntries: ContentManifest['pages'] = []
  
  for (const moduleName of modules) {
    try {
      const page = buildPage(moduleName, resolver, config)
      const outputPath = path.join(pagesOutputDir, `${moduleName}.json`)
      
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
    target: config.target,
    pages: manifestEntries,
  }
  
  const manifestOutputPath = path.join(contentOutputDir, 'manifest.json')
  fs.writeFileSync(manifestOutputPath, JSON.stringify(manifest, null, 2))
  
  console.log(`\n📋 Content manifest written to ${manifestOutputPath}`)
  console.log(`✅ Built ${manifestEntries.length} pages`)
  
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
  
  await buildContent(config)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
