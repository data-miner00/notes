<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <main class="py-20 lg:pt-5">
    <section>
      <h1
        class="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-2 md:mb-5"
      >
        <span class="text-black dark:text-gray-50">{{
          $t("error.title")
        }}</span>
      </h1>
      <p
        class="text-lg text-gray-600 dark:text-gray-200 text-center mb-2 md:mb-3"
      >
        {{ $t("error.description") }}
      </p>

      <NuxtLink
        :to="localePath('/')"
        class="block mx-auto w-fit px-3 py-2 uppercase border border-solid rounded text-white text-sm tracking-wide bg-green-500 hover:bg-green-400 transition-colors no-underline"
      >
        {{ $t("errorPage.action") }}
      </NuxtLink>
    </section>
  </main>
</template>
