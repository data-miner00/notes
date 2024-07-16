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
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
        },
        {
          rel: "stylesheet",
          type: "text/css",
          href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
        },
      ],
      bodyAttrs: {
        class:
          "dark:bg-slate-900 dark:text-gray-50 text-stone-700 font-montserrat",
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
        iso: "en",
      },
      {
        code: "ko",
        file: "ko.json",
        iso: "ko",
      },
    ],
    vueI18n: {
      legacy: false,
    },
    langDir: "locales",
    lazy: true,
    defaultLocale: "en",
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://notes.mumk.dev",
      siteName: "Shaun Chong's Blog",
      siteDescription: "Technical blog website by Shaun Chong.",
    },
  },
  image: {
    provider: "vercel",
    domains: ["fastly.picsum.photo", "spotify-github-profile.vercel.app"],
  },
});
