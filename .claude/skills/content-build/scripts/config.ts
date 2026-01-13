import { existsSync, readdirSync } from 'fs'
import { join, resolve } from 'path'

export type OutputTarget = 'next' | 'nuxt' | 'astro' | 'static'

export interface BuildConfig {
  target: OutputTarget    // 輸出目標：next, nuxt, astro, static
  contentDir: string      // pages/ 來源目錄
  outputDir: string       // 產出根目錄
  assetsDir: string       // assets 子目錄名稱
  contentSubDir: string   // content 子目錄名稱
}

/**
 * 偵測專案輸出目標
 * 檢查 next.config.* / nuxt.config.* / astro.config.* 是否存在
 */
export function detectTarget(rootDir: string = process.cwd()): OutputTarget | null {
  // 先檢查根目錄
  if (existsSync(join(rootDir, 'next.config.ts')) || existsSync(join(rootDir, 'next.config.js'))) {
    return 'next'
  }
  if (existsSync(join(rootDir, 'nuxt.config.ts')) || existsSync(join(rootDir, 'nuxt.config.js'))) {
    return 'nuxt'
  }
  if (existsSync(join(rootDir, 'astro.config.mjs')) || existsSync(join(rootDir, 'astro.config.ts'))) {
    return 'astro'
  }

  // 檢查子目錄（如 astro-app/）
  try {
    const dirs = readdirSync(rootDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')

    for (const dir of dirs) {
      const subPath = join(rootDir, dir.name)
      if (existsSync(join(subPath, 'next.config.ts')) || existsSync(join(subPath, 'next.config.js'))) {
        return 'next'
      }
      if (existsSync(join(subPath, 'nuxt.config.ts')) || existsSync(join(subPath, 'nuxt.config.js'))) {
        return 'nuxt'
      }
      if (existsSync(join(subPath, 'astro.config.mjs')) || existsSync(join(subPath, 'astro.config.ts'))) {
        return 'astro'
      }
    }
  } catch {
    // ignore errors
  }

  return null
}

/**
 * 尋找框架專案目錄
 */
export function findProjectDir(target: OutputTarget, rootDir: string = process.cwd()): string | null {
  if (target === 'static') return null

  const configFilesMap: Record<Exclude<OutputTarget, 'static'>, string[]> = {
    next: ['next.config.ts', 'next.config.js'],
    nuxt: ['nuxt.config.ts', 'nuxt.config.js'],
    astro: ['astro.config.mjs', 'astro.config.ts'],
  }

  const configFiles = configFilesMap[target]

  for (const file of configFiles) {
    if (existsSync(join(rootDir, file))) {
      return rootDir
    }
  }

  // 搜尋子目錄
  try {
    const dirs = readdirSync(rootDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')

    for (const dir of dirs) {
      const subPath = join(rootDir, dir.name)
      for (const file of configFiles) {
        if (existsSync(join(subPath, file))) {
          return subPath
        }
      }
    }
  } catch {
    // ignore errors
  }

  return null
}

/**
 * 取得建置配置
 */
export function getConfig(target: OutputTarget, rootDir: string = process.cwd()): BuildConfig {
  const projectDir = findProjectDir(target, rootDir)

  const configs: Record<OutputTarget, BuildConfig> = {
    next: {
      target: 'next',
      contentDir: 'pages',
      outputDir: projectDir ? join(projectDir, 'public') : join(rootDir, 'next-app', 'public'),
      assetsDir: 'assets',
      contentSubDir: 'content',
    },
    nuxt: {
      target: 'nuxt',
      contentDir: 'pages',
      outputDir: projectDir ? join(projectDir, 'public') : join(rootDir, 'nuxt-app', 'public'),
      assetsDir: 'assets',
      contentSubDir: 'content',
    },
    astro: {
      target: 'astro',
      contentDir: 'pages',
      outputDir: projectDir ? join(projectDir, 'public') : join(rootDir, 'astro-app', 'public'),
      assetsDir: 'assets',
      contentSubDir: 'content',
    },
    static: {
      target: 'static',
      contentDir: 'pages',
      outputDir: join(rootDir, 'static-app'),
      assetsDir: 'assets',
      contentSubDir: 'content',
    },
  }

  return configs[target]
}

/**
 * 解析命令列參數
 */
export function parseArgs(args: string[]): { target?: OutputTarget; help?: boolean } {
  const result: { target?: OutputTarget; help?: boolean } = {}

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      result.help = true
    } else if (arg.startsWith('--target=')) {
      const value = arg.split('=')[1] as OutputTarget
      if (['next', 'nuxt', 'astro', 'static'].includes(value)) {
        result.target = value
      }
    }
  }

  return result
}

/**
 * 顯示使用說明
 */
export function printHelp(): void {
  console.log(`
Content Build Pipeline

Usage:
  npx tsx build.ts [options]

Options:
  --target=<next|nuxt|astro|static>  指定輸出目標
  --help, -h                         顯示此說明

Examples:
  npx tsx build.ts                  # 自動偵測框架
  npx tsx build.ts --target=next    # 輸出到 next-app/public/
  npx tsx build.ts --target=nuxt    # 輸出到 nuxt-app/public/
  npx tsx build.ts --target=astro   # 輸出到 astro-app/public/
  npx tsx build.ts --target=static  # 輸出到 static-app/
`)
}

