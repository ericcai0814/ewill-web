/**
 * 資料庫 Seed 腳本
 *
 * 將 JSON 內容匯入 Neon PostgreSQL
 *
 * 使用方式：
 * npx tsx astro-app/lib/db/seed.ts
 */
import fs from 'fs/promises';
import path from 'path';
import { db } from './client';
import { pages, assets } from './schema';
import type { PageContent, AssetManifest } from '@ewill/shared';

// 判斷執行位置：從 astro-app 執行或從根目錄執行
const isInAstroApp = process.cwd().endsWith('astro-app');
const PUBLIC_DIR = isInAstroApp
  ? path.join(process.cwd(), 'public')
  : path.join(process.cwd(), 'astro-app', 'public');

async function seedPages() {
  console.log('📄 開始匯入頁面資料...');

  // 讀取 manifest
  const manifestPath = path.join(PUBLIC_DIR, 'content', 'manifest.json');
  const manifestContent = await fs.readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestContent);

  // 排除 header/footer
  const pagesToImport = manifest.pages.filter(
    (p: { module: string }) => !['header', 'footer'].includes(p.module)
  );

  let imported = 0;
  for (const pageInfo of pagesToImport) {
    const pagePath = path.join(PUBLIC_DIR, 'content', 'pages', `${pageInfo.slug}.json`);

    try {
      const content = await fs.readFile(pagePath, 'utf-8');
      const pageData: PageContent = JSON.parse(content);

      await db.insert(pages).values({
        slug: pageData.slug,
        module: pageData.module,
        template: pageData.template || null,
        seo: pageData.seo,
        url_mapping: pageData.url_mapping,
        content: pageData.content || null,
        layout: pageData.layout || null,
        aio: pageData.aio || null,
        generated_at: pageData.generated_at,
      }).onConflictDoUpdate({
        target: pages.slug,
        set: {
          module: pageData.module,
          template: pageData.template || null,
          seo: pageData.seo,
          url_mapping: pageData.url_mapping,
          content: pageData.content || null,
          layout: pageData.layout || null,
          aio: pageData.aio || null,
          generated_at: pageData.generated_at,
          updated_at: new Date(),
        },
      });

      imported++;
      console.log(`  ✅ ${pageData.slug}`);
    } catch (error) {
      console.error(`  ❌ 匯入 ${pageInfo.slug} 失敗:`, error);
    }
  }

  console.log(`📄 完成：匯入 ${imported} 個頁面\n`);
}

async function seedAssets() {
  console.log('🖼️  開始匯入圖片資源...');

  // 讀取 asset manifest
  const manifestPath = path.join(PUBLIC_DIR, 'asset-manifest.json');
  const manifestContent = await fs.readFile(manifestPath, 'utf-8');
  const manifest: AssetManifest = JSON.parse(manifestContent);

  let imported = 0;
  for (const asset of manifest.assets) {
    try {
      await db.insert(assets).values({
        image_id: asset.id,
        original_path: asset.original_path,
        normalized_path: asset.normalized_path,
        variants: asset.variants,
        alt: asset.alt,
      }).onConflictDoUpdate({
        target: assets.image_id,
        set: {
          original_path: asset.original_path,
          normalized_path: asset.normalized_path,
          variants: asset.variants,
          alt: asset.alt,
        },
      });

      imported++;
    } catch (error) {
      console.error(`  ❌ 匯入 ${asset.id} 失敗:`, error);
    }
  }

  console.log(`🖼️  完成：匯入 ${imported} 個圖片資源\n`);
}

async function main() {
  console.log('🚀 開始資料庫 Seed...\n');

  try {
    await seedPages();
    await seedAssets();
    console.log('✅ Seed 完成！');
  } catch (error) {
    console.error('❌ Seed 失敗:', error);
    process.exit(1);
  }
}

main();
