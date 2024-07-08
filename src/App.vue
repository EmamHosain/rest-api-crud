<script setup>
import { onBeforeMount, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import useAuth from './composables/useAuth';
import { useAuthStore } from './stores/useAuthStore';
import Preloader from './components/auth/Preloader.vue';
import Progressbar from './components/auth/Progressbar.vue';


const { getUser } = useAuth();
const store = useAuthStore();


onBeforeMount(async () => {
  await store.setStartPreloader();
})


onMounted(async () => {
  if (store.access_token) {
    await getUser();
    await store.setEndPreloader();
  }
  await store.setEndPreloader();
})


</script>

<template>
  <div>
    <div>
      <Progressbar v-if="store.progressbar" />
    </div>

    <div v-if="store.preloader">
      <Preloader :is-loading="store.preloader" />
    </div>


    <RouterView v-else />
  </div>
</template>

<style scoped></style>
