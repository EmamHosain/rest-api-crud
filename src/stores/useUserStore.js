import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        userForEdit: {}
    }),



    getters: {
        getUsers() {
            return this.users
        },
        getUserForEdit() {
            return this.userForEdit;
        }


    },



    actions: {
        setUsers(users) {
            this.users = users
        },
        setUserForEdit(user) {
            this.userForEdit = user;
        }

    },
});