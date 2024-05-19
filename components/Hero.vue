<script setup lang="ts">
type Props = {
  content: string;
  roles: string[];
};

const props = defineProps<Props>();

const stringifiedRoles = computed(() => props.roles.join(" • "));
</script>

<template>
  <section class="text-center pt-[calc(65px+50px)] xl:pt-[150px] pb-[70px]">
    <div class="uppercase font-bold text-3xl lg:text-5xl tracking-wide mb-4">
      {{ content }}
    </div>
    <p
      class="text-[10px] lg:text-xs text-gray-500 dark:text-gray-300 uppercase tracking-widest"
    >
      {{ stringifiedRoles }}
    </p>
  </section>
</template>
