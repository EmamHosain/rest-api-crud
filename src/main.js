// import './style.css'
import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'

import VueApexCharts from 'vue3-apexcharts'

// element plus start 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// element plus end 

import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.baseURL = 'http://localhost:8000'



const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(ElementPlus)
app.mount('#app')
