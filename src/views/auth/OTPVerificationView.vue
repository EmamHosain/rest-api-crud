<script setup>
import { reactive, computed } from "vue";
import ValidationError from "@/components/auth/ValidationError.vue";
import useAuth from "@/composables/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";
import SpinnerButton from "@/components/auth/SpinnerButton.vue";
const { verifyEmailByOTP } = useAuth();
const store = useAuthStore();
const errors = computed(() => store.errors)


const data = reactive({
    loading: false,
    user: {
        otp: '',
    }
})

console.log(typeof(store.canSeeResetPassPage))
console.log(typeof(store.canSeeEmailVerifyPage))

</script>


<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verify your email with
                otp code
            </h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="verifyEmailByOTP(data)">
                <div>
                    <label for="otp" class="block text-sm font-medium leading-6 text-gray-900">OTP code</label>
                    <div class="mt-2">
                        <input v-model="data.user.otp" id="otp" type="text" placeholder="Enter OTP code"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset px-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    </div>
                    <!-- <p v-if="errors" class="text-red-400 text-sm">{{ errors.email[0] }}</p> -->
                    <validation-error v-if="errors" :errors="errors.otp ?? errors"></validation-error>
                </div>



                <div>
                    <spinner-button v-if="data.loading"></spinner-button>
                    <button v-else type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Continue</button>
                </div>
            </form>


        </div>
    </div>
</template>