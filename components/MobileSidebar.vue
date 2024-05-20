<script setup lang="ts">
import { urls } from "../appsettings.json";

defineProps(["open", "toggleSidebar"]);
const localePath = useLocalePath();
const { t } = useI18n();

type NavigationLink = {
  content: string;
  url: string;
};

const links = computed<NavigationLink[]>(() => [
  {
    content: t("header.home"),
    url: localePath("/"),
  },
  {
    content: t("header.notes"),
    url: localePath("/notes"),
  },
  {
    content: t("header.articles"),
    url: localePath("/articles"),
  },
  {
    content: t("header.life"),
    url: urls.blog,
  },
  {
    content: t("header.site"),
    url: urls.website,
  },
]);
</script>

<template>
  <aside
    aria-label="mobile-sidebar"
    v-if="open"
    class="fixed top-0 left-0 z-20 bg-gray-900/50 w-screen h-screen lg:hidden"
    @click="toggleSidebar"
  >
    <div
      class="w-full md:w-96 h-screen bg-white dark:bg-slate-800"
      @click.stop
      role="navigation"
    >
      <header
        class="flex border-b border-solid border-gray-300 dark:border-gray-700 items-center px-5 py-4 justify-between"
      >
        <div class="text-lg font-bold mr-5">
          <NuxtLink :to="localePath('/')" class="flex items-center">
            <span class="ml-1 block uppercase">{{
              $t("homePage.hero.name")
            }}</span>
          </NuxtLink>
        </div>
        <button class="block" @click="toggleSidebar">
          <svg viewBox="0 0 15 15" width="21" height="21">
            <g class="stroke-slate-400 dark:stroke-slate-50" stroke-width="1.2">
              <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
            </g>
          </svg>
        </button>
      </header>
      <nav class="p-5">
        <ul>
          <li
            v-for="(link, index) in links"
            :key="index"
            class="mb-1"
            @click="toggleSidebar"
          >
            <NuxtLink
              class="block px-3 py-2 rounded font-semibold text-sm hover:bg-green-200/50"
              :to="link.url"
              exact-active-class="text-green-400 bg-green-200/50 dark:bg-green-500/50"
            >
              {{ link.content }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>
