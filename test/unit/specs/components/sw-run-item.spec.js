import Vue from 'vue'
import swRunItem from '@/components/sw-run-item'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore()
Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run-item.vue', () => {
  var run
  before(() => {
    // Set up the test data
    dataStore.seed(seedData)
    run = dataStore.getRun('garply')
  })

  it('should bind to the given run', () => {
    const Constructor = Vue.extend(swRunItem)
    const vm = new Constructor({
      propsData: { run }
    }).$mount()
    expect(vm.$el.querySelector('.sw-card-title').textContent)
      .to.equal(run.name)
  })
})
