<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import { urls } from "../appsettings.json";

const { locale } = useI18n();
const localePath = useLocalePath();
const { data: navigation } = await useAsyncData("navigation", () =>
  fetchContentNavigation(queryContent("articles"))
);

// very ugly...
const articles = computedAsync(async () => {
  if (locale.value === "en") {
    return await queryContent("articles")
      .where({ _extension: { $eq: "md" } })
      .sort({ createdAt: -1 })
      .limit(5)
      .find();
  } else {
    return await queryContent("ko", "articles")
      .where({ _extension: { $eq: "md" } })
      .sort({ createdAt: -1 })
      .limit(5)
      .find();
  }
});

const tags = computed(() =>
  Array.from(
    new Set(
      navigation.value?.[0].children?.flatMap((topic) =>
        topic.children?.flatMap((article) => article.tags)
      )
    )
  )
);
</script>

<template>
  <div class="">
    <div class="max-w-5xl mx-auto">
      <Hero
        :content="$t('homePage.hero.name')"
        :roles="[
          $t('homePage.hero.role1'),
          $t('homePage.hero.role2'),
          $t('homePage.hero.role3'),
        ]"
      />
      <div class="flex gap-16 my-16 flex-col lg:flex-row px-6 lg:px-0">
        <main class="lg:basis-8/12">
          <ArticleFeed
            v-for="article of articles"
            :key="article?._id"
            :published-at="new Date(article?.createdAt)"
            :title="article?.title ?? 'Untitled'"
            :excerpt="article?.excerpt"
            :url="article?._path ?? ''"
            image-url="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikKe28OFlOWSzFfwE-H7HETSjuoqeR4iqw3_HuFYrGDh6uyXcMMFxs4RPP0n8PAvAXC8uDhvi_fv8VoGrkIXj6ujLtyYng5A4DI89YzCFkVpazkrI7pdzrg-q86mp3ZDE-37FCAB2vEkBR/s320/9-steps-to-creating-a-killer-brief-for-your-graphic-designer.jpg"
          />
        </main>
        <aside class="lg:basis-4/12">
          <section class="mb-8">
            <p
              class="uppercase text-xs tracking-maximum text-gray-500 mb-4 font-bold text-center"
            >
              {{ $t("homePage.about-me.title") }}
            </p>
            <p class="text-justify">{{ $t("homePage.about-me.paragraph") }}</p>
          </section>

          <section class="mb-8">
            <p
              class="uppercase text-xs tracking-maximum text-gray-500 mb-4 font-bold text-center"
            >
              {{ $t("homePage.socials.title") }}
            </p>
            <div
              class="flex text-gray-600 dark:text-gray-400 gap-8 justify-center"
            >
              <NuxtLink :to="urls.x" target="_blank" class="block"
                ><i class="bi bi-twitter"></i
              ></NuxtLink>
              <div><i class="bi bi-facebook"></i></div>
              <NuxtLink :to="urls.github" target="_blank" class="block"
                ><i class="bi bi-github"></i
              ></NuxtLink>
              <NuxtLink :to="urls.pinterest" target="_blank" class="block"
                ><i class="bi bi-pinterest"></i
              ></NuxtLink>
              <div><i class="bi bi-instagram"></i></div>
            </div>
          </section>

          <section class="mb-8">
            <p
              class="uppercase text-xs tracking-maximum text-gray-500 mb-4 font-bold text-center"
            >
              {{ $t("homePage.tags.title") }}
            </p>
            <ul
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
          </section>

          <section class="mb-8">
            <p
              class="uppercase text-xs tracking-maximum text-gray-500 mb-4 font-bold text-center"
            >
              {{ $t("homePage.categories.title") }}
            </p>
            <ul class="flex flex-col gap-2">
              <li :key="topic.title" v-for="topic of navigation?.[0].children">
                <div class="bg-gray-700 text-center py-1 text-white">
                  {{ topic.title }}
                </div>
              </li>
            </ul>
          </section>

          <section class="mb-8">
            <p
              class="uppercase text-xs tracking-maximum text-gray-500 mb-4 font-bold text-center"
            >
              {{ $t("homePage.this-site.title") }}
            </p>
            <p
              class="text-justify"
              v-html="
                $t('homePage.this-site.paragraphHtml', {
                  templateUrl: urls.template,
                  bookUrl: urls.book,
                  inspirationUrl: urls.inspiration,
                  repoUrl: urls.repo,
                })
              "
            ></p>
          </section>

          <section>
            <img class="block mx-auto" :src="urls.spotifyPlaying" alt="" />
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.dark .pulse
  --pulse-from-color: rgba(255, 255, 255, 0.2)
  --pulse-to-color: rgba(255, 255, 255, 0)

.circle
  width: 8px
  height: 8px
  border-radius: 50%
  box-shadow: 0px 0px 1px 1px #0000001a
  @apply bg-sky-400

.pulse
  --pulse-from-color: rgba(0, 0, 0, 0.2)
  --pulse-to-color: rgba(0, 0, 0, 0)
  animation: pulse-animation 2s infinite

@keyframes pulse-animation
  0%
    box-shadow: 0 0 0 0px var(--pulse-from-color)

  100%
    box-shadow: 0 0 0 20px var(--pulse-to-color)
</style>
