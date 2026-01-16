/**
 * OpenAPI 規格生成腳本
 *
 * 執行方式：pnpm run generate:openapi
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOpenApiDocument } from './index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../../public/api-docs/openapi.json');

async function main() {
  console.log('🔄 正在生成 OpenAPI 規格...');

  try {
    // 生成 OpenAPI 文件
    const document = generateOpenApiDocument();

    // 確保輸出目錄存在
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 寫入檔案
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(document, null, 2), 'utf-8');

    console.log('✅ OpenAPI 規格已生成：', OUTPUT_PATH);
    console.log('');
    console.log('📊 統計：');
    console.log(`   - Paths: ${Object.keys(document.paths || {}).length}`);
    console.log(`   - Schemas: ${Object.keys(document.components?.schemas || {}).length}`);
    console.log('');
    console.log('🌐 訪問 Swagger UI：http://localhost:4321/api-docs/');
  } catch (error) {
    console.error('❌ 生成失敗：', error);
    process.exit(1);
  }
}

main();
