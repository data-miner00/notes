<script setup lang="ts">
import { urls } from "../appsettings.json";

const { t } = useI18n();
const localePath = useLocalePath();
const scrolled = ref(false);
const open = useState("sidebar-open", () => false);

function toggleSidebar() {
  open.value = !open.value;
}

onMounted(() => {
  window.addEventListener("scroll", () => {
    scrolled.value = window.scrollY > 0;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", () =>
    console.log("Unsubscribed scroll")
  );
});

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
  <header
    class="transition-all px-6 lg:px-0 flex py-4 fixed w-full top-0 left-0 z-10 border-b border-transparent border-solid"
    :class="{ scrolled }"
  >
    <div class="lg:w-[1024px] w-full mx-auto relative flex items-center">
      <div class="lg:hidden">
        <button
          aria-label="Toggle Sidebar"
          class="block"
          @click="toggleSidebar"
        >
          <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M4 7h22M4 15h22M4 23h22"
            ></path>
          </svg>
        </button>
      </div>
      <ul class="hidden lg:flex gap-4 mx-auto">
        <li v-for="link of links" :key="link.content">
          <NuxtLink
            class="p-4 uppercase text-xs block text-gray-600 dark:text-gray-400 w-[100px] text-center tracking-widest hover:text-green-600 dark:hover:text-green-600"
            :to="link.url"
            active-class="font-semibold text-green-600 dark:text-green-600"
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
      <div
        class="absolute transform -translate-y-1/2 top-1/2 right-0 flex gap-1"
      >
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </div>

    <MobileSidebar :open="open" :toggle-sidebar="toggleSidebar" />
  </header>
</template>

<style scoped lang="sass">
.scrolled
  @apply bg-white border-gray-300 dark:bg-slate-900 dark:border-gray-800 lg:py-2
</style>
