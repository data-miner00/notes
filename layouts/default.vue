<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const htmlAttrs = computed(() => head.value.htmlAttrs!);

useHead({
  link: [
    {
      rel: "alternate",
      type: "application/rss+xml",
      href: useFeedUrl(),
    },
  ],
});
</script>

<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <VHeader />
    <slot />
    <VFooter />
  </Html>
</template>
