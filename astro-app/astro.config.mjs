// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 網站 URL (部署時需修改為實際網址)
  site: 'https://www.ewill.com.tw',

  // SSG 靜態生成模式
  output: 'static',

  // Vite 配置
  vite: {
    plugins: [tailwindcss()]
  },

  // 整合插件
  integrations: [
    sitemap({
      // Sitemap 配置
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
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