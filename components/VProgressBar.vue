<template>
  <div
    class="fixed left-0 bottom-0 h-1 bg-green-600 z-50 transition-[width] duration-0"
    :style="{ width: progress + '%' }"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const progress = ref(0);

const updateProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  progress.value = (scrollTop / scrollHeight) * 100;
};

onMounted(() => {
  window.addEventListener("scroll", updateProgress);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
});
</script>
