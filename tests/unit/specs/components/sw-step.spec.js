import Vuex from 'vuex'
import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import swStep from '@/components/sw-step'
import seedData from '@/stepwatch/models/seedData'
import Step from '@/stepwatch/models/step'
import VueRouter from 'vue-router'
import sinon from 'sinon'
import createStore from '@/store'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe('sw-step.vue', () => {
  let wrapper, step, store

  beforeEach(() => {
    store = createStore({ runs: seedData() })
    step = store.getters.getRun('foo').steps[0]
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should bind to the given step', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })
      expect(wrapper.element.querySelector('.sw-card-title').textContent)
        .to.equal(step.name)
    })
  })

  describe('percentComplete', () => {
    it('should return correct percentage of time elapsed in Step', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })
      expect(wrapper.vm.percentComplete).to.equal(100 * step.runSeconds / step.totalSeconds)
    })

    it('should return 0 if step.totalSeconds == 0', () => {
      step.totalSeconds = 0
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })
      expect(wrapper.vm.percentComplete).to.equal(0)
    })
  })

  describe('statusIcon', () => {
    it('is present for all statuses except created', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep }
      })

      for (var status of ['paused', 'running', 'complete', 'canceled']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep })
        expect(wrapper.vm.statusIcon).to.not.be.undefined
      }
    })

    it('is not present if status is created', () => {
      const aStep = new Step()
      aStep.status = 'created'

      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep }
      })

      expect(wrapper.vm.statusIcon).to.be.undefined
    })
  })

  describe('canCancel', () => {
    it('is true if step is current, and paused or running', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      for (var status of ['paused', 'running']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep, isCurrentStep: true })
        expect(wrapper.vm.canCancel).to.equal(true)
      }
    })

    it('is false if step is not current', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      expect(wrapper.vm.canCancel).to.equal(false)
    })

    it('is false if step is current, but not paused or running', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      for (var status of ['created', 'complete', 'canceled']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep, isCurrentStep: true })
        expect(wrapper.vm.canCancel).to.equal(false)
      }
    })
  })

  describe('canPause', () => {
    it('is true if step is current and running', () => {
      const aStep = new Step()
      aStep.status = 'running'
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      expect(wrapper.vm.canPause).to.equal(true)
    })

    it('is false if step is not current', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      expect(wrapper.vm.canPause).to.equal(false)
    })

    it('is false if step is current but not running', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      for (var status of ['created', 'paused', 'complete', 'canceled']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep, isCurrentStep: true })
        expect(wrapper.vm.canPause).to.equal(false)
      }
    })
  })

  describe('canStart', () => {
    it('is true if step status is current, and paused or created', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      for (var status of ['paused', 'created']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep, isCurrentStep: true })
        expect(wrapper.vm.canStart).to.equal(true)
      }
    })

    it('is false if step is not current', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      expect(wrapper.vm.canStart).to.equal(false)
    })

    it('is false if step status is current, and not paused or created', async () => {
      let aStep = new Step()
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step: aStep, isCurrentStep: true }
      })

      for (var status of ['running', 'complete', 'canceled']) {
        aStep = new Step()
        aStep.status = status
        await wrapper.setProps({ step: aStep, isCurrentStep: true })
        expect(wrapper.vm.canStart).to.equal(false)
      }
    })
  })

  describe('cancel', () => {
    it('should be called in response to cancel button click', () => {
      step.status = 'running'
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step, isCurrentStep: true }
      })

      const stub = sinon.stub(wrapper.vm, 'cancel')
      wrapper.vm.cancel = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      wrapper.vm.$el.querySelector('.sw-action-button[title="Cancel"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a cancel event', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('cancel', stub)

      wrapper.vm.cancel()
      expect(stub.called).to.equal(true)
    })
  })

  describe('pause', () => {
    it('should be called in response to pause button click', () => {
      step.status = 'running'
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step, isCurrentStep: true }
      })

      const stub = sinon.stub(wrapper.vm, 'pause')
      wrapper.vm.pause = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      wrapper.vm.$el.querySelector('.sw-action-button[title="Pause"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a pause event', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('pause', stub)

      wrapper.vm.pause()
      expect(stub.called).to.equal(true)
    })
  })

  describe('start', () => {
    it('should be called in response to start button click', () => {
      step.status = 'paused'
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step, isCurrentStep: true }
      })

      const stub = sinon.stub(wrapper.vm, 'start')
      wrapper.vm.start = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      wrapper.vm.$el.querySelector('.sw-action-button[title="Start"]').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('fires a start event', () => {
      wrapper = mount(swStep, {
        localVue,
        store,
        propsData: { step }
      })

      const stub = sinon.stub()
      wrapper.vm.$on('start', stub)

      wrapper.vm.start()
      expect(stub.called).to.equal(true)
    })
  })
})
