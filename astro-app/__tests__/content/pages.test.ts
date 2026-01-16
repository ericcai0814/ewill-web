/**
 * Mock Data JSON 結構驗證測試
 */
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// SEO Schema
const seoSchema = z.object({
  title: z.string().min(1, 'SEO title 不可為空'),
  description: z.string().min(1, 'SEO description 不可為空'),
  keywords: z.array(z.string()),
  og_image: z.string().optional(),
});

// URL Mapping Schema
const urlMappingSchema = z.object({
  current_url: z.string().min(1),
  new_url: z.string().optional(),
});

// Breadcrumb Item Schema（item 可選，某些頁面可能缺少）
const breadcrumbItemSchema = z.object({
  type: z.string(),
  position: z.number(),
  name: z.string(),
  item: z.string().optional(),
});

// AIO Schema (簡化版，允許額外欄位)
const aioSchema = z.object({
  organization: z.record(z.unknown()).optional(),
  website: z.record(z.unknown()).optional(),
  webpage: z.object({
    type: z.string(),
    name: z.string(),
    description: z.string().optional(),
    primaryImageOfPage: z.string().optional(),
    breadcrumb: z.object({
      type: z.string(),
      itemListElement: z.array(breadcrumbItemSchema),
    }).optional(),
  }).passthrough().optional(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  product: z.record(z.unknown()).optional(),
  service: z.record(z.unknown()).optional(),
  event: z.record(z.unknown()).optional(),
}).passthrough();

// 特殊頁面（header/footer）使用不同的 schema
const SPECIAL_PAGES = ['header', 'footer'];

// Page Content Schema（標準頁面）
const pageContentSchema = z.object({
  slug: z.string().min(1, 'slug 不可為空'),
  module: z.string().min(1, 'module 不可為空'),
  template: z.string().optional(),
  seo: seoSchema.optional(), // header/footer 不需要 SEO
  url_mapping: urlMappingSchema.optional(), // header/footer 不需要 url_mapping
  content: z.union([z.record(z.unknown()), z.string()]).optional(),
  layout: z.record(z.unknown()).optional(),
  aio: aioSchema.optional(),
  generated_at: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'generated_at 必須是有效的 ISO 8601 日期'
  ),
});

// 標準頁面 Schema（必須有 SEO 和 url_mapping）
const standardPageContentSchema = z.object({
  slug: z.string().min(1, 'slug 不可為空'),
  module: z.string().min(1, 'module 不可為空'),
  template: z.string().optional(),
  seo: seoSchema,
  url_mapping: urlMappingSchema,
  content: z.record(z.unknown()).optional(),
  layout: z.record(z.unknown()).optional(),
  aio: aioSchema.optional(),
  generated_at: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'generated_at 必須是有效的 ISO 8601 日期'
  ),
});

// 取得所有 JSON 檔案
function getPageJsonFiles(): string[] {
  const pagesDir = path.join(__dirname, '../../public/content/pages');
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  return fs.readdirSync(pagesDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(pagesDir, file));
}

describe('Mock Data JSON 結構驗證', () => {
  const jsonFiles = getPageJsonFiles();

  it('應至少有一個 JSON 檔案', () => {
    expect(jsonFiles.length).toBeGreaterThan(0);
  });

  describe.each(jsonFiles)('檔案: %s', (filePath) => {
    const fileName = path.basename(filePath);
    let pageData: unknown;

    it(`${fileName} 應為有效 JSON`, () => {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(() => {
        pageData = JSON.parse(content);
      }).not.toThrow();
    });

    it(`${fileName} 應符合 PageContent Schema`, () => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const result = pageContentSchema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map((e) =>
          `${e.path.join('.')}: ${e.message}`
        ).join('\n');
        console.error(`\n${fileName} 驗證失敗:\n${errors}`);
      }

      expect(result.success).toBe(true);
    });

    it(`${fileName} slug 應與檔名一致`, () => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      const expectedSlug = fileName.replace('.json', '');
      expect(data.slug).toBe(expectedSlug);
    });
  });
});

