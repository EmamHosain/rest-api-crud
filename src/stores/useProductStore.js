import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        productsWithPaginate: {}
    }),



    getters: {
        getProducts() {
            return this.products
        }
    },



    actions: {
        setProduct(products) {
            this.products = products
        },
        setProductWithPaginate(data) {
            this.productsWithPaginate = data
        },
    },
});