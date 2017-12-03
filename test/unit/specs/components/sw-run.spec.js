import Vue from 'vue'
import swRun from '@/components/sw-run'
import models from '@/stepwatch/models'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore()
Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run.vue', () => {
  var program

  before(() => {
    // Set up the test data
    program = dataStore.createProgram()
    program.name = 'Sprint'
    program.id = 'foo'
    var step1 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })
    var step2 = new models.Step({ name: 'Run for 15 seconds', totalSeconds: 15 })
    var step3 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })

    program.steps = [ step1, step2, step3 ]
    program.steps.forEach(function (step, i) {
      step.id = i
    })
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
