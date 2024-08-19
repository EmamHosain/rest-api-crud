import axios from "axios";
import { ref } from "vue";
import { getHeaderConfig } from "@/helpers/headerConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import useTost from "./useToast";
import router from "@/router";
import useProduct from "./useProduct";


export default function useAuth() {

    const store = useAuthStore();
    const { success, error } = useTost();
    const { getProducts } = useProduct();


    const getCsrfCookie = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async () => {
        try {
            await getCsrfCookie();
            const res = await axios.get('/api/users-with-token', getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                store.setToken(res.data.token);
                store.setUser(res.data.user)
            }
        } catch (error) {
            store.clearStoredData();
            router.push({ name: 'login-page' })
            console.log(error)
        }
    }



    const login = async (data) => {
        store.clearErrors();
        store.setOnProgressbar();
        try {
            await getCsrfCookie();
            const res = await axios.post('/api/login', data.user);

            if (parseInt(res.status) === 200) {
                store.setToken(res.data.token)
                store.setOffProgressbar();
                store.setStartPreloader();
                await getUser();
                store.setEndPreloader();
                success(res.data.message);
                router.push({ name: 'home-page' })

            }

        } catch (error) {

            store.setOffProgressbar();
            console.log('login', error);
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }


        }
    };

    const register = async (data) => {
        store.clearErrors();
        store.setOnProgressbar();
        if (data.user.password !== data.user.password_confirmation) {
            error('Password not match')
            return;
        }
        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/register`, data.user);
            if (parseInt(res.status) === 201) {
                // token set
                store.setToken(res.data.token)
                // get user by token
                // await getUser();
                store.setOffProgressbar();
                success(res.data.message);
                store.setEndPreloader();

                // redirect to home page
                router.push({ name: 'home-page' })

            }
        } catch (error) {
            store.setOffProgressbar();
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }



    const logout = async () => {
        store.setOnProgressbar();
        try {
            await getCsrfCookie();
            const res = await axios.post('/api/logout', '', getHeaderConfig(store.access_token));
            if (parseInt(res.status) === 200) {
                console.log('logout status', true);
                store.clearStoredData();
                store.setOffProgressbar();
                success('User logout successfully');
                router.push({ name: 'login-page' })

            } else {
                // console.log('logout status', false);
                store.setOffProgressbar();

            }

        } catch (error) {
            store.setOffProgressbar();
            console.error('Logout failed:', error);
        }
    };











    const forgetPassword = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/forgot-password`, {
                email: data.user.email
            });
            data.loading = false;

            if (parseInt(res.status) === 200) {
                data.user.email = ''
                store.setOffProgressbar();
                success(res.data.message);
                console.log('forgot password success', res);
                // store.setCanSeeEmailVerifyPage(true);
                // router.push({name:'reset-password-page'})
                store.setOffProgressbar();
            }
        } catch (error) {
            store.setOffProgressbar();
            data.loading = false;
            console.log('forgot password error', error);
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }

    const resetPassword = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();
        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/reset-password`, data.user);
            data.loading = false;

            if (parseInt(res.status) === 200) {
                store.setOffProgressbar();
                success(res.data.message);
                store.setCanSeeResetPassPage(false);
                store.setCanSeeEmailVerifyPage(false)
                router.push({ name: 'login-page' })
            }
            if (parseInt(res.status) === 400) {
                store.setOffProgressbar();
                error(res.data.message);
                // store.setCanSeeResetPassPage(false);
                // store.setCanSeeEmailVerifyPage(false)
                // router.push({ name: 'login-page' })
            }


        } catch (error) {
            store.setOffProgressbar();
            data.loading = false;
            if (parseInt(error.response.status) === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }






    return {
        login,
        logout,
        register,
        forgetPassword,
        resetPassword,
        getUser
    };
}