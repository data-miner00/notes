<script setup lang="ts">
import { urls } from "../appsettings.json";
const localePath = useLocalePath();

type NavigationLink = {
  translationKey: string;
  url: string;
};

const links: NavigationLink[] = [
  {
    translationKey: "footer.sitemap.homepage",
    url: "/",
  },
  {
    translationKey: "footer.sitemap.notes",
    url: "/notes",
  },
  {
    translationKey: "footer.sitemap.articles",
    url: "/articles",
  },
];

const projects: NavigationLink[] = [
  {
    translationKey: "footer.projects.blogs",
    url: urls.blogRepo,
  },
  {
    translationKey: "footer.projects.website",
    url: urls.websiteRepo,
  },
  {
    translationKey: "footer.projects.book",
    url: urls.bookRepo,
  },
  {
    translationKey: "footer.projects.linker",
    url: urls.linkerRepo,
  },
  {
    translationKey: "footer.projects.hn",
    url: urls.hnRepo,
  },
  {
    translationKey: "footer.projects.arkn",
    url: urls.arknRepo,
  },
  {
    translationKey: "footer.projects.us",
    url: urls.usRepo,
  },
];

const templates: NavigationLink[] = [
  {
    translationKey: "footer.templates.python",
    url: urls.pythonTemplateRepo,
  },
  {
    translationKey: "footer.templates.grunt",
    url: urls.gruntTemplateRepo,
  },
  {
    translationKey: "footer.templates.elm",
    url: urls.elmTemplateRepo,
  },
];

type TechLink = {
  name: string;
  url: string;
};

const techs: TechLink[] = [
  {
    name: "Vue.js",
    url: urls.tech.vue,
  },
  {
    name: "Nuxt.js",
    url: urls.tech.nuxt,
  },
  {
    name: "Nuxt Content",
    url: urls.tech["nuxt-content"],
  },
  {
    name: "Tailwind CSS",
    url: urls.tech.tailwind,
  },
  {
    name: "Nuxt Tailwind",
    url: urls.tech["nuxt-tailwind"],
  },
  {
    name: "Markdown",
    url: urls.tech.markdown,
  },
  {
    name: "Pnpm",
    url: urls.tech.pnpm,
  },
];

const now = new Date();
</script>

<template>
  <footer class="footer relative pt-10 pb-10 lg:pb-24 lg:pt-28">
    <div
      class="mx-auto px-6 flex flex-col items-center lg:items-start lg:grid lg:grid-cols-6 lg:grid-rows-1 lg:max-w-[75rem] gap-20"
    >
      <section class="lg:col-span-2 my-10 lg:my-0 text-center lg:text-left">
        <img
          src="/nuxt.svg"
          alt="Nuxt logo"
          class="w-12 h-12 mb-5 block mx-auto lg:mx-0"
          :title="$t('footer.powerByNuxt')"
        />
        <h2 class="text-2xl font-bold mb-5">{{ $t("homePage.hero.name") }}</h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ $t("footer.description") }}
        </p>
      </section>
      <nav
        class="row-start-2 row-span-2 lg:row-start-1 lg:col-start-3 lg:row-span-full text-center lg:text-left text-lg font-semibold lg:text-base lg:font-normal"
        aria-labelledby="sitemap"
      >
        <h2 id="sitemap">{{ $t("footer.sitemap.title") }}</h2>
        <ul>
          <li v-for="(link, index) of links" :key="index">
            <NuxtLink :to="localePath(link.url)">
              {{ $t(link.translationKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <nav
        class="lg:row-start-1 lg:col-start-4 lg:row-span-full text-center lg:text-left text-lg font-semibold lg:text-base lg:font-normal"
        aria-labelledby="projects"
      >
        <h2 id="projects">{{ $t("footer.projects.title") }}</h2>

        <ul>
          <li v-for="(project, index) of projects" :key="index">
            <NuxtLink :to="project.url" target="_blank">
              {{ $t(project.translationKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <nav
        class="lg:row-start-1 lg:col-start-5 lg:row-span-full text-center lg:text-left text-lg font-semibold lg:text-base lg:font-normal"
        aria-labelledby="templates"
      >
        <h2 id="templates">{{ $t("footer.templates.title") }}</h2>

        <ul>
          <li v-for="(template, index) of templates" :key="index">
            <NuxtLink :to="template.url" target="_blank">
              {{ $t(template.translationKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <nav
        class="lg:row-start-1 lg:col-start-6 lg:row-span-full text-center lg:text-left text-lg font-semibold lg:text-base lg:font-normal"
        aria-labelledby="technologies"
      >
        <h2 id="technologies">{{ $t("footer.technologies.title") }}</h2>

        <ul>
          <li v-for="(tech, index) of techs" :key="index">
            <NuxtLink :to="tech.url" target="_blank">
              {{ tech.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
    <footer
      class="pt-12 mx-auto px-6 lg:max-w-[75rem] text-gray-400 text-sm text-center lg:text-left"
    >
      Notes &copy; {{ now.getFullYear() }} by Shaun. All rights reserved.
    </footer>
  </footer>
</template>

<style lang="scss" scoped>
.footer::before {
  --mask-color: #000;
  --background-color: #fafafa;
  content: "";
  position: absolute;
  inset: 0;
  mask-image: linear-gradient(
    transparent,
    var(--mask-color),
    var(--mask-color)
  );
  background-color: var(--background-color);
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpolygon fill-rule='evenodd' points='8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4'/%3E%3C/g%3E%3C/svg%3E");
}

.dark .footer::before {
  --mask-color: #fff;
  --background-color: #0f172a;
}

nav {
  @apply flex flex-col gap-2;

  h2 {
    @apply font-semibold mb-5 text-gray-700 dark:text-gray-200;
  }

  a {
    @apply text-gray-500 dark:text-gray-400 block my-2;

    &:hover {
      @apply text-gray-700 dark:text-gray-300;
    }
  }
}
</style>
