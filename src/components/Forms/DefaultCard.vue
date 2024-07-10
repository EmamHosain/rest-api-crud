<script setup>
import { RouterLink } from 'vue-router';
const props = defineProps({
  cardTitle: String,
  link: {
    type: String,
    default: null,
  }

})
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
      <h3 class="font-medium text-black dark:text-white">{{ props.cardTitle }}</h3>
      <router-link v-if="link !== ''" :to="{ name: 'view-products-page' }"
        class="text-sm px-4 py-1.5 bg-green-500 rounded-md text-white capitalize">{{ link }}</router-link>
    </div>
    <slot></slot>
  </div>
</template>
