import Vue from 'vue'
import swStep from '@/components/sw-step'
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

describe('sw-step.vue', () => {
  var step
  beforeEach(() => {
    // Set up the test data
    dataStore.load()
    step = dataStore.getRun('foo').steps[0]
  })

  describe('constructor', () => {
    it('should bind to the given step', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()
      expect(vm.$el.querySelector('.sw-card-title').textContent)
        .to.equal(step.name)
    })
  })

  describe('percentComplete', () => {
    it('should return correct percentage of time elapsed in Step', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()
      expect(vm.percentComplete).to.equal(100 * step.runSeconds / step.totalSeconds)
    })

    it('should return 0 if step.totalSeconds == 0', () => {
      step.totalSeconds = 0
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()
      expect(vm.percentComplete).to.equal(0)
    })
  })

  describe('statusIcon', () => {
    it('is present for all statuses except created', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      for (var status of ['paused', 'running', 'complete', 'canceled']) {
        step.status = status
        expect(vm.statusIcon).to.not.be.undefined
      }
    })

    it('is not present if status is created', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      step.status = 'created'
      expect(vm.statusIcon).to.be.undefined
    })
  })

  describe('canCancel', () => {
    it('is true if step is current, and paused or running', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      for (var status of ['paused', 'running']) {
        step.status = status
        expect(vm.canCancel).to.equal(true)
      }
    })

    it('is false if step is not current', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      expect(vm.canCancel).to.equal(false)
    })

    it('is false if step is current, but not paused or running', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      for (var status of ['created', 'complete', 'canceled']) {
        step.status = status
        expect(vm.canCancel).to.equal(false)
      }
    })
  })

  describe('canPause', () => {
    it('is true if step is current and running', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      step.status = 'running'
      expect(vm.canPause).to.equal(true)
    })

    it('is false if step is not current', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      expect(vm.canPause).to.equal(false)
    })

    it('is false if step is current but not running', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      for (var status of ['created', 'paused', 'complete', 'canceled']) {
        step.status = status
        expect(vm.canPause).to.equal(false)
      }
    })
  })

  describe('canStart', () => {
    it('is true if step status is current, and paused or created', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      for (var status of ['paused', 'created']) {
        step.status = status
        expect(vm.canStart).to.equal(true)
      }
    })

    it('is false if step is not current', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      expect(vm.canStart).to.equal(false)
    })

    it('is false if step status is current, and not paused or created', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      for (var status of ['running', 'complete', 'canceled']) {
        step.status = status
        expect(vm.canStart).to.equal(false)
      }
    })
  })

  describe('cancel', () => {
    it('should be called in response to cancel button click', () => {
      step.status = 'running'
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      const stub = sinon.stub(vm, 'cancel')
      vm.cancel = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      vm.$el.querySelector('.sw-action-button[title="Cancel"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a cancel event', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('cancel', stub)

      vm.cancel()
      expect(stub.called).to.equal(true)
    })
  })

  describe('pause', () => {
    it('should be called in response to pause button click', () => {
      step.status = 'running'
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      const stub = sinon.stub(vm, 'pause')
      vm.pause = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      vm.$el.querySelector('.sw-action-button[title="Pause"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a pause event', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('pause', stub)

      vm.pause()
      expect(stub.called).to.equal(true)
    })
  })

  describe('start', () => {
    it('should be called in response to start button click', () => {
      step.status = 'paused'
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step, isCurrentStep: true }
      }).$mount()

      const stub = sinon.stub(vm, 'start')
      vm.start = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      vm.$el.querySelector('.sw-action-button[title="Start"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a start event', () => {
      const Constructor = Vue.extend(swStep)
      const vm = new Constructor({
        propsData: { step }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('start', stub)

      vm.start()
      expect(stub.called).to.equal(true)
    })
  })
})
