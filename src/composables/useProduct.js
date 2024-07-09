import { getHeaderConfig } from "@/helpers/headerConfig";
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";

export default function useProduct() {

    const productStore = useProductStore();
    const store = useAuthStore();
    const getCsrfCookie = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.log(error)
        }
    }



    const getProducts = async () => {
        store.errors = null;
        store.setOnProgressbar();

        try {
            await getCsrfCookie()
            const res = axios.get('/api/products', getHeaderConfig(store.access_token));
            res.then((value) => {
                if (parseInt(value.status) === 200) {
                    store.setOffProgressbar();
                    productStore.setProduct(value.data.data.data)
                    productStore.setProductWithPaginate(value.data.data)
                }

            }).catch((error) => {
                store.setOffProgressbar();
                console.log('error', error)
            })

        } catch (error) {
            store.setOffProgressbar();
            console.log('get products error', error)
        }
    }


    return { getProducts }
}