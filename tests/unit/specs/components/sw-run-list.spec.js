import Vuex from 'vuex'
import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import sinon from 'sinon'
import swRunList from '@/components/sw-run-list'
import seedData from '@/stepwatch/models/seedData'
import VueRouter from 'vue-router'
import createStore from '@/store'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

describe('sw-run-list.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Reset the test data
    store = createStore({ runs: seedData() })
  })

  afterEach(() => {
    // wrapper.destroy()
  })

  describe('constructor', () => {
    it('should list all runs if no props passed', () => {
      wrapper = mount(swRunList, { localVue, store })
      expect(wrapper.element.querySelector('.sw-page-title').textContent)
        .to.equal('All runs and programs')
      expect(wrapper.element.querySelectorAll('li.sw-run-item').length)
        .to.equal(wrapper.vm.$store.getters.getRuns().length)
    })

    it('should list only filtered runs if filter was passed', () => {
      const propsData = {
        title: 'pie',
        filter: r => r.name.indexOf('pie') >= 0
      }
      wrapper = mount(swRunList, { localVue, propsData, store })
      expect(wrapper.element.querySelector('.sw-page-title').textContent)
        .to.equal(propsData.title)
      expect(wrapper.element.querySelectorAll('li.sw-run-item').length)
        .to.equal(wrapper.vm.$store.getters.getRuns(propsData.filter).length)
    })

    it('shows the Create New button for program list', () => {
      const propsData = {
        type: 'program'
      }
      wrapper = mount(swRunList, { localVue, propsData, store })
      expect(wrapper.element.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.not.equal(null)
    })

    it('hides the Create New button for non-program list', () => {
      const propsData = {
        type: 'pies'
      }
      wrapper = mount(swRunList, { localVue, propsData, store })
      expect(wrapper.element.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.equal(null)
    })
  })

  describe('newProgram', () => {
    it('creates a new program', async () => {
      wrapper = mount(swRunList, { localVue, store })

      const count = wrapper.vm.runs.length

      await wrapper.vm.newProgram()
      expect(wrapper.vm.runs.length).to.equal(count + 1)
    })
  })

  describe('copy', () => {
    it('copies the current run and inserts new after current', async () => {
      wrapper = mount(swRunList, { localVue, store })

      const count = wrapper.vm.runs.length
      const index = 2
      const original = wrapper.vm.runs[index]

      const copy = await wrapper.vm.copy(original)

      expect(wrapper.vm.runs.length).to.equal(count + 1)
      expect(wrapper.vm.runs.indexOf(copy)).to.equal(index + 1)
      expect(wrapper.vm.runs.indexOf(original)).to.equal(index)
    })

    it('sets status of copy of program to "program"', async () => {
      const propsData = {
        type: 'program',
        filter: r => r.status === 'program'
      }
      wrapper = mount(swRunList, { localVue, propsData, store })

      const index = 0
      const original = wrapper.vm.runs[index]

      const copy = await wrapper.vm.copy(original)

      expect(copy.status).to.equal('program')
    })

    it('sets status of copy of run to "created"', async () => {
      const propsData = {
        type: 'running',
        filter: r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
      }
      wrapper = mount(swRunList, { localVue, propsData, store })

      const index = 0
      const original = wrapper.vm.runs[index]

      const copy = await wrapper.vm.copy(original)

      expect(copy.status).to.equal('created')
    })
  })

  describe('remove', () => {
    it('deletes the selected run and saves the data store', async () => {
      wrapper = mount(swRunList, { localVue, store })

      const count = wrapper.vm.runs.length
      const index = 2
      const original = wrapper.vm.runs[index]

      await wrapper.vm.remove(original)
      expect(wrapper.vm.runs.length).to.equal(count - 1)
      expect(wrapper.vm.runs.indexOf(original)).to.equal(-1)
    })
  })

  describe('viewDetails', () => {
    var spy, router

    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    it('routes to the sw-run/{{ run.id }}', () => {
      wrapper = mount(swRunList, { localVue, router, store })

      const run = wrapper.vm.runs[2]
      wrapper.vm.viewDetails(run)

      expect(spy.firstCall.args[0].name).to.equal('sw-run')
      expect(spy.firstCall.args[0].params.id).to.equal(run.id)
    })

    afterEach(() => {
      router.push.restore()
    })
  })

  describe('create', () => {
    var router, spy
    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    it('copies the current run, starts the copy, and routes to it', async () => {
      wrapper = mount(swRunList, { localVue, router, store })

      const index = 2
      const original = wrapper.vm.runs[index]

      const copy = await wrapper.vm.create(original)

      expect(copy.status).to.equal('running')

      expect(spy.firstCall.args[0].name).to.equal('sw-run')
      expect(spy.firstCall.args[0].params.id).to.equal(copy.id)
    })

    afterEach(() => {
      router.push.restore()
    })
  })
})
