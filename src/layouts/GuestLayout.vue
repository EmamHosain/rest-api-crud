<script setup>
import { RouterView } from 'vue-router';
import Navbar from '../components/shortComponent/Navbar.vue'

</script>
<template>
    <header>
        <!-- <Navbar/> -->
    </header>


    <main class="container mx-auto">
        <router-view></router-view>
    </main>


    <footer>
        <!-- <h1>footer</h1> -->
    </footer>
</template>