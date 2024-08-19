<script setup>
import { RouterLink } from "vue-router";
import { reactive, ref } from "vue";
import useUser from '../../composables/useUser'
import ValidationError from "@/components/auth/ValidationError.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import InputGroup from "@/components/Forms/InputGroup.vue";
import { useUserStore } from "@/stores/useUserStore";

const authStore = useAuthStore();
const userStore = useUserStore();
const { addUser, deleteUser, selectUserForEdit, updateUser } = useUser();

const userCreate = ref(false);
const userEdit = ref(false);

const formData = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ''
})

const role = ref(null);
const handleRoleSelct = (e) => {
    role.value = e.target.value
}
const userCreateDialogOpen = () => {
    formData.name = '';
    formData.email = '';
    formData.role = '';

    userEdit.value = false;
    userCreate.value = true;
    authStore.errors = null
    authStore.setOnDialog();
}
const handleClose = () => {
    authStore.setOffDialog();
}
const EditRole = ref('');
const handleEditUser = async (id) => {
    userCreate.value = false;
    userEdit.value = true;
    await selectUserForEdit(id);
    if (userStore.getUserForEdit) {
        const user = userStore.getUserForEdit;

        formData.name = user.name
        formData.email = user.email
        EditRole.value = user.role
        formData['id'] = id;
        authStore.setOnDialog();

    }

}



</script>
<template>
    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        id="product">
        <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between">
            <h4 class="text-xl font-bold text-black dark:text-white">All users</h4>
            <button @click="userCreateDialogOpen"
                class="text-sm px-4 py-1.5 bg-green-500 rounded-md text-white capitalize">Add user</button>
        </div>


        <!-- tabel container start  -->
        <div class="flex flex-col sm:flex-col md:flex-row lg:flex-row md:gap-4 sm:gap-y-4 w-full justify-between p-4">
            <!-- table start here -->
            <div class="relative overflow-x-auto w-full">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                user name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                role
                            </th>
                            <th scope="col" class="px-6 py-3">
                                actions
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user, index in userStore.getUsers" :key="index"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ user.name }}
                            </th>
                            <td class="px-6 py-4">
                                {{ user.email }}
                            </td>
                            <td v-if="user.role == 1" class="px-6 py-4">
                                Cashier
                            </td>
                            <td v-if="user.role == 2" class="px-6 py-4">
                                Admin
                            </td>
                            <td class="px-6 py-4 flex gap-2">
                                <button @click="handleEditUser(user.id)" type="button"
                                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</button>

                                <button type="button" @click="deleteUser(user.id)"
                                    class="focus:outline-none text-white bg-red  focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Delete</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <!-- table end here -->


            <!--auth user details start here-->
            <div
                class="w-full max-w-sm h-90 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div class="flex flex-col items-center pb-10">
                    <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="" alt="Bonnie image" />
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Name : {{ authStore.user ?
                        authStore.user.name : '' }}</h5>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Role : {{ authStore.user.role == 1 &&
                        authStore.user ? 'Casheir' :
                        'Admin' }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Email : {{ authStore.user ? authStore.user.email
                        : '' }}</span>

                </div>
            </div>
            <!--auth user details end here-->

        </div>
        <!-- tabel container end  -->



        <!-- add and update modal user modal start here -->
        <el-dialog v-model="authStore.dialog"
            :title="userEdit === true ? 'Edit User' : userCreate === true ? 'Add User' : ''" width="500"
            :before-close="handleClose">
            <!-- form start here -->
            <form @submit.prevent="userCreate ? addUser(formData, role) : updateUser(formData, EditRole)"
                class="max-w-md mx-auto">
                <div class="relative z-0 w-full mb-5 group">
                    <InputGroup v-model="formData.name" label="User Name" type="text" placeholder="Enter user name"
                        customClasses="w-full" />
                    <ValidationError :errors="authStore.errors && authStore.errors.name ? authStore.errors.name : []" />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                    <InputGroup v-model="formData.email" label="User Email" type="email"
                        placeholder="Enter user email address" customClasses="w-full" />
                    <ValidationError :errors="authStore.errors && authStore.errors.email ? authStore.errors.email : []" />
                </div>

                <template v-if="userCreate">
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup v-model="formData.password" label="User Password" type="password"
                            placeholder="Enter user password" customClasses="w-full" />
                        <ValidationError
                            :errors="authStore.errors && authStore.errors.password ? authStore.errors.password : []" />

                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <InputGroup v-model="formData.password_confirmation" label="User Confirm Password" type="password"
                            placeholder="Enter user confimr password" customClasses="w-full" />
                    </div>

                    <div class="relative z-0 w-full mb-5 group">
                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User
                            Role</label>
                        <select id="role" @change="handleRoleSelct"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected disabled>Choose a role</option>
                            <option value="1">Casheir</option>
                            <option value="2">Admin</option>
                        </select>
                        <ValidationError :errors="authStore.errors && authStore.errors.role ? authStore.errors.role : []" />
                    </div>
                </template>

                <template v-if="userEdit">
                    <div class="relative z-0 w-full mb-5 group">
                        <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User
                            Role</label>
                        <select id="role" v-model="EditRole"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected disabled>Choose a role</option>
                            <option value="1">Casheir</option>
                            <option value="2">Admin</option>
                        </select>
                        <ValidationError :errors="authStore.errors && authStore.errors.role ? authStore.errors.role : []" />
                    </div>

                </template>

                <div class="flex gap-4">
                    <button type="submit"
                        class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">{{
                            userCreate ? 'Add' : 'Update' }}</button>
                    <button type="button" @click="handleClose"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cancel</button>
                </div>
            </form>

            <!-- form end here -->
        </el-dialog>
        <!-- add user modal end here -->





    </div>
</template>
