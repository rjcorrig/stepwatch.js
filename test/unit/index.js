import Vue from 'vue'
import VueRouter from 'vue-router'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

Vue.config.productionTip = false

// Rig up and use the mock dataStore
var dataStore = new DataStore()
Vue.use(servicePlugin, {
  dataStore: dataStore
})

Vue.use(VueRouter)

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
