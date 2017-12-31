import Vue from 'vue'
import swRunItem from '@/components/sw-run-item'
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

describe('sw-run-item.vue', () => {
  var run, program, pausedRun
  beforeEach(() => {
    // Set up the test data
    dataStore.load()
    run = dataStore.getRun('garply')
    program = dataStore.getRun('foo')
    pausedRun = dataStore.getRun('quux')
  })

  describe('constructor', () => {
    it('should bind to the given run', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()
      expect(vm.$el.querySelector('.sw-card-title').textContent)
        .to.equal(run.name)
    })
  })

  describe('stepsCompleted', () => {
    it('should show the number of steps completed', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()
      expect(vm.stepsCompleted).to.equal(run.currentStep)
    })

    it('should show zero steps completed if no currentStep', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run: program }
      }).$mount()
      expect(vm.stepsCompleted).to.equal(0)
    })
  })
  describe('percentComplete', () => {
    it('should return correct percentage of time elapsed in Run', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run: pausedRun }
      }).$mount()
      expect(vm.percentComplete).to.equal(100 * pausedRun.runSeconds / pausedRun.totalSeconds)
    })

    it('should return 0 if run.totalSeconds == 0', () => {
      program.totalSeconds = 0
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run: program }
      }).$mount()
      expect(vm.percentComplete).to.equal(0)
    })
  })
})
