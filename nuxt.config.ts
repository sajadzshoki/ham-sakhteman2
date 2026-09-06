export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
  ],

  ui: {
    // فونت وزیرمتن به‌صورت محلی با @fontsource باندل می‌شود؛ نیازی به @nuxt/fonts نیست
    fonts: false,
  },

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl',
      },
      title: 'هم‌ساختمان',
      titleTemplate: '%s | هم‌ساختمان',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'هم‌ساختمان؛ اپلیکیشن مدرن مدیریت ساختمان — شارژ، اطلاعیه‌ها، خدمات و ارتباط ساکنین در یک اپ.' },
        { name: 'theme-color', content: '#0f766e' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  i18n: {
    defaultLocale: 'fa',
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'fa',
        language: 'fa-IR',
        dir: 'rtl',
        file: 'fa.json',
        isDefault: true,
      },
    ],
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },
})
