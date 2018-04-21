import Vue from 'vue'
import swRun from '@/components/sw-run'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import router from '@/router'

import { ID_PAUSED, ID_RUNNING } from '@/stepwatch/constants'

// Rig up and use the mock dataStore
var dataStore = new DataStore()

Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run.vue', () => {
  var program

  beforeEach(() => {
    // Reset the test data
    const Constructor = Vue.extend(swRun)
    const vm = new Constructor().$mount()
    vm.$services.dataStore.seed(seedData())
    vm.$destroy()

    program = dataStore.getRun('foo')

    // Set up mock cordova objects
    window.cordova = {
      plugins: {
        backgroundMode: {
          enable: () => {},
          disable: () => {}
        },
        notification: {
          local: {
            on: function (event, callback, scope) {},
            un: function (event, callback, scope) {},
            getIds: function (fn) { fn([]) },
            schedule: function (data) {},
            cancel: function (arr) {},
            isPresent: function (id, fn) { fn() },
            update: function (data) {}
          }
        }
      }
    }

    window.device = {
      platform: ''
    }
  })

  describe('constructor', () => {
    it('should render run name in header if run found', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' }
      }).$mount()
      expect(vm.$el.querySelector('.sw-page-title .text1').textContent)
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

    it('establishes a ticker', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' }
      }).$mount()

      expect(vm.ticker).to.not.be.undefined
    })
  })

  describe('watch', () => {
    it('switches modeled run on $route change', (done) => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' },
        router
      }).$mount()

      vm.$router.push({
        name: 'sw-run',
        params: { id: 'garply' }
      })

      vm.$nextTick(() => {
        expect(vm.run.id).to.equal('garply')
        return done()
      })
    })
  })

  describe('tick', () => {
    it('should call run.tick', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' }
      }).$mount()

      const spy = sinon.spy(vm.run, 'tick')
      vm.tick()
      expect(spy.called).to.equal(true)
    })

    it('should not blow up if run is undefined', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'bar' }
      }).$mount()

      expect(() => vm.tick()).to.not.throw()
    })
  })

  describe('suspend', () => {
    it('is called when component is destroyed', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' }
      }).$mount()

      const stub = sinon.stub(vm, 'suspend')
      vm.$destroy()

      expect(stub.called).to.equal(true)
    })

    it('pauses the run if running and saves the dataStore', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      try {
        const stub = sinon.spy(vm.$services.dataStore, 'save')
        vm.suspend()

        expect(vm.run.status).to.equal('paused')
        expect(stub.called).to.equal(true)
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('notifyComplete', () => {
    it('posts a new notification above ID_RUNNING', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')

      window.device.platform = 'Android'
      vm.notifyComplete()

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.be.above(ID_RUNNING)
    })

    it('posts a new notification above highest notification', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.getIds = function (fn) { fn([3, 8, 6]) }
      vm.notifyComplete()

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(9)
    })
  })

  describe('notifyRunning', () => {
    it('does not post a notification on iOS', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'iOS'
      vm.notifyRunning(vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(false)
    })

    it('posts ID_RUNNING notification if not present', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(false) }
      vm.notifyRunning(vm.run.steps[0])

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(ID_RUNNING)
      expect(update.called).to.equal(false)
    })

    it('updates ID_RUNNING notification if present', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(true) }
      vm.notifyRunning(vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(true)
      expect(update.firstCall.args[0].id).to.equal(ID_RUNNING)
    })
  })

  describe('notifyPaused', () => {
    it('does not post a notification on iOS', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'iOS'
      vm.notifyPaused(vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(false)
    })

    it('posts ID_PAUSED notification if not present', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(false) }
      vm.notifyPaused(vm.run.steps[0])

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(ID_PAUSED)
      expect(update.called).to.equal(false)
    })

    it('updates ID_PAUSED notification if present', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(true) }
      vm.notifyPaused(vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(true)
      expect(update.firstCall.args[0].id).to.equal(ID_PAUSED)
    })
  })

  describe('toggleClickHandler', () => {
    it('pauses a running run', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'garply' }
      }).$mount()

      expect(vm.run.status).to.equal('running')
      vm.toggleClickHandler()
      expect(vm.run.status).to.equal('paused')
    })

    it('resumes a paused run', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'quux' }
      }).$mount()

      expect(vm.run.status).to.equal('paused')
      vm.toggleClickHandler()
      expect(vm.run.status).to.equal('running')
    })
  })
})
