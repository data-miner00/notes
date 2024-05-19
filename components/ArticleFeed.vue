<script setup lang="ts">
type Props = {
  publishedAt: Date;
  title: string;
  imageUrl: string;
  excerpt: string;
  url: string;
};

const props = defineProps<Props>();

const friendlyPublishedDate = computed(() =>
  new Intl.DateTimeFormat(["ban", "id"]).format(props.publishedAt)
);
</script>

<template>
  <article>
    <NuxtLink class="block mb-16" :to="url">
      <p class="text-center text-xs text-gray-400 mb-1 tracking-wide">
        {{ friendlyPublishedDate }}
      </p>
      <h1 class="text-2xl font-bold text-center uppercase mb-8">{{ title }}</h1>
      <NuxtImg :src="imageUrl" class="w-full block mb-4"></NuxtImg>
      <p class="leading-[1.75] mb-4">{{ excerpt }}</p>
      <button
        class="block mx-auto px-3 py-2 uppercase border border-solid rounded border-gray-500 text-sm tracking-wide hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
      >
        {{ $t("homePage.article-feed.read-more") }}
      </button>
    </NuxtLink>
  </article>
</template>
