<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});

const htmlAttrs = computed(() => head.value.htmlAttrs!);

const { locale } = useI18n();
useHead({
  link: [
    {
      rel: "alternate",
      type: "application/rss+xml",
      href: computed(() =>
        locale.value === "en" ? "/rss.xml" : "/ko/rss.xml",
      ),
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
