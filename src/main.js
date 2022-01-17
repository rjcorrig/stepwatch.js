// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { SET_STORAGE } from './store/mutationTypes'
import seedData from '@/stepwatch/models/seedData'
import log from 'loglevel'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/global.css'
import './cordovaApp'

log.setLevel(log.levels.INFO, false)

Vue.config.productionTip = false

store.commit(SET_STORAGE, localStorage)

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
