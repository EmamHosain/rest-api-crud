<script setup>
import DefaultCard from '@/components/Forms/DefaultCard.vue';
import InputGroup from '@/components/Forms/InputGroup.vue';
import SelectGroupTwo from '@/components/Forms/SelectGroup/SelectGroupTwo.vue';
import useProduct from '@/composables/useProduct';
import ValidationError from '@/components/auth/ValidationError.vue';
import { reactive, ref, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const { createProduct, imageFile, imageURL } = useProduct();

const store = useAuthStore();
const errors = computed(() => store.errors)

const formData = reactive({
    productName: 'product name',
    shortDescription: 'short description',
    price: '43',
    productQuantity: '43',
    image: '',
})




const handleImage = (event) => {
    if (event.target.files.length === 0) {
        imageURL.value = ''
        formData.image = ''
        return;
    }
    formData.image = event.target.files[0]
    imageFile.value = event.target.files[0]
}

watch(imageFile, (newImageFile) => {
    if (!(newImageFile instanceof File)) {
        document.getElementById('image').value = ''
        return;
    }
    let fileReader = new FileReader();
    fileReader.readAsDataURL(newImageFile)
    fileReader.addEventListener('load', () => {
        imageURL.value = fileReader.result;
    })
})



</script>

<template>
    <div class="flex flex-col">
        <!-- Contact Form Start -->
        {{ formData }}
        <DefaultCard cardTitle="Contact Form" :link="'view products'">
            <form @submit.prevent="createProduct(formData)">
                <div class="p-6.5">
                    <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div class="w-full">
                            <InputGroup v-model="formData.productName" label="Product name" type="text"
                                placeholder="Enter product name" customClasses="w-full" />
                            <ValidationError :errors="errors ? errors.product_name : []" />
                        </div>

                        <div class="w-full">
                            <InputGroup v-model="formData.price" label="product price" type="number"
                                placeholder="Enter product price" customClasses="w-full" />
                            <ValidationError :errors="errors ? errors.price : []" />


                        </div>
                    </div>

                    <div class="mb-4.5">
                        <InputGroup v-model="formData.productQuantity" label="product quantity" type="number"
                            placeholder="Enter product quantity" />
                        <ValidationError :errors="errors ? errors.product_quantity : []" />

                    </div>

                    <div class="mb-6">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white capitalize">
                            product image
                        </label>

                        <input @change="handleImage" type="file"
                            class="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-normal focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white cursor-pointer"
                            accept="image/*" id="image"  />

                        <div>
                            <ValidationError :errors="errors ? errors.image : []" />
                        </div>
                    </div>

                    <div class="mb-6" v-show="imageURL">
                        <img width="150" height="100" :src="imageURL" alt="">
                    </div>

                    <div class="mb-6">
                        <label class="mb-2.5 block text-black dark:text-white capitalize"> short description </label>
                        <textarea v-model="formData.shortDescription" rows="6" placeholder="Type short description"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
                        <div>
                            <ValidationError :errors="errors ? errors.short_description : []" />
                        </div>
                    </div>

                    <button type="submit"
                        class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 capitalize">
                        add product
                    </button>
                </div>
            </form>
        </DefaultCard>
        <!-- Contact Form End -->
    </div>
</template>