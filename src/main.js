// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import seedData from '@/stepwatch/models/seedData'

import './assets/css/global.css'
import './cordovaApp'

Vue.config.productionTip = false

var dataStore = new DataStore(localStorage)

if (process.env.NODE_ENV !== 'production') {
  dataStore.seed(seedData)
} else {
  dataStore.load()
}

Vue.use(services, {
  dataStore: dataStore
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
