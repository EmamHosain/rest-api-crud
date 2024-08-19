import axios from "axios";
import { getHeaderConfig } from "@/helpers/headerConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import useTost from "./useToast";
import useAuth from "./useAuth";





export default function useUser() {

    const { success, error } = useTost();




    const getCsrfCookie = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.log(error)
        }
    }

    const addUser = async (data, role) => {
        const store = useAuthStore();
        const userStore = useUserStore();
        store.errors = null;
        store.setOnProgressbar();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('role', role);

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/users`, formData, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 201) {
                // reset form data
                data.name = '';
                data.email = '';
                data.password = '';
                data.password_confirmation = '';
                role = null;

                userStore.getUsers.push(res.data.user)
                store.setOffProgressbar();
                store.setOffDialog();
                success(res.data.message);
            }
        } catch (error) {
            store.setOffProgressbar();
            // error('Something went wrong')
            console.log('add user error', error)
            if (parseInt(error.response.status) === 422 && error.response) {
                store.setErrors(error.response.data.errors);
            }
        }

    }


    const getUsers = async () => {
        const store = useAuthStore();
        const userStore = useUserStore();
        store.errors = null;
        store.setOnProgressbar();

        try {
            await getCsrfCookie();
            const res = await axios.get(`/api/users`, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                // console.log('users', res.data.users);
                userStore.setUsers(res.data.users);
                store.setOffProgressbar();
            }
        } catch (e) {
            store.setOffProgressbar();
            error('Something went wrong')
            console.log('get users error', e)
        } finally {
            store.setOffProgressbar();
        }

    }

    const selectUserForEdit = async (id) => {
        const store = useAuthStore();
        store.errors = null;
        store.setOnProgressbar();
        const userStore = useUserStore();
        try {
            await getCsrfCookie();
            const res = await axios.get(`/api/users/${id}`, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                userStore.setUserForEdit(res.data.user);
                store.setOffProgressbar();
            }
        } catch (e) {
            store.setOffProgressbar();
            error('Something went wrong')
            console.log('get users error', e)
        } finally {
            store.setOffProgressbar();
        }
    }


    const updateUser = async (data, role) => {

        const store = useAuthStore();
        store.errors = null;
        store.setOnProgressbar();

        const userStore = useUserStore();
        data['_method'] = 'put';
        data['role'] = role;
        delete data.password;
        delete data.password_confirmation;

        try {
            await getCsrfCookie();
            const res = await axios.post(`/api/users/${data.id}`, data, getHeaderConfig(store.getToken));
            if (parseInt(res.status) === 200) {
                delete data._method;
                const updatedUsers = userStore.getUsers.map((item) => {
                    return item.id === data.id ? data : item;
                });
                userStore.setUsers(updatedUsers);
                store.setOffDialog();
                success(res.data.message);
            }
        } catch (e) {
            error('Something went wrong')
            console.log('update user error', e);
            if (e.response && parseInt(e.response.status) === 422) {
                store.setErrors(e.response.data.errors);
            }
            store.setOffProgressbar();
        } finally {
            store.setOffProgressbar(); // Ensure progress bar is turned off
        }
    };





    const deleteUser = async (id) => {
        const isConfirm = confirm('Are you sure?')
        const userStore = useUserStore();
        const store = useAuthStore();

        if (isConfirm) {
            store.setOnProgressbar();
            try {
                await getCsrfCookie();
                const res = await axios.delete(`/api/users/${id}`, getHeaderConfig(store.getToken));
                if (parseInt(res.status) === 204) {
                    // remove id from users

                    userStore.setUsers(userStore.getUsers.filter(item => item.id !== id))
                    store.setOffProgressbar();
                }
            } catch (e) {
                store.setOffProgressbar();
                error('Something went wrong')
                console.log('get users error', e)
            } finally {
                store.setOffProgressbar();

            }
        } else {
            return;
        }


    }




    return { addUser, getUsers, deleteUser, selectUserForEdit, updateUser }
}