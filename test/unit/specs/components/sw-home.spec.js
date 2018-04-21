import Vue from 'vue'
import swHome from '@/components/sw-home'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore()

Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-home.vue', () => {
  beforeEach(() => {
    // Reset the test data
    const Constructor = Vue.extend(swHome)
    const vm = new Constructor().$mount()
    vm.$services.dataStore.seed(seedData())
    vm.$destroy()
  })

  describe('constructor', () => {
    it('should render the welcome page', () => {
      const Constructor = Vue.extend(swHome)
      const vm = new Constructor({}).$mount()

      expect(vm.$el.querySelector('.sw-header').textContent)
        .to.equal('StepWatch')
    })
  })
})
