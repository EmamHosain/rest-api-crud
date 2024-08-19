
import { useAuthStore } from "@/stores/useAuthStore";
import { useProductStore } from "@/stores/useProductStore";
import useUser from "@/composables/useUser";
import { useUserStore } from "@/stores/useUserStore";
import useProduct from "@/composables/useProduct";

export default function authRouteHelper() {
    const checkIfUserIsLoggedIn = (to, from, next) => {
        const store = useAuthStore();
        if (store.getToken) {
            next('/');
        } else {
            next();
        }
    }

    const checkIfUserIsNotLoggedIn = (to, from, next) => {
        const store = useAuthStore();
        if (store.getToken === null) {
            next('/login');
        } else {
            next();
        }
    }



    const registerNavigationAttempt = (to, from, next) => {
        const store = useAuthStore();
        store.errors = null
        next();
    }



    const loginNavigationAttempt = (to, from, next) => {
        const store = useAuthStore();
        store.errors = null
        // store.setClearResetPassPageSeeLogic();
        next();
    }

    const ifNotSelectProduct = (to, from, next) => {
        const productStore = useProductStore();
        if (!productStore.selectedProduct) {
            next('/products');
        } else {
            next();
        }

    }



    const { getUsers } = useUser();
    const userPageLoadBeforeGetUserData = async (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.users.length === 0) {
            await getUsers();
            next();
        } else {
            next();
        }

    }



    const { getProducts } = useProduct();
    const userProductPageLoadBeforeGetProducts = async (to, from, next) => {
        const productStore = useProductStore();
        if (productStore.getProducts.length === 0) {
            await getProducts();
            next();
        } else {
            next();
        }

    }












    return {
        checkIfUserIsLoggedIn,
        checkIfUserIsNotLoggedIn,
        registerNavigationAttempt,
        loginNavigationAttempt,
        ifNotSelectProduct,
        userPageLoadBeforeGetUserData,
        userProductPageLoadBeforeGetProducts
    }
}