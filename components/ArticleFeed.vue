<script setup lang="ts">
type Props = {
  publishedAt: Date;
  title: string;
  imageUrl: string;
  excerpt?: Object;
  url: string;
  imageAlt: string;
  imageLazyLoaded: boolean;
};

const props = defineProps<Props>();

const friendlyPublishedDate = computed(() =>
  new Intl.DateTimeFormat(["ban", "id"]).format(props.publishedAt)
);

const loadingMode = computed(() => (props.imageLazyLoaded ? "eager" : "lazy"));
</script>

<template>
  <article>
    <NuxtLink class="block mb-16" :to="url" :title="title">
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
        class="lg:h-96 w-full overflow-hidden object-cover object-center mb-4 bg-gray-200 dark:bg-gray-700"
      >
        <NuxtImg
          :src="imageUrl"
          class="max-w-full block h-auto"
          :alt="imageAlt"
          :loading="loadingMode"
        ></NuxtImg>
      </div>

      <div class="leading-[1.75] mb-4">
        <ContentRenderer :value="excerpt">
          <ContentRendererMarkdown :value="(excerpt as Record<string, any>)" />
        </ContentRenderer>
      </div>
    </NuxtLink>
  </article>
</template>
