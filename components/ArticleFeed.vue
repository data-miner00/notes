<script setup lang="ts">
type Props = {
  publishedAt: Date;
  title: string;
  imageUrl: string;
  excerpt?: Object;
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
      <p
        :title="$t('shared.publishedAt', { date: friendlyPublishedDate })"
        class="text-center text-xs text-gray-400 mb-1 tracking-wide"
      >
        <time :datetime="publishedAt.toDateString()">
          {{ friendlyPublishedDate }}
        </time>
      </p>
      <h1 class="text-2xl font-bold text-center uppercase mb-8">{{ title }}</h1>

      <div
        class="lg:h-96 w-full overflow-hidden object-cover object-center mb-4"
      >
        <NuxtImg :src="imageUrl" class="w-full block"></NuxtImg>
      </div>

      <div class="leading-[1.75] mb-4">
        <ContentRenderer :value="excerpt">
          <ContentRendererMarkdown :value="excerpt" />
        </ContentRenderer>
      </div>

      <button
        class="block mx-auto px-3 py-2 uppercase border border-solid rounded border-gray-500 text-sm tracking-wide hover:border-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
      >
        {{ $t("homePage.article-feed.read-more") }}
      </button>
    </NuxtLink>
  </article>
</template>