describe('SEO 欄位完整性', () => {
  const jsonFiles = getPageJsonFiles();

  // 排除特殊頁面
  const standardFiles = jsonFiles.filter((filePath) => {
    const slug = path.basename(filePath, '.json');
    return !SPECIAL_PAGES.includes(slug);
  });

  standardFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    describe(`${fileName} SEO`, () => {
      it('title 應少於 70 字', () => {
        expect(data.seo.title.length).toBeLessThanOrEqual(70);
      });

      it('description 應少於 200 字', () => {
        expect(data.seo.description.length).toBeLessThanOrEqual(200);
      });

      it('keywords 應為陣列', () => {
        expect(Array.isArray(data.seo.keywords)).toBe(true);
      });
    });
  });
});

describe('URL Mapping 驗證', () => {
  const jsonFiles = getPageJsonFiles();

  // 排除特殊頁面
  const standardFiles = jsonFiles.filter((filePath) => {
    const slug = path.basename(filePath, '.json');
    return !SPECIAL_PAGES.includes(slug);
  });

  standardFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    it(`${fileName} current_url 應以 / 開頭`, () => {
      expect(data.url_mapping.current_url.startsWith('/')).toBe(true);
    });

    it(`${fileName} current_url 應以 / 結尾`, () => {
      expect(data.url_mapping.current_url.endsWith('/')).toBe(true);
    });
  });
});

describe('AIO 結構化資料驗證', () => {
  const jsonFiles = getPageJsonFiles();

  // 排除特殊頁面
  const standardFiles = jsonFiles.filter((filePath) => {
    const slug = path.basename(filePath, '.json');
    return !SPECIAL_PAGES.includes(slug);
  });

  standardFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    if (data.aio) {
      describe(`${fileName} AIO`, () => {
        if (data.aio.webpage) {
          it('webpage.type 應為有效類型', () => {
            const validTypes = [
              'WebPage',
              'ProductPage',
              'ContactPage',
              'AboutPage',
              'CollectionPage',
              'ItemPage',
              'FAQPage',
              'EventPage',
              'ServicePage',
            ];
            expect(validTypes).toContain(data.aio.webpage.type);
          });

          it('webpage.name 應有值', () => {
            expect(data.aio.webpage.name.length).toBeGreaterThan(0);
          });

          if (data.aio.webpage.breadcrumb) {
            it('breadcrumb 應至少有一個項目', () => {
              expect(data.aio.webpage.breadcrumb.itemListElement.length).toBeGreaterThan(0);
            });

            it('breadcrumb position 應從 1 開始遞增', () => {
              const positions = data.aio.webpage.breadcrumb.itemListElement.map(
                (item: { position: number }) => item.position
              );
              for (let i = 0; i < positions.length; i++) {
                expect(positions[i]).toBe(i + 1);
              }
            });
          }
        }

        if (data.aio.faq) {
          it('FAQ 應至少有一個問答', () => {
            expect(data.aio.faq.length).toBeGreaterThan(0);
          });

          data.aio.faq.forEach((faq: { question: string; answer: string }, index: number) => {
            it(`FAQ[${index}] question 不可為空`, () => {
              expect(faq.question.length).toBeGreaterThan(0);
            });

            it(`FAQ[${index}] answer 不可為空`, () => {
              expect(faq.answer.length).toBeGreaterThan(0);
            });
          });
        }
      });
    }
  });
});

describe('generated_at 時間戳驗證', () => {
  const jsonFiles = getPageJsonFiles();

  jsonFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    it(`${fileName} generated_at 應為有效日期`, () => {
      const date = new Date(data.generated_at);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it(`${fileName} generated_at 應為 ISO 8601 格式`, () => {
      expect(data.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
