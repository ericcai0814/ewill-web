// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// 網站 URL：優先使用環境變數，預設為生產網址
const siteUrl = process.env.SITE_URL || 'https://www.ewill.com.tw';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,

  // SSG 靜態生成模式
  output: 'static',

  // Vite 配置
  vite: {
    plugins: [tailwindcss()]
  },

  // 整合插件
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/api/'),
      serialize: (item) => {
        // 首頁最高優先級
        if (item.url === `${siteUrl}/`) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        // 解決方案與服務頁面
        else if (item.url.includes('/solutions/') || item.url.includes('/services/')) {
          item.priority = 0.9;
        }
        // 產品頁面
        else if (
          item.url.includes('/acunetix/') ||
          item.url.includes('/graylog/') ||
          item.url.includes('/bitdefender/') ||
          item.url.includes('/ist/') ||
          item.url.includes('/securityscorecard/') ||
          item.url.includes('/vicarius/')
        ) {
          item.priority = 0.8;
        }
        return item;
      },
    })
  ],

  // Markdown 配置
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },

  // 圖片最佳化 (Astro 內建)
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});