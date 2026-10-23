<script setup lang="ts">
import { urls } from "../settings.json";

defineProps(["open", "toggleSidebar"]);
const localePath = useLocalePath();
const { t } = useI18n();
const feedUrl = useFeedUrl();

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
    <!-- dvh keeps the bottom section above mobile browser toolbars. -->
    <div
      class="w-full md:w-96 h-[100dvh] flex flex-col bg-white dark:bg-slate-800"
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
        <div class="flex items-center gap-1">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <button class="block ml-3" @click="toggleSidebar">
            <svg viewBox="0 0 15 15" width="21" height="21">
              <g
                class="stroke-slate-400 dark:stroke-slate-50"
                stroke-width="1.2"
              >
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </button>
        </div>
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
              class="block px-3 py-2 rounded font-semibold text-sm hover:bg-green-200/50 dark:text-white dark:hover:bg-green-500/50"
              :to="link.url"
              exact-active-class="text-green-600 bg-green-200/50 dark:bg-green-500/50"
              :target="link.url.startsWith('http') ? '_blank' : null"
            >
              {{ link.content }}
              <i
                v-if="link.url.startsWith('http')"
                class="bi bi-box-arrow-up-right"
              ></i>
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <footer
        class="mt-auto px-8 py-5 flex items-center justify-between border-t border-solid border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400"
      >
        <div class="flex gap-6 text-lg">
          <NuxtLink
            :to="urls.x"
            target="_blank"
            :title="$t('homePage.socials.twitterTitle')"
            ><i class="bi bi-twitter"></i
          ></NuxtLink>
          <NuxtLink
            :to="urls.github"
            target="_blank"
            :title="$t('homePage.socials.githubTitle')"
            ><i class="bi bi-github"></i
          ></NuxtLink>
          <NuxtLink
            :to="urls.linkedIn"
            target="_blank"
            :title="$t('homePage.socials.linkedInTitle')"
            ><i class="bi bi-linkedin"></i
          ></NuxtLink>
        </div>
        <a :href="feedUrl" class="text-sm font-semibold hover:text-green-600">
          <i class="bi bi-rss"></i> {{ $t("footer.sitemap.rss") }}
        </a>
      </footer>
    </div>
  </aside>
</template>
