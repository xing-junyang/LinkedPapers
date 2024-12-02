import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './style.css'
import axios from "axios";

axios.defaults.baseURL = ("http://localhost:8080")
axios.defaults.timeout = 30000;

const app = createApp(App)

app.use(router).use(ElementPlus)
app.mount('#app')
