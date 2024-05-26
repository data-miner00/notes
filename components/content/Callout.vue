<script setup lang="ts">
type CalloutType = "info" | "warning" | "error";
type Props = {
  type: CalloutType;
  title: string;
};

const props = defineProps<Props>();

const icon = computed(() => {
  return props.type === "info"
    ? "bi-info-circle"
    : props.type === "warning"
    ? "bi-exclamation-triangle"
    : "bi-x-lg";
});

const textColor = computed(() => {
  return props.type === "info"
    ? "text-blue-500 dark:text-blue-200"
    : props.type === "warning"
    ? "text-yellow-500 dark:text-yellow-200"
    : "text-red-500 dark:text-red-200";
});

const bgColor = computed(() => {
  return props.type === "info"
    ? "bg-blue-100 dark:bg-blue-700/30"
    : props.type === "warning"
    ? "bg-yellow-100 dark:bg-yellow-700/30"
    : "bg-red-100 dark:bg-red-700/30";
});

const borderColor = computed(() => {
  return props.type === "info"
    ? "border-blue-200 dark:!border-blue-700"
    : props.type === "warning"
    ? "border-yellow-200 dark:!border-yellow-700"
    : "border-red-200 dark:!border-red-700";
});
</script>

<template>
  <blockquote
    class="rounded border border-solid not-italic py-3 pr-3 pl-6"
    :class="[bgColor, borderColor]"
  >
    <header class="font-semibold" :class="textColor">
      <i class="bi" :class="icon"></i> {{ title }}
    </header>
    <section class="">
      <slot />
    </section>
  </blockquote>
</template>
