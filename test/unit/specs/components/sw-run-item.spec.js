import Vue from 'vue'
import swRunItem from '@/components/sw-run-item'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import VueRouter from 'vue-router'
import sinon from 'sinon'

// Rig up and use the mock dataStore
var dataStore = new DataStore(sessionStorage)
dataStore.seed(seedData)
dataStore.save()

Vue.use(servicePlugin, {
  dataStore: dataStore
})
Vue.use(VueRouter)

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

  describe('statusIcon', () => {
    it('is present for all statuses except created', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'paused', 'running', 'complete', 'canceled']) {
        run.status = status
        expect(vm.statusIcon).to.not.be.undefined
      }
    })

    it('is not present if status is created', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      run.status = 'created'
      expect(vm.statusIcon).to.be.undefined
    })
  })

  describe('canCopy', () => {
    it('is true if run is finished or being defined', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canCopy).to.equal(true)
      }
    })

    it('is false if run is running or paused', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'running']) {
        run.status = status
        expect(vm.canCopy).to.equal(false)
      }
    })
  })

  describe('canEdit', () => {
    it('is true if run is being defined', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'created']) {
        run.status = status
        expect(vm.canEdit).to.equal(true)
      }
    })

    it('is false if run is not being defined', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'running', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canEdit).to.equal(false)
      }
    })
  })

  describe('canRemove', () => {
    it('is true if run is finished or being defined', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canRemove).to.equal(true)
      }
    })

    it('is false if run is running or paused', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'running']) {
        run.status = status
        expect(vm.canRemove).to.equal(false)
      }
    })
  })

  describe('canCancel', () => {
    it('is true if run is paused or running', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'running']) {
        run.status = status
        expect(vm.canCancel).to.equal(true)
      }
    })

    it('is false if run is not paused or running', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canCancel).to.equal(false)
      }
    })
  })

  describe('canPause', () => {
    it('is true if run is running', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      run.status = 'running'
      expect(vm.canPause).to.equal(true)
    })

    it('is false if run is not running', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'created', 'paused', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canPause).to.equal(false)
      }
    })
  })

  describe('canStart', () => {
    it('is true if run status is paused or created', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'created']) {
        run.status = status
        expect(vm.canStart).to.equal(true)
      }
    })

    it('is false if run status is not paused or created', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'running', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canStart).to.equal(false)
      }
    })
  })

  describe('canCreate', () => {
    it('is true if run is finished or is a program', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['program', 'complete', 'canceled']) {
        run.status = status
        expect(vm.canCreate).to.equal(true)
      }
    })

    it('is false if run is running or paused', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      for (var status of ['paused', 'running', 'created']) {
        run.status = status
        expect(vm.canCreate).to.equal(false)
      }
    })
  })

  describe('cancel', () => {
    it('cancels the modeled run', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      run.status = 'paused'
      vm.cancel()
      expect(run.status).to.equal('canceled')
    })
  })

  describe('pause', () => {
    it('pauses the modeled run', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      run.status = 'running'
      vm.pause()
      expect(run.status).to.equal('paused')
    })
  })

  describe('start', () => {
    var router, spy

    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    it('starts the modeled run and routes to sw-run', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        router,
        propsData: { run }
      }).$mount()

      run.status = 'created'
      vm.start()

      expect(run.status).to.equal('running')
      expect(spy.firstCall.args[0].name).to.equal('sw-run')
      expect(spy.firstCall.args[0].params.id).to.equal(run.id)
    })

    afterEach(() => {
      router.push.restore()
    })
  })

  describe('copy', () => {
    it('fires a copy event with run as payload', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('copy', stub)

      vm.copy()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })

  describe('remove', () => {
    it('fires a remove event with run as payload', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('remove', stub)

      vm.remove()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })

  describe('create', () => {
    it('fires a create event with run as payload', () => {
      const Constructor = Vue.extend(swRunItem)
      const vm = new Constructor({
        propsData: { run }
      }).$mount()

      const stub = sinon.stub()
      vm.$on('create', stub)

      vm.create()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })
})
