<script setup>

const props = defineProps({
  label: String,
  type: String,
  placeholder: String,
  customClasses: String,
  modelValue: [String, Number],
  required: {
    type: Boolean,
    default: false
  },


})
const emit = defineEmits(['update:modelValue'])
const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

</script>

<template>
  <div :class="customClasses">
    <label class="mb-2.5 block text-black dark:text-white capitalize">
      {{ label }}
      <span v-if="required" class="text-meta-1">*</span>
    </label>
    <input :type="type" :value="props.modelValue" :placeholder="placeholder"
      class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" 
      @input="updateValue" />
  </div>
</template>
