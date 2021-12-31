import { expect } from 'chai'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import swRun from '@/components/sw-run'
import seedData from '@/stepwatch/models/seedData'
import router from '@/router'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

import { ID_PAUSED, ID_RUNNING } from '@/stepwatch/constants'

const localVue = createLocalVue()

const dataStore = new DataStore()
localVue.use(services, {
  dataStore: dataStore
})
localVue.use(router)

describe('sw-run.vue', () => {
  let wrapper, program

  beforeEach(() => {
    // Reset the test data
    wrapper = mount(swRun, {
      localVue
    })

    wrapper.vm.$services.dataStore.seed(seedData())
    program = wrapper.vm.$services.dataStore.getRun('foo')
    wrapper.destroy()

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

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should render run name in header if run found', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'foo' }
      })

      expect(wrapper.element.querySelector('.sw-page-title .text1').textContent)
        .to.equal(program.name)
    })

    it('should render not found message if no run found', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'bar' }
      })

      expect(wrapper.element.querySelector('.sw-run h1').textContent)
        .to.equal('Run not found')
    })
  })

  describe('watch', () => {
    it('switches modeled run on $route change', (done) => {
      wrapper = mount(swRun, {
        localVue,
        router,
        propsData: { id: 'foo' }
      })

      wrapper.vm.$router.push({
        name: 'sw-run',
        params: { id: 'garply' }
      })

      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.run.id).to.equal('garply')
        return done()
      })
    })
  })

  describe('tick', () => {
    it('should call run.tick', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'foo' }
      })

      const spy = sinon.spy(wrapper.vm.run, 'tick')
      wrapper.vm.tick()
      expect(spy.called).to.equal(true)
    })

    it('should not blow up if run is undefined', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'bar' }
      })

      expect(() => wrapper.vm.tick()).to.not.throw()
    })
  })

  describe('suspend', () => {
    it('is called when component is destroyed', () => {
      // shallowMount to avoid vue-marquee error on nextTick
      wrapper = shallowMount(swRun, {
        localVue,
        propsData: { id: 'foo' }
      })

      const stub = sinon.stub(wrapper.vm, 'suspend')
      wrapper.destroy()

      expect(stub.called).to.equal(true)
    })

    it('pauses the run if running and saves the dataStore', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      try {
        const stub = sinon.spy(wrapper.vm.$services.dataStore, 'save')
        wrapper.vm.suspend()

        expect(wrapper.vm.run.status).to.equal('paused')
        expect(stub.called).to.equal(true)
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('notifyComplete', () => {
    it('posts a new notification above ID_RUNNING', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')

      window.device.platform = 'Android'
      wrapper.vm.notifyComplete()

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.be.above(ID_RUNNING)
    })

    it('posts a new notification above highest notification', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.getIds = function (fn) { fn([3, 8, 6]) }
      wrapper.vm.notifyComplete()

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(9)
    })
  })

  describe('notifyRunning', () => {
    it('does not post a notification on iOS', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'iOS'
      wrapper.vm.notifyRunning(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(false)
    })

    it('posts ID_RUNNING notification if not present', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(false) }
      wrapper.vm.notifyRunning(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(ID_RUNNING)
      expect(update.called).to.equal(false)
    })

    it('updates ID_RUNNING notification if present', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(true) }
      wrapper.vm.notifyRunning(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(true)
      expect(update.firstCall.args[0].id).to.equal(ID_RUNNING)
    })
  })

  describe('notifyPaused', () => {
    it('does not post a notification on iOS', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'iOS'
      wrapper.vm.notifyPaused(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(false)
    })

    it('posts ID_PAUSED notification if not present', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(false) }
      wrapper.vm.notifyPaused(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(true)
      expect(schedule.firstCall.args[0].id).to.equal(ID_PAUSED)
      expect(update.called).to.equal(false)
    })

    it('updates ID_PAUSED notification if present', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      const schedule = sinon.spy(window.cordova.plugins.notification.local, 'schedule')
      const update = sinon.spy(window.cordova.plugins.notification.local, 'update')

      window.device.platform = 'Android'
      window.cordova.plugins.notification.local.isPresent = function (id, fn) { fn(true) }
      wrapper.vm.notifyPaused(wrapper.vm.run.steps[0])

      expect(schedule.called).to.equal(false)
      expect(update.called).to.equal(true)
      expect(update.firstCall.args[0].id).to.equal(ID_PAUSED)
    })
  })

  describe('toggleClickHandler', () => {
    it('pauses a running run', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'garply' }
      })

      expect(wrapper.vm.run.status).to.equal('running')
      wrapper.vm.toggleClickHandler()
      expect(wrapper.vm.run.status).to.equal('paused')
    })

    it('resumes a paused run', () => {
      wrapper = mount(swRun, {
        localVue,
        propsData: { id: 'quux' }
      })

      expect(wrapper.vm.run.status).to.equal('paused')
      wrapper.vm.toggleClickHandler()
      expect(wrapper.vm.run.status).to.equal('running')
    })
  })
})
