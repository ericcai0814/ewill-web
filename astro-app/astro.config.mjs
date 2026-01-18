// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// 網站 URL（正式上線時改為 https://www.ewill.com.tw）
const siteUrl = 'https://ewill-web-astro-app.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,

  // 使用 Vercel adapter 處理 SSR 頁面 (prerender: false)
  // Astro 5: static 模式預設靜態生成，個別頁面可用 prerender: false 啟用 SSR
  output: 'static',
  adapter: vercel(),

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
          // @ts-ignore - sitemap changefreq enum type mismatch
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