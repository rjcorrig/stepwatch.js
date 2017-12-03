// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import models from '@/stepwatch/models'

import './assets/css/global.css'

Vue.config.productionTip = false

var dataStore = new DataStore(localStorage)

if (process.env.NODE_ENV !== 'production') {
  dataStore.seed([
    new models.Run({
      name: 'Sprint',
      id: 'foo',
      steps: [
        new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 }),
        new models.Step({ name: 'Run for 15 seconds', totalSeconds: 15 }),
        new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })
      ]
    })
  ])
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
