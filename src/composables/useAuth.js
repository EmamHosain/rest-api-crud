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
            const res = await axios.get('/api/users', getHeaderConfig(store.access_token));
            if (res.data.success === true) {
                store.setToken(res.data.access_token);
                store.setUser(res.data.user)
            }
        } catch (error) {
            store.clearStoredData();
            router.push({ name: 'login-page' })
            console.log(error)
        }
    }



    const login = async (data) => {
        data.loading = true;
        store.errors = null;
        store.setOnProgressbar();

        try {
            await getCsrfCookie();
            const res = await axios.post('/api/login', data.user);
            data.loading = false;

            if (res.data.success === true) {
                store.setToken(res.data.access_token)
                store.setOffProgressbar();
                store.setStartPreloader();
                await getUser();
                await getProducts();
                success(res.data.message);
                router.push({ name: 'home-page' })
                store.setEndPreloader();

            }


        } catch (error) {
            data.loading = false;
            store.setOffProgressbar();
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }
    };




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
                console.log('logout status', false);
                store.setOffProgressbar();

            }

        } catch (error) {
            store.setOffProgressbar();
            console.error('Logout failed:', error);
        }
    };








    const register = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();


        if (data.user.password !== data.user.password_confirmation) {
            error('Password not match')
            data.loading = false;
            return;
        }

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/register`, data.user);
            data.loading = false;

            if (res.data.success === true) {
                success(res.data.message);
                store.setOffProgressbar();
                router.push({ name: 'login-page' })

            }
        } catch (error) {
            data.loading = false;
            store.setOffProgressbar();
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }



    const forgetPassword = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();

        try {
            await getCsrfCookie();
            const res = await axios.put(`/api/forget-password`, {
                email: data.user.email
            });
            data.loading = false;

            if (res.data.success === true) {
                store.setOffProgressbar();
                success(res.data.message);
                store.setCanSeeEmailVerifyPage(true);
                router.push({ name: 'otp-verify-page' })

            }
        } catch (error) {
            store.setOffProgressbar();
            data.loading = false;
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }

    const verifyEmailByOTP = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/email-verify`, {
                otp: data.user.otp
            });
            data.loading = false;

            if (res.data.success === true) {
                store.setOffProgressbar();
                store.setCanSeeEmailVerifyPage(false);
                store.setCanSeeResetPassPage(true);
                success(res.data.message);
                router.push({ name: 'reset-password-page' })

            }
            if (res.data.success === false) {
                // success(res.data.message);
                // router.push({ name: 'reset-password-page' })
                store.setOffProgressbar();
                const errorArray = ['Invalid credentials'];
                store.setErrors(errorArray);
            }

        } catch (error) {
            data.loading = false;
            store.setOffProgressbar();
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }

    const resetPassword = async (data) => {
        data.loading = true;
        store.clearErrors();
        store.setOnProgressbar();

        // console.log(data)
        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/reset-password`, {
                password: data.user.password
            });
            data.loading = false;

            if (res.data.success === true) {
                store.setOffProgressbar();
                success(res.data.message);
                store.setCanSeeResetPassPage(false);
                store.setCanSeeEmailVerifyPage(false)
                router.push({ name: 'login-page' })
            }
        } catch (error) {
            store.setOffProgressbar();
            data.loading = false;
            if (error.response.status === 422) {
                store.setErrors(error.response.data.errors);
            }

        }


    }






    return {
        login,
        logout,
        register,
        forgetPassword,
        verifyEmailByOTP,
        resetPassword,
        getUser
    };
}