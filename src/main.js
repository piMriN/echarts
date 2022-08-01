import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.less'

// 引入字体的文件
import './assets/font/iconfont.css'
import axios from 'axios'
axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios

Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
