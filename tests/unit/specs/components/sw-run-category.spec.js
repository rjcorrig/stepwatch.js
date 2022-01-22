import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import swRunCategory from '@/components/sw-run-category'
import seedData from '@/stepwatch/models/seedData'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import sinon from 'sinon'
import createStore from '@/store'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

describe('sw-run-category.vue', () => {
  let router
  let store
  let wrapper

  beforeEach(() => {
    // Reset the test data
    router = new VueRouter()
    store = createStore({ runs: seedData() })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should summarize all runs if no props passed', () => {
      wrapper = mount(swRunCategory, { localVue, router, store })
      expect(wrapper.element.querySelector('.sw-run-category-text').textContent)
        .to.equal('All runs and programs')
      expect(wrapper.element.querySelector('.sw-run-category-count').textContent)
        .to.equal(wrapper.vm.$store.getters.getRuns().length.toString())
    })

    it('should count number of filtered runs if filter was passed', () => {
      const propsData = {
        title: 'pie',
        filter: r => r.name.indexOf('pie') >= 0
      }
      wrapper = mount(swRunCategory, { localVue, router, propsData, store })
      expect(wrapper.element.querySelector('.sw-run-category-text').textContent)
        .to.equal(propsData.title)
      expect(wrapper.element.querySelector('.sw-run-category-count').textContent)
        .to.equal(wrapper.vm.$store.getters.getRuns(propsData.filter).length.toString())
    })
  })

  describe('listRuns', () => {
    let spy

    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    afterEach(() => {
      router.push.restore()
    })

    it('should be called in response to click', () => {
      const propsData = {
        title: 'pie',
        type: 'pies',
        filter: r => r.name.indexOf('pie') >= 0
      }
      wrapper = mount(swRunCategory, { localVue, router, propsData, store })

      const stub = sinon.stub(wrapper.vm, 'listRuns')
      wrapper.vm.listRuns = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      wrapper.element.querySelector('.sw-run-category').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('should route to /runs/{{ this.type }}', () => {
      const propsData = {
        title: 'pie',
        type: 'pies',
        filter: r => r.name.indexOf('pie') >= 0
      }
      wrapper = mount(swRunCategory, { localVue, router, propsData, store })

      wrapper.vm.listRuns()
      expect(spy.firstCall.args[0].path).to.equal('/runs/pies')
    })
  })
})
