<script lang="ts" setup>
const localePath = useLocalePath();

var githubUrl = "https://github.com/data-miner00";
var websiteUrl = "https://mumk.dev";
var blogUrl = "https://blog.mumk.dev";

definePageMeta({
  layout: "none",
});
</script>

<template>
  <main class="flex h-screen relative">
    <VLandingHeader />

    <div class="flex-1 hidden lg:block">
      <NuxtImg
        src="/images/seascape.jpg"
        class="h-full block object-cover object-center dark:filter dark:brightness-40"
        alt="The aerial scenic view of the ocean"
      />
    </div>
    <div class="flex-1 px-10 flex flex-col justify-between">
      <div></div>
      <div>
        <h1 class="text-4xl lg:text-6xl font-bold mb-10 lg:!leading-[80px]">
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-300 to-blue-400"
            >Notes</span
          >,<br />
          Thoughts & Experience
        </h1>
        <p class="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-10">
          Welcome! This is the place where I write notes, articles and guides to
          reinforce my learning and helping others on the internet. The source
          code is available on GitHub.
        </p>

        <NuxtLink
          to="/list"
          class="text-xl lg:text-2xl text-sky-500 relative after:absolute after:left-0 after:right-0 after:top-[calc(100%+4px)] after:bg-sky-500 after:h-[2px]"
          >View entries</NuxtLink
        >
      </div>

      <footer
        class="flex items-center justify-between py-4 text-xs dark:text-gray-400"
      >
        <ul class="flex gap-4">
          <li>
            <NuxtLink
              :to="githubUrl"
              class="flex items-center gap-2 dark:hover:text-gray-300 hover:text-gray-600"
              target="_blank"
              title="Visit my GitHub profile"
            >
              <div class="circle pulse"></div>
              <div>GitHub</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="websiteUrl"
              class="flex items-center gap-2 dark:hover:text-gray-300 hover:text-gray-600"
              target="_blank"
              title="Visit my website"
            >
              <div class="circle pulse"></div>
              <div>Website</div>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="blogUrl"
              class="flex items-center gap-2 dark:hover:text-gray-300 hover:text-gray-600"
              target="_blank"
              title="Visit my blogs"
            >
              <div class="circle pulse"></div>
              <div>Blogs</div>
            </NuxtLink>
          </li>
        </ul>
        <div>&copy; 2024 Shaun Chong</div>
      </footer>
    </div>
  </main>
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
