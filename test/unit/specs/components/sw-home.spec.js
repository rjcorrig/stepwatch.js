import Vue from 'vue'
import swHome from '@/components/sw-home'
import seedData from '@/stepwatch/models/seedData'

describe('sw-home.vue', () => {
  const Constructor = Vue.extend(swHome)
  let vm

  beforeEach(() => {
    // Reset the test data
    vm = new Constructor().$mount()
    vm.$services.dataStore.seed(seedData())
    vm.$destroy()
  })

  afterEach(() => {
    vm.$destroy()
  })

  describe('constructor', () => {
    it('should render the welcome page', () => {
      vm = new Constructor({}).$mount()

      expect(vm.$el.querySelector('.sw-header').textContent)
        .to.equal('StepWatch')
    })
  })
})
