import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        dialog: false,



        canSeeEmailVerifyPage: localStorage.getItem('CanSeeEmailVerifyPage') ?? false,
        canSeeResetPassPage: localStorage.getItem('CanSeeResetPassPage') ?? false,

        progressbar: false,
        preloader: false,
        user: null,
        access_token: localStorage.getItem('currentToken') ? localStorage.getItem('currentToken') : null,
        errors: null
    }),



    getters: {
        getUser() {
            return this.user
        },
        getToken() {
            return this.access_token
        },
        getErrors() {
            return this.errors
        }
    },



    actions: {
        setUser(user) {
            this.user = user
        },
        setToken(token) {
            localStorage.setItem('currentToken', token);
            this.access_token = token;
        },


        // start
        setCanSeeEmailVerifyPage(value) {
            localStorage.setItem('CanSeeEmailVerifyPage', value)
            this.canSeeEmailVerifyPage = value
        },

        setCanSeeResetPassPage(value) {
            localStorage.setItem('CanSeeResetPassPage', value)
            this.canSeeResetPassPage = value
        },

        setClearResetPassPageSeeLogic() {

            localStorage.removeItem('CanSeeEmailVerifyPage');
            localStorage.removeItem('CanSeeResetPassPage');

        },
        // end


        setStartPreloader() {
            this.preloader = true;
        },
        setEndPreloader() {
            this.preloader = false;
        },




        clearStoredData() {
            localStorage.removeItem('currentToken')
            this.access_token = null
            this.user = null
        },
        setErrors(errors) {
            this.errors = errors
        },
        clearErrors() {
            this.errors = null
        },


        // progressbar method start
        setOnProgressbar() {
            this.progressbar = true;
        },
        setOffProgressbar() {
            this.progressbar = false;
        },
        // progressbar method end

        setOnDialog() {
            this.dialog = true
        },
        setOffDialog() {
            this.dialog = false
        }









    },
});