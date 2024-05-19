<script setup lang="ts">
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation()
);

const tags = ["blog", "index", "list"];
</script>

<template>
  <Landing>
    <span class="text-green-600 text-lg md:text-2xl font-bold mb-5">Index</span>
    <h1
      class="text-5xl md:text-7xl font-bold mb-6 md:mb-10 lg:max-w-[500px] xl:max-w-[700px]"
    >
      Articles
    </h1>
    <p
      class="text-xl md:text-2xl font-normal text-gray-500 dark:text-gray-300 lg:max-w-[500px] xl:max-w-[700px] mb-5"
    >
      It is an article, blog, note or summary, or a mix of them? I am not sure.
    </p>
    <ul
      v-if="tags"
      class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-50"
    >
      <li
        v-for="(tag, index) in tags"
        :key="index"
        class="border border-solid border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-slate-800 rounded py-1 px-2"
      >
        #{{ tag }}
      </li>
    </ul>
  </Landing>
  <main class="mx-auto justify-center px-6 lg:px-0 lg:pt-20 sm:w-[65ch]">
    <div
      :key="topic.title"
      v-for="topic of navigation"
      class="p-6 border border-solid border-gray-200 dark:border-gray-700 rounded mb-12"
    >
      <h2 class="font-bold text-2xl">{{ topic.icon }} {{ topic.title }}</h2>
      <h3 class="text-gray-500 text-sm mb-4">{{ topic.description }}</h3>
      <ul
        :key="entry._id"
        v-for="entry of topic.children"
        class="flex flex-col gap-4"
      >
        <li class="block">
          <NuxtLink :to="entry._path" class="text-xl italic">{{
            entry.title
          }}</NuxtLink>
        </li>
      </ul>
    </div>
  </main>
</template>
