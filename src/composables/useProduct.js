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



    const getProducts = async (page = 1) => {
        store.errors = null;
        store.setOnProgressbar();



        try {
            await getCsrfCookie()
            const res = axios.get(`/api/products?page=${page}`, getHeaderConfig(store.access_token));
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


    const getEventsUsingPagination = async (page = 1) => {
        const store = useAuthStore();
        const eventStore = useEventStore();
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.get(`/api/events?page=${page}`, getHeaderConfig(store.access_token));
            if (res.status == 200) {
                // eventStore.setEvents(res.data.data)
                // eventStore.eventLinks = res.data.meta
                // eventStore.setEvents(res.data.data)
                eventStore.eventwithPagination = res.data

            }
        } catch (error) {
            console.error(error);
        }
    }







    return { getProducts }
}