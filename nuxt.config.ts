// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0",
      title: "Shaun Chong's Blog",
      meta: [
        {
          name: "description",
          content: "Technical blog website by Shaun Chong.",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/nuxt.svg",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
      bodyAttrs: {
        class: "dark:bg-slate-900 dark:text-gray-50 text-stone-700",
      },
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxt/image",
  ],
  extends: ["nuxt-seo-kit"],
  tailwindcss: {
    configPath: "./tailwind.config.js",
    cssPath: "./assets/css/styles.scss",
    viewer: false,
  },
  content: {
    documentDriven: true,
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
      },
      preload: ["cpp", "csharp", "rust", "wenyan", "yaml", "latex"],
    },
    markdown: {
      remarkPlugins: ["remark-math"],
      rehypePlugins: ["rehype-mathjax"],
    },
    navigation: {
      fields: ["updatedAt", "description", "tags", "excerpt", "createdAt"],
    },
  },
  colorMode: { classSuffix: "" },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "ko",
        file: "ko.json",
      },
    ],
    vueI18n: {
      legacy: false,
      locale: "en",
    },
    langDir: "locales",
    lazy: true,
    defaultLocale: "en",
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
      siteName: "Shaun Chong's Blog",
      siteDescription: "Technical blog website by Shaun Chong.",
      language: "en",
    },
  },
  image: {
    provider: "netlify", // Use your own provider!
  },
});
