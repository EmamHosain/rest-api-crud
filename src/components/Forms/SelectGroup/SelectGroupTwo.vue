<script setup>
import { ref } from 'vue'

// const props = defineProps({
  
// });



const selectedOption = ref('')
const isOptionSelected = ref(false)
const changeTextColor = () => {
  isOptionSelected.value = true
}
</script>

<template>
  <div class="mb-4.5">
    <label class="mb-2.5 block text-black dark:text-white"> Subject </label>
    <div class="relative z-20 bg-transparent dark:bg-form-input">
      <select v-model="selectedOption"
        class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        :class="{ 'text-black dark:text-white': isOptionSelected }" @change="changeTextColor">
        <option value="" disabled selected>Select your subject</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        <option value="Canada">Canada</option>
      </select>
    </div>
  </div>
</template>
