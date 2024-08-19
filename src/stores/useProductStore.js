import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        productsWithPaginate: {},
        selectedProduct: {},
        productDialog: false,
        isProductPaginate: 1,
    }),



    getters: {
        getProducts() {
            return this.products
        },
        getSelectedProduct() {
            return this.selectedProduct
        },
        getOnShowProductsPaginate() {
            return this.isProductPaginate >= 2
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
        },
        setOnProductDialog() {
            this.productDialog = true;
        },
        setOffProductDialog() {
            this.productDialog = false;
        },
        setOnShowProductsPaginate(page) {
            this.isProductPaginate = page
        }
    },
});