import { getHeaderConfig } from "@/helpers/headerConfig";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";
import useTost from "./useToast";

export default function useProduct() {

    const { success, error } = useTost();


    const getCsrfCookie = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.log(error)
        }
    }

    const getProducts = async (page = 1) => {
        const store = useAuthStore();
        const productStore = useProductStore();

        store.errors = null;
        store.setOnProgressbar();
        try {
            await getCsrfCookie()
            const res = await axios.get(`/api/products?page=${page}`, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {

                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)
                productStore.setOnShowProductsPaginate(res.data.data.meta.last_page);
                store.setOffProgressbar();
                // Scroll to the top of the #product div
                // const productDiv = document.getElementById('product');
                // if (productDiv) {
                //     productDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // }
            }
        } catch (error) {
            store.setOffProgressbar();
            console.log('get products error', error)
        } finally {
            store.setOffProgressbar();
        }
    }


    const deleteProduct = async (id) => {

        const store = useAuthStore();
        const productStore = useProductStore();
        store.setOnProgressbar();

        const confirm = window.confirm('Are you sure?');
        if (!confirm) {
            store.setOffProgressbar();
            return;
        }

        try {
            await getCsrfCookie();
            const res = await axios.delete(`/api/products/${id}`, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)
                success('Product Deleted successfully.')
            }
        } catch (er) {
            store.setOffProgressbar();
            error('Something went wrong')
            console.log('product delete error', er)
        } finally {
            store.setOffProgressbar();
        }
    }





    const createProduct = async (data) => {

        const store = useAuthStore();
        store.errors = null;
        store.setOnProgressbar();
        const user = store.getUser;
        const productStore = useProductStore();

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('created_by', user.id);
        formData.append('product_name', data.product_name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('quantity', data.quantity);
        formData.append('image', data.image);
        formData.append('alert_stock', data.alert_stock);
        formData.append('brand', data.brand);




        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/products/`, formData, getHeaderConfig(store.getToken));

            if (parseInt(res.status) === 201) {
                productStore.setProduct(res.data.data.data)
                productStore.setProductWithPaginate(res.data.data)

                console.log(res.data);
                store.setOffProgressbar();
                success(res.data.message);
                // reset form data
                data.brand = ''
                data.product_name = ''
                data.description = ''
                data.price = ''
                data.quantity = ''
                data.image = ''
                data.alert_stock = ''
                document.getElementById('image').value = ''
                productStore.setOffProductDialog();
            }
        } catch (error) {
            store.setOffProgressbar();
            // error('Something went wrong')
            console.log('product create error', error)
            if (error.response && parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }
        } finally {
            store.setOffProgressbar();
        }
    }



    const selectProductForUpdate = async (id) => {
        const store = useAuthStore();
        const productStore = useProductStore();
        store.errors = null;
        store.setOnProgressbar();
        productStore.selectedProduct = null
        try {
            await getCsrfCookie();
            const res = await axios.get(`/api/products/${id}`, getHeaderConfig(store.access_token));
            if (parseInt(res.status) === 200) {
                productStore.setSelectedProduct(res.data.data);
                store.setOffProgressbar();
            }
        } catch (error) {
            store.setOffProgressbar();
            console.log('error', error)
        }

    }




    const updateProduct = async (data) => {
        console.log(data);
        const store = useAuthStore();
        const productStore = useProductStore();
        store.errors = null;
        store.setOnProgressbar();

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('product_name', data.product_name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('quantity', data.quantity);
        formData.append('brand', data.brand);
        formData.append('alert_stock', data.alert_stock);
        formData.append('user_id', store.user.id);
        formData.append('updated_by', store.user.id);

        if (data.image) {
            formData.append('image', data.image);
        }

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/products/${data.id}`, formData, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                const updatedProduct = res.data.data
                const products = productStore.getProducts.map((item, index, array) => {
                    if (item.id == updatedProduct.id) {
                        return updatedProduct // Replace the item with updated data
                    } else {
                        return item; // Keep other items unchanged
                    }
                })
                productStore.setProduct(products)
                productStore.selectedProduct = null
                store.setOffProgressbar();
                productStore.setOffProductDialog();
                success(res.data.message);
            }


        } catch (error) {
            store.setOffProgressbar();
            console.log('error', error)
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }
        } finally {
            store.setOffProgressbar();
        }
    }

    return { getProducts, deleteProduct, createProduct, selectProductForUpdate, updateProduct }
}