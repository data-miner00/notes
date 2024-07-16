<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath();
const isPopupOpen = useState("popup-open", () => false);

function closePopup() {
  isPopupOpen.value = false;
}
</script>

<template>
  <div class="relative flex items-center">
    <button
      @click="() => (isPopupOpen = !isPopupOpen)"
      :title="$t('header.language-switcher.title')"
      class="flex ml-2 items-center justify-between px-2 py-2 bg-gray-100 dark:bg-slate-800 rounded-md"
    >
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="currentColor"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        class="block"
      >
        <path
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        ></path>
      </svg>
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-4 w-4 block"
      >
        <g transform="rotate(90 12 12)">
          <path d="M9 5l7 7-7 7"></path>
        </g>
      </svg>
    </button>
    <div
      v-if="isPopupOpen"
      class="absolute -bottom-24 right-0 flex flex-col items-stretch rounded bg-gray-100 dark:bg-slate-800"
    >
      <NuxtLink
        :to="switchLocalePath('en')"
        @click="closePopup"
        class="language"
      >
        <span class="block">
          <NuxtImg
            src="/images/united-states.png"
            alt="The flag of the States"
            class="h-6"
          />
        </span>
        <span class="block">English</span>
      </NuxtLink>
      <NuxtLink
        :to="switchLocalePath('ko')"
        @click="closePopup"
        class="language"
      >
        <span class="block">
          <NuxtImg
            src="/images/south-korea.png"
            alt="The flag of Korea"
            class="h-6"
          />
        </span>
        <span class="block">한국어</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="sass">
.language
  @apply p-2 flex gap-1 items-center hover:border-gray-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 hover:bg-white border border-solid border-transparent rounded text-center w-32
</style>
