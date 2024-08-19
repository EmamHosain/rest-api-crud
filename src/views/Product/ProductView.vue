<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { TailwindPagination } from 'laravel-vue-pagination';
import InputGroup from '@/components/Forms/InputGroup.vue';
import ValidationError from '@/components/auth/ValidationError.vue';
import { RouterLink } from 'vue-router'
import useProduct from '@/composables/useProduct'
import { useProductStore } from '@/stores/useProductStore'
import { useAuthStore } from '@/stores/useAuthStore';

const { getProducts, deleteProduct, selectProductForUpdate, createProduct, updateProduct } = useProduct();

const store = useAuthStore();
const errors = computed(() => store.getErrors);
const productStore = useProductStore();
const formData = reactive({
    product_name: '',
    brand: '',
    price: '',
    quantity: '',
    description: '',
    alert_stock: '',
    image: '',
})
const imageURL = ref(null);
const imageFile = ref(null);
const handleImage = (event) => {
    if (event.target.files.length === 0) {
        imageURL.value = null
        formData.image = ''
        return;
    }
    imageFile.value = event.target.files[0]
    formData.image = event.target.files[0]
}
watch(imageFile, (newImageFile) => {
    if (!(newImageFile instanceof File)) {
        document.getElementById('image').value = ''
        return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(newImageFile);
    fileReader.addEventListener('load', () => {
        imageURL.value = fileReader.result;
    });
});






const productCreate = ref(false);
const productEdit = ref(false);

const handleClose = () => {
    productStore.setOffProductDialog();
}
const handleDialogOpen = () => {
    imageURL.value = null
    store.errors = null
    productStore.setOnProductDialog();
}
const handleProductCreate = () => {
    const image = document.getElementById('image');
    if (image && image.value) {
        image.value = ''
    }

    formData.product_name = ''
    formData.price = ''
    formData.brand = ''
    formData.description = ''
    formData.alert_stock = ''
    formData.quantity = ''


    productCreate.value = true;
    productEdit.value = false;
    handleDialogOpen();
}

const handleProductEdit = async (id) => {
    imageURL.value = null
    store.errors = null
    productCreate.value = false;
    productEdit.value = true;
    await selectProductForUpdate(id)
    const product = productStore.selectedProduct;
    if (product) {
        formData.product_name = product.product_name
        formData.price = product.price
        formData.brand = product.brand
        formData.description = product.description
        formData.alert_stock = product.alert_stock
        formData.quantity = product.quantity
        formData['id'] = id



        imageURL.value = product.image
    }
    productStore.setOnProductDialog();
}





</script>

<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        id="product">
        <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
            <h4 class="text-xl font-bold text-black dark:text-white">All Products</h4>
            <button @click="handleProductCreate" type="button"
                class="text-sm px-4 py-1.5 bg-green-500 rounded-md text-white capitalize">Add
                Product</button>
        </div>


        <!--product table start here -->


        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            si
                        </th>
                        <th scope="col" class="px-16 py-3">
                            image
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            brand
                        </th>
                        <th scope="col" class="px-6 py-3">
                            description
                        </th>
                        <th scope="col" class="px-6 py-3">
                            price
                        </th>
                        <th scope="col" class="px-6 py-3">
                            quantity
                        </th>
                        <th scope="col" class="px-6 py-3">
                            alert stock
                        </th>
                        <th scope="col" class="px-6 py-3">
                            created by
                        </th>
                        <th scope="col" class="px-6 py-3">
                            updated by
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product, index in productStore.getProducts" :key="index"
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="px-6 py-4">
                            {{ index + 1 }}
                        </td>

                        <td class="p-4">
                            <img :src="product.image" class="w-16 md:w-32 h-20  max-w-full max-h-full"
                                :alt="product.product_name">

                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {{ product.product_name }}
                        </td>
                        <td class="px-6 py-4">
                            {{ product.brand }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {{ product.description }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {{ product.price }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {{ product.quantity }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">

                            <span v-if="product.quantity < product.alert_stock" class=" text-red whitespace-nowrap">
                                quantity > {{ product.alert_stock }}
                            </span>
                            <span v-else class=" text-green-500">
                                {{ product.alert_stock }}
                            </span>
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {{ product.created_by }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            <span class=" text-green-500" v-if="product.updated_by !== null">
                                {{ product.updated_by }}
                            </span>
                            <span class=" text-red" v-else>
                                empty
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button @click="handleProductEdit(product.id)" type="button"
                                class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</button>

                            <button @click="deleteProduct(product.id)" type="button"
                                class="focus:outline-none text-white bg-red  focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Delete</button>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>

        <!-- product table end here -->


        <!-- pagination start here -->
        <div v-if="productStore.getOnShowProductsPaginate" class="my-8 text-center">
            <TailwindPagination :data="productStore.productsWithPaginate" @pagination-change-page="getProducts" />
        </div>
        <!-- paginatgion end here -->






        <!--product add and update dialog  start here-->
        <el-dialog v-model="productStore.productDialog" :title="productCreate ? 'Add Product' : 'Edit Product'" width="900"
            :before-close="handleClose">
            <!-- form start here -->
            <form @submit.prevent="productCreate ? createProduct(formData) : updateProduct(formData)"
                enctype="multipart/form-data" class="">
                <div class="flex sm:flex-wrap md:flex-nowrap gap-4">
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup label="Product Name" type="text" placeholder="Enter product name" customClasses="w-full"
                            v-model="formData.product_name" />
                        <ValidationError :errors="errors && errors.product_name ? errors.product_name : []" />
                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup label="Brand" type="text" placeholder="Enter brand" v-model="formData.brand"
                            customClasses="w-full" />
                        <ValidationError :errors="errors && errors.brand ? errors.brand : []" />
                    </div>
                </div>

                <div class="flex sm:flex-wrap md:flex-nowrap gap-4">
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup label="Price" type="text" v-model="formData.price" placeholder="Enter price"
                            customClasses="w-full" />
                        <ValidationError :errors="errors && errors.price ? errors.price : []" />

                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup label="Quantity" v-model="formData.quantity" type="number" placeholder="Enter quantity"
                            customClasses="w-full" />
                        <ValidationError :errors="errors && errors.quantity ? errors.quantity : []" />

                    </div>
                </div>

                <div class="flex sm:flex-wrap md:flex-nowrap gap-4">
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup label="Alert stock" v-model="formData.alert_stock" type="number"
                            placeholder="Enter alert stock" customClasses="w-full" />
                        <ValidationError :errors="errors && errors.alert_stock ? errors.alert_stock : []" />

                    </div>

                    <div class="mb-6 w-full">
                        <label class="mb-3 block text-sm font-medium text-black dark:text-white capitalize">
                            product image
                        </label>

                        <input type="file"
                            class="w-full rounded-md border border-stroke p-2.5 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-normal focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white cursor-pointer"
                            accept="image/*" id="image" @change="handleImage" />

                        <div>
                            <ValidationError :errors="errors && errors.image ? errors.image : []" />
                        </div>

                        <div v-if="imageURL">
                            <!-- show image -->
                            <img class=" h-20 w-25" :src="imageURL" alt="">
                        </div>
                    </div>
                </div>


                <div class="mb-6">
                    <label class="mb-2.5 block text-black dark:text-white capitalize"> Product description </label>
                    <textarea rows="6" placeholder="Type product description" v-model="formData.description"
                        class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"></textarea>
                    <div>
                        <ValidationError :errors="errors && errors.description ? errors.description : []" />
                    </div>
                </div>
                <div class="flex gap-4">
                    <button type="submit"
                        class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{{
                            productCreate ? 'Add Product' : 'Update Product' }}</button>
                    <button type="button" @click="handleClose"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
                </div>
            </form>

            <!-- form end here -->
        </el-dialog>

        <!-- product add and update dialog end here -->






    </div>
</template>
