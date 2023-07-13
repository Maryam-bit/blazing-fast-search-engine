import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import VueApexCharts from "vue3-apexcharts";

const ToastContainerOptions = {
    position: "top-center",
    autoClose: 1000,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    closeOnClick: true,
    clearOnUrlChange: false,
};

const app = createApp(App)
app.use(VueApexCharts);
app.use(Vue3Toasity, ToastContainerOptions);
app.use(router)

app.mount('#app')
