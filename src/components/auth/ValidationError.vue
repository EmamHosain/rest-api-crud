<script setup>


const props = defineProps({
    errors: Array,
})

</script>
<template>
    <div v-if="props.errors">
        <p v-for="error, index in errors" :key="index" class="text-red text-sm">{{ error }}</p>
    </div>
</template>