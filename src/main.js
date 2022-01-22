// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import createStore from './store'
import seedData from '@/stepwatch/models/seedData'
import log from 'loglevel'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/global.css'
import './cordovaApp'

log.setLevel(log.levels.INFO, false)

Vue.config.productionTip = false

Vue.use(Vuex)

const store = createStore({ storage: localStorage })

if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_SEED_DATA) {
  store.dispatch('seed', seedData())
} else {
  store.dispatch('load')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
