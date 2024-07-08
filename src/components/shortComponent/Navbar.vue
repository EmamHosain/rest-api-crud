<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import useAuth from '@/composables/useAuth';
const store = useAuthStore();
const { logout } = useAuth();

</script>

<template>
    <div class="text-gray-600 body-font">
        <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                    viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span class="ml-3 text-xl">Tailblocks</span>
            </a>

            <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                <template v-if="store.user">
                    <router-link :to="{ name: 'home-page' }" class="mr-5 hover:text-gray-900">Home</router-link>
                    <router-link :to="{ name: 'about-page' }" class="mr-5 hover:text-gray-900">About</router-link>
                    <router-link :to="{ name: 'profile-page' }" class="mr-5 hover:text-gray-900">Profile</router-link>
                </template>

                <template v-else>
                    <router-link :to="{ name: 'login-page' }" class="mr-5 hover:text-gray-900">Login</router-link>
                    <router-link :to="{ name: 'register-page' }" class="mr-5 hover:text-gray-900">Register</router-link>
                </template>
            </nav>
            <button v-if="store.user" @click="logout"
                class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Logout
            </button>
        </div>
    </div>
</template>