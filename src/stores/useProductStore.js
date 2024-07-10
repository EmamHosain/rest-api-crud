import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        productsWithPaginate: {},
        selectedProduct: null,
    }),



    getters: {
        getProducts() {
            return this.products
        },
        getSelectedProduct() {
            return this.selectedProduct
        }
    },



    actions: {
        setProduct(products) {
            this.products = products
        },
        setProductWithPaginate(data) {
            this.productsWithPaginate = data
        },
        setSelectedProduct(product) {
            this.selectedProduct = product
        }
    },
});