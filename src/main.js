// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import services from '@/stepwatch/services'

import './assets/css/global.css'

Vue.config.productionTip = false

services.install = function () {
  Object.defineProperty(Vue.prototype, '$services', {
    get () { return services }
  })
}

Vue.use(services)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
