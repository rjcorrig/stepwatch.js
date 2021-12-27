import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import swRunItem from '@/components/sw-run-item'
import seedData from '@/stepwatch/models/seedData'
import VueRouter from 'vue-router'
import sinon from 'sinon'
import Run from '@/stepwatch/models/run'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

const localVue = createLocalVue()

const dataStore = new DataStore()
localVue.use(services, {
  dataStore: dataStore
})
localVue.use(VueRouter)

describe('sw-run-item.vue', () => {
  let run, program, pausedRun, completedRun
  let router
  let wrapper

  beforeEach(() => {
    // Reset the test data
    wrapper = mount(swRunItem, {
      localVue,
      propsData: { run: new Run() }
    })

    wrapper.vm.$services.dataStore.seed(seedData())
    run = wrapper.vm.$services.dataStore.getRun('garply')
    program = wrapper.vm.$services.dataStore.getRun('foo')
    pausedRun = wrapper.vm.$services.dataStore.getRun('quux')
    completedRun = wrapper.vm.$services.dataStore.getRun('grault')

    wrapper.destroy()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should bind to the given run', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })
      expect(wrapper.element.querySelector('.sw-card-title').textContent)
        .to.equal(run.name)
    })
  })

  describe('stepsCompleted', () => {
    it('should show the number of steps completed', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })
      expect(wrapper.vm.stepsCompleted).to.equal(run.currentStep)
    })

    it('should show zero steps completed if no currentStep', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: program }
      })
      expect(wrapper.vm.stepsCompleted).to.equal(0)
    })

    it('should show total number of steps if run completed', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: completedRun }
      })
      expect(wrapper.vm.stepsCompleted).to.equal(completedRun.steps.length)
    })
  })

  describe('percentComplete', () => {
    it('should return correct percentage of time elapsed in Run', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: pausedRun }
      })
      expect(wrapper.vm.percentComplete).to.equal(100 * pausedRun.runSeconds / pausedRun.totalSeconds)
    })

    it('should return 0 if run.totalSeconds == 0', () => {
      program.totalSeconds = 0
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: program }
      })
      expect(wrapper.vm.percentComplete).to.equal(0)
    })
  })

  describe('statusIcon', () => {
    it('is present for all statuses except created', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'paused', 'running', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.statusIcon).to.not.be.undefined
      }
    })

    it('is not present if status is created', () => {
      const aRun = new Run()
      aRun.status = 'created'

      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      expect(wrapper.vm.statusIcon).to.be.undefined
    })
  })

  describe('canCopy', () => {
    it('is true if run is finished or being defined', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCopy).to.equal(true)
      }
    })

    it('is false if run is running or paused', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'running']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCopy).to.equal(false)
      }
    })
  })

  describe('canEdit', () => {
    it('is true if run is being defined', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'created']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canEdit).to.equal(true)
      }
    })

    it('is false if run is not being defined', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'running', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canEdit).to.equal(false)
      }
    })
  })

  describe('canRemove', () => {
    it('is true if run is finished or being defined', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canRemove).to.equal(true)
      }
    })

    it('is false if run is running or paused', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'running']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canRemove).to.equal(false)
      }
    })
  })

  describe('canCancel', () => {
    it('is true if run is paused or running', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'running']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCancel).to.equal(true)
      }
    })

    it('is false if run is not paused or running', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'created', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCancel).to.equal(false)
      }
    })
  })

  describe('canPause', () => {
    it('is true if run is running', () => {
      const aRun = new Run()
      aRun.status = 'running'
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      expect(wrapper.vm.canPause).to.equal(true)
    })

    it('is false if run is not running', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'created', 'paused', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canPause).to.equal(false)
      }
    })
  })

  describe('canStart', () => {
    it('is true if run status is paused or created', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'created']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canStart).to.equal(true)
      }
    })

    it('is false if run status is not paused or created', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'running', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canStart).to.equal(false)
      }
    })
  })

  describe('canCreate', () => {
    it('is true if run is finished or is a program', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['program', 'complete', 'canceled']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCreate).to.equal(true)
      }
    })

    it('is false if run is running or paused', async () => {
      let aRun = new Run()
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run: aRun }
      })

      for (var status of ['paused', 'running', 'created']) {
        aRun = new Run()
        aRun.status = status
        await wrapper.setProps({ run: aRun })
        expect(wrapper.vm.canCreate).to.equal(false)
      }
    })
  })

  describe('cancel', () => {
    it('cancels the modeled run', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })

      run.status = 'paused'
      wrapper.vm.cancel()
      expect(run.status).to.equal('canceled')
    })
  })

  describe('pause', () => {
    it('pauses the modeled run', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })

      run.status = 'running'
      wrapper.vm.pause()
      expect(run.status).to.equal('paused')
    })
  })

  describe('start', () => {
    let spy

    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    it('starts the modeled run and routes to sw-run', () => {
      wrapper = mount(swRunItem, {
        localVue,
        router,
        propsData: { run }
      })

      run.status = 'created'
      wrapper.vm.start()

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
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('copy', stub)

      wrapper.vm.copy()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })

  describe('remove', () => {
    it('fires a remove event with run as payload', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('remove', stub)

      wrapper.vm.remove()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })

  describe('create', () => {
    it('fires a create event with run as payload', () => {
      wrapper = mount(swRunItem, {
        localVue,
        propsData: { run }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('create', stub)

      wrapper.vm.create()
      expect(stub.called).to.equal(true)
      expect(stub.firstCall.args[0]).to.equal(run)
    })
  })
})
