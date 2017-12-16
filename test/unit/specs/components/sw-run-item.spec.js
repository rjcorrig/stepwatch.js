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
  var shortRun, longRun
  before(() => {
    // Set up the test data
    dataStore.seed(seedData)
    shortRun = dataStore.getRun('garply')
    longRun = dataStore.getRun('fred')
  })

  it('should bind to the given run', () => {
    const Constructor = Vue.extend(swRunItem)
    const vm = new Constructor({
      propsData: { run: shortRun }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run-text').textContent)
      .to.equal(shortRun.name)
  })

  it('displays mm:ss time for a short run', () => {
    const Constructor = Vue.extend(swRunItem)
    const vm = new Constructor({
      propsData: { run: shortRun }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run-timer').textContent)
      .to.match(/[0-9][0-9]:[0-9][0-9]/)
  })

  it('displays hh:mm:ss time for a long run', () => {
    const Constructor = Vue.extend(swRunItem)
    const vm = new Constructor({
      propsData: { run: longRun }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run-timer').textContent)
      .to.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/)
  })
})
