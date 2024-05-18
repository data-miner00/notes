<script setup lang="ts">
type Props = {
  content: string;
  roles: string[];
};

const props = defineProps<Props>();

const stringifiedRoles = computed(() => props.roles.join(" • "));
</script>

<template>
  <section class="text-center xl:pt-[150px] xl:pb-[70px]">
    <div class="uppercase font-bold text-5xl tracking-wide mb-4">
      {{ content }}
    </div>
    <p class="text-xs text-gray-500 uppercase tracking-widest">
      {{ stringifiedRoles }}
    </p>
  </section>
</template>
