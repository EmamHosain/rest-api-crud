<script setup>
import DefaultCard from '@/components/Forms/DefaultCard.vue';
import InputGroup from '@/components/Forms/InputGroup.vue';
import SelectGroupTwo from '@/components/Forms/SelectGroup/SelectGroupTwo.vue';
import useProduct from '@/composables/useProduct';
import ValidationError from '@/components/auth/ValidationError.vue';

import ProductForm from '../../components/productForm/ProductForm.vue'
import { reactive, ref, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';


const { createProduct, imageFile, imageURL } = useProduct();
const store = useAuthStore();
const errors = computed(() => store.errors)

const formData = reactive({
    productName: 'product',
    shortDescription: 'description',
    price: '43',
    productQuantity: '43',
    image: '',
})




const handleImageChange = (event) => {
    console.log(event.target.files)
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
    <ProductForm :form-data="formData" :image-url="imageURL" :button-label="'add product'" :heading-label="'Add Product'"
        @handle-image="handleImageChange" :submit-function="createProduct" />
</template>