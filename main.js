import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
// 引入头部导航组件
import headNav from "@/components/headNav/headNav.vue";
// 引入ui库
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 引入api请求 
import req from "@/utils/request.js";
//引入vuex
import store from './store/index.js'
//把vuex挂载原型链
Vue.prototype.$store = store
// 原型连挂载 请求
Vue.prototype.$req = req

// 挂载全局组件
Vue.component("head-nav", headNav)

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif