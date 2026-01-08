#!/usr/bin/env npx tsx
/**
 * build.ts
 * 
 * 統一入口：偵測框架並執行完整建置流程
 * 
 * Usage:
 *   npx tsx .claude/skills/content-build/scripts/build.ts
 *   npx tsx .claude/skills/content-build/scripts/build.ts --framework=next
 *   npx tsx .claude/skills/content-build/scripts/build.ts --framework=nuxt
 *   npx tsx .claude/skills/content-build/scripts/build.ts --framework=static
 */

import { detectTarget, getConfig, parseArgs, printHelp, OutputTarget } from './config'
import { normalizeAssets } from './normalize-assets'
import { buildContent } from './build-content'

async function main() {
  const args = parseArgs(process.argv.slice(2))
  
  if (args.help) {
    printHelp()
    process.exit(0)
  }
  
  // Detect or use specified target
  let target: OutputTarget
  
  if (args.target) {
    target = args.target
    console.log(`🎯 Using specified target: ${target}\n`)
  } else {
    const detected = detectTarget()
    if (detected) {
      target = detected
      console.log(`🔍 Detected target: ${target}\n`)
    } else {
      target = 'static'
      console.log(`ℹ️  No framework detected, using: ${target}\n`)
    }
  }
  
  const config = getConfig(target)
  
  console.log('═'.repeat(60))
  console.log(`  Content Build Pipeline`)
  console.log('═'.repeat(60))
  console.log(`  Target:       ${config.target}`)
  console.log(`  Content dir:  ${config.contentDir}`)
  console.log(`  Output dir:   ${config.outputDir}`)
  console.log(`  Assets:       ${config.outputDir}/${config.assetsDir}`)
  console.log(`  Content:      ${config.outputDir}/${config.contentSubDir}`)
  console.log('═'.repeat(60))
  console.log()
  
  // Step 1: Normalize assets
  console.log('─'.repeat(60))
  console.log('  Step 1: Normalize Assets')
  console.log('─'.repeat(60))
  console.log()
  
  try {
    await normalizeAssets(config)
  } catch (e) {
    console.error(`❌ Asset normalization failed:`, e)
    process.exit(1)
  }
  
  console.log()
  
  // Step 2: Build content
  console.log('─'.repeat(60))
  console.log('  Step 2: Build Content')
  console.log('─'.repeat(60))
  console.log()
  
  try {
    await buildContent(config)
  } catch (e) {
    console.error(`❌ Content build failed:`, e)
    process.exit(1)
  }
  
  console.log()
  console.log('═'.repeat(60))
  console.log(`  ✅ Build completed for ${target}`)
  console.log('═'.repeat(60))
  console.log()
  console.log(`Output:`)
  console.log(`  - ${config.outputDir}/${config.assetsDir}/`)
  console.log(`  - ${config.outputDir}/asset-manifest.json`)
  console.log(`  - ${config.outputDir}/${config.contentSubDir}/`)
  console.log(`  - ${config.outputDir}/${config.contentSubDir}/manifest.json`)
}

main().catch(console.error)

