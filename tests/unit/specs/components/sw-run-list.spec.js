import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import sinon from 'sinon'
import swRunList from '@/components/sw-run-list'
import seedData from '@/stepwatch/models/seedData'
import VueRouter from 'vue-router'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

const localVue = createLocalVue()

const dataStore = new DataStore()
localVue.use(services, {
  dataStore: dataStore
})
localVue.use(VueRouter)

describe('sw-run-list.vue', () => {
  let wrapper

  beforeEach(() => {
    // Reset the test data
    wrapper = mount(swRunList, { localVue })
    wrapper.vm.$services.dataStore.seed(seedData())
    wrapper.destroy()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should list all runs if no props passed', () => {
      wrapper = mount(swRunList, { localVue })
      expect(wrapper.element.querySelector('.sw-page-title').textContent)
        .to.equal('All runs and programs')
      expect(wrapper.element.querySelectorAll('li.sw-run-item').length)
        .to.equal(wrapper.vm.$services.dataStore.getRuns().length)
    })

    it('should list only filtered runs if filter was passed', () => {
      const propsData = {
        title: 'pie',
        filter: r => r.name.indexOf('pie') >= 0
      }
      wrapper = mount(swRunList, { localVue, propsData })
      expect(wrapper.element.querySelector('.sw-page-title').textContent)
        .to.equal(propsData.title)
      expect(wrapper.element.querySelectorAll('li.sw-run-item').length)
        .to.equal(wrapper.vm.$services.dataStore.getRuns(propsData.filter).length)
    })

    it('shows the Create New button for program list', () => {
      const propsData = {
        type: 'program'
      }
      wrapper = mount(swRunList, { localVue, propsData })
      expect(wrapper.element.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.not.equal(null)
    })

    it('hides the Create New button for non-program list', () => {
      const propsData = {
        type: 'pies'
      }
      wrapper = mount(swRunList, { localVue, propsData })
      expect(wrapper.element.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.equal(null)
    })
  })

  describe('newProgram', () => {
    it('creates a new program and saves it to the data store', () => {
      wrapper = mount(swRunList, { localVue })

      const count = wrapper.vm.runs.length
      try {
        const stub = sinon.stub(wrapper.vm.$services.dataStore, 'save')

        wrapper.vm.newProgram()
        expect(wrapper.vm.runs.length).to.equal(count + 1)
        expect(stub.called).to.equal(true)
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('copy', () => {
    it('copies the current run and inserts new after current', () => {
      wrapper = mount(swRunList, { localVue })

      const count = wrapper.vm.runs.length
      const index = 2
      const original = wrapper.vm.runs[index]

      try {
        const stub = sinon.stub(wrapper.vm.$services.dataStore, 'save')
        const copy = wrapper.vm.copy(original)

        expect(wrapper.vm.runs.length).to.equal(count + 1)
        expect(wrapper.vm.runs.indexOf(copy)).to.equal(index + 1)
        expect(wrapper.vm.runs.indexOf(original)).to.equal(index)
        expect(stub.called).to.equal(true)
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })

    it('sets status of copy of program to "program"', () => {
      const propsData = {
        type: 'program',
        filter: r => r.status === 'program'
      }
      wrapper = mount(swRunList, { localVue, propsData })

      const index = 0
      const original = wrapper.vm.runs[index]

      try {
        sinon.stub(wrapper.vm.$services.dataStore, 'save')
        const copy = wrapper.vm.copy(original)

        expect(copy.status).to.equal('program')
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })

    it('sets status of copy of run to "created"', () => {
      const propsData = {
        type: 'running',
        filter: r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
      }
      wrapper = mount(swRunList, { localVue, propsData })

      const index = 0
      const original = wrapper.vm.runs[index]

      try {
        sinon.stub(wrapper.vm.$services.dataStore, 'save')
        const copy = wrapper.vm.copy(original)

        expect(copy.status).to.equal('created')
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('remove', () => {
    it('deletes the selected run and saves the data store', () => {
      wrapper = mount(swRunList, { localVue })

      const count = wrapper.vm.runs.length
      const index = 2
      const original = wrapper.vm.runs[index]

      try {
        const stub = sinon.stub(wrapper.vm.$services.dataStore, 'save')

        wrapper.vm.remove(original)
        expect(wrapper.vm.runs.length).to.equal(count - 1)
        expect(wrapper.vm.runs.indexOf(original)).to.equal(-1)
        expect(stub.called).to.equal(true)
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('viewDetails', () => {
    var spy, router

    beforeEach(() => {
      router = new VueRouter()
      spy = sinon.stub(router, 'push')
    })

    it('routes to the sw-run/{{ run.id }}', () => {
      wrapper = mount(swRunList, { localVue, router })

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

    it('copies the current run, starts the copy, and routes to it', () => {
      wrapper = mount(swRunList, { localVue, router })

      const index = 2
      const original = wrapper.vm.runs[index]

      try {
        const stub = sinon.stub(wrapper.vm.$services.dataStore, 'save')
        const copy = wrapper.vm.create(original)

        expect(copy.status).to.equal('running')

        expect(stub.called).to.equal(true)

        expect(spy.firstCall.args[0].name).to.equal('sw-run')
        expect(spy.firstCall.args[0].params.id).to.equal(copy.id)
      } finally {
        wrapper.vm.$services.dataStore.save.restore()
      }
    })

    afterEach(() => {
      router.push.restore()
    })
  })
})
