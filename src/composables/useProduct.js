import { getHeaderConfig } from "@/helpers/headerConfig";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";
import useTost from "./useToast";
import { ref } from "vue";
import router from "@/router";

export default function useProduct() {

    const imageFile = ref('');
    const imageURL = ref('');

    const { success, error } = useTost();
    const productStore = useProductStore();
    const store = useAuthStore();


    const getCsrfCookie = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.log(error)
        }
    }

    const getProducts = async (page = 1) => {
        store.errors = null;
        store.setOnProgressbar();

        try {
            await getCsrfCookie()
            const res = await axios.get(`/api/products?page=${page}`, getHeaderConfig(store.access_token));
            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)

                // Scroll to the top of the #product div
                const productDiv = document.getElementById('product');
                if (productDiv) {
                    productDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } catch (error) {
            store.setOffProgressbar();
            console.log('get products error', error)
        }
    }


    const deleteProduct = async (id) => {
        store.errors = null;
        store.setOnProgressbar();

        const confirm = window.confirm('Are you sure?');
        if (!confirm) {
            store.setOffProgressbar();
            return;
        }

        try {
            await getCsrfCookie();
            const res = await axios.delete(`/api/products/${id}`, getHeaderConfig(store.access_token));
            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)
                success('Product deleted successfully.')
            }
        } catch (error) {
            store.setOffProgressbar();
            // error('Something went wrong')
            console.log('product delete error', error)
        }
    }





    const createProduct = async (data) => {
        store.errors = null;
        store.setOnProgressbar();


        const formData = new FormData();
        formData.append('product_name', data.productName);
        formData.append('short_description', data.shortDescription);
        formData.append('price', data.price);
        formData.append('product_quantity', data.productQuantity);
        formData.append('image', data.image);


        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/products/`, formData, getHeaderConfig(store.access_token));

            if (parseInt(res.status) === 201) {
                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)
                store.setOffProgressbar();

                // reset form data
                data.productName = ''
                data.shortDescription = ''
                data.price = ''
                data.productQuantity = ''
                data.image = ''
                imageFile.value = ''
                imageURL.value = ''
                document.getElementById('image').value = ''
                success('Product created successfully.')

            }
        } catch (error) {
            store.setOffProgressbar();
            // error('Something went wrong')
            console.log('product create error', error)
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }
        }
    }



    const selectProductForUpdate = async (id) => {
        store.errors = null;
        store.setOnProgressbar();
        productStore.selectedProduct = null
        try {
            await getCsrfCookie();
            const res = await axios.get(`/api/products/${id}`, getHeaderConfig(store.access_token));
            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                productStore.setSelectedProduct(res.data.data);
                router.push({ name: 'update-product-page' })
            }
        } catch (error) {
            store.setOffProgressbar();
            console.log('error', error)
        }

    }




    const updateProduct = async (data) => {
        store.errors = null;
        productStore.selectedProduct = null
        store.setOnProgressbar();
        
        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('product_name', data.productName);
        formData.append('short_description', data.shortDescription);
        formData.append('price', data.price);
        formData.append('product_quantity', data.productQuantity);

        if (data.image) {
            formData.append('image', data.image);
        }

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/products/${data.id}`, formData, getHeaderConfig(store.access_token));

            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                const products = productStore.getProducts.map((item, index, array) => {
                    if (item.id == res.data.data.id) {
                        return res.data.data // Replace the item with updated data
                    } else {
                        return item; // Keep other items unchanged
                    }
                })
                productStore.setProduct(products)
                productStore.selectedProduct = null
                success('Product updated successfully.')
                router.push({ name: 'view-products-page' })
            }


        } catch (error) {
            store.setOffProgressbar();
            console.log('error', error)
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }
        }
    }

    return { getProducts, deleteProduct, createProduct, selectProductForUpdate, updateProduct, imageFile, imageURL }
}