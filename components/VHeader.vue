<script setup lang="ts">
import { urls } from "../appsettings.json";

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

const links: NavigationLink[] = [
  {
    content: "Home",
    url: "/",
  },
  {
    content: "Notes",
    url: "",
  },
  {
    content: "Articles",
    url: "",
  },
  {
    content: "Life",
    url: urls.blog,
  },
  {
    content: "Site",
    url: urls.website,
  },
];
</script>

<template>
  <header
    class="transition-all flex py-4 fixed w-full top-0 left-0 z-10 border-b border-transparent border-solid"
    :class="{ scrolled }"
  >
    <div class="w-[1024px] mx-auto relative flex">
      <ul class="flex gap-4 mx-auto">
        <li v-for="link of links" :key="link.content">
          <NuxtLink
            class="p-4 uppercase text-xs block text-gray-600 w-[100px] text-center tracking-widest"
            :to="link.url"
            active-class="font-semibold"
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
  </header>
</template>

<style scoped lang="sass">
.scrolled
  @apply bg-white border-gray-300 dark:bg-slate-900 dark:border-gray-800 py-2
</style>
