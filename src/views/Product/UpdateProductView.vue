<script setup>
import useProduct from '@/composables/useProduct';
import ProductForm from '@/components/productForm/ProductForm.vue';
import { useProductStore } from '@/stores/useProductStore';
import { computed, reactive, ref, watch } from 'vue';
const productStore = useProductStore();
const selectedProduct = computed(() => productStore.getSelectedProduct)

const formData = reactive({
    productName: selectedProduct.value.title,
    price: selectedProduct.value.price,
    productQuantity: selectedProduct.value.product_quantity,
    shortDescription: selectedProduct.value.short_des,
    id :  selectedProduct.value.id,

})
const imageURL = ref(selectedProduct.value.image)
const { updateProduct, imageFile } = useProduct();

const handleImageChange = (event) => {
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
    <ProductForm :form-data="formData" :image-url="imageURL" :button-label="'update product'"
        :heading-label="'Update Product'" @handle-image="handleImageChange" :submit-function="updateProduct" />
</template>