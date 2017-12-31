import Vue from 'vue'
import swRun from '@/components/sw-run'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore(sessionStorage)
dataStore.seed(seedData)
dataStore.save()

Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run.vue', () => {
  var program

  beforeEach(() => {
    // Set up the test data
    dataStore.load()
    program = dataStore.getRun('foo')
  })

  it('should render run name in header if run found', () => {
    const Constructor = Vue.extend(swRun)
    const vm = new Constructor({
      propsData: { id: 'foo' }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run h1').textContent)
      .to.equal(program.name)
  })

  it('should render not found message if no run found', () => {
    const Constructor = Vue.extend(swRun)
    const vm = new Constructor({
      propsData: { id: 'bar' }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run h1').textContent)
      .to.equal('Run not found')
  })
})
