// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  // 靜態生成設定
  nitro: {
    prerender: {
      // 忽略尚未建立的頁面連結
      failOnError: false,
      crawlLinks: false,
      routes: ['/'],
    },
  },

  app: {
    head: {
      title: '鎰威科技 | 企業資安與智慧製造數位轉型專家',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '鎰威科技專注於企業數位轉型，整合資訊安全、AI 智慧製造與大數據應用。提供從規劃到導入的一站式解決方案。',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
})

