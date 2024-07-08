<script setup>
import { useAuthStore } from "@/stores/useAuthStore";


const store = useAuthStore();
</script>
<template>
    <div class="mt-5 ml-5 w-1/3 shadow-sm p-4 text-center shadow-black" style="margin:4rem auto">
        <p>Name : {{ store.user.name }}</p>
        <p>Email : {{ store.user.email }}</p>
    </div>
</template>