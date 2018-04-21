import Vue from 'vue'
import swRunList from '@/components/sw-run-list'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import VueRouter from 'vue-router'

// Rig up and use the mock dataStore
var dataStore = new DataStore()

Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run-list.vue', () => {
  beforeEach(() => {
    // Reset the test data
    const Constructor = Vue.extend(swRunList)
    const vm = new Constructor().$mount()
    vm.$services.dataStore.seed(seedData())
    vm.$destroy()
  })

  describe('constructor', () => {
    it('should list all runs if no props passed', () => {
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor().$mount()
      expect(vm.$el.querySelector('.sw-page-title').textContent)
        .to.equal('All runs and programs')
      expect(vm.$el.querySelectorAll('li.sw-run-item').length)
      .to.equal(dataStore.getRuns().length)
    })

    it('should list only filtered runs if filter was passed', () => {
      const Constructor = Vue.extend(swRunList)
      const propsData = {
        title: 'pie',
        filter: r => r.name.indexOf('pie') >= 0
      }
      const vm = new Constructor({ propsData }).$mount()
      expect(vm.$el.querySelector('.sw-page-title').textContent)
        .to.equal(propsData.title)
      expect(vm.$el.querySelectorAll('li.sw-run-item').length)
        .to.equal(dataStore.getRuns(propsData.filter).length)
    })

    it('shows the Create New button for program list', () => {
      const Constructor = Vue.extend(swRunList)
      const propsData = {
        type: 'program'
      }
      const vm = new Constructor({ propsData }).$mount()
      expect(vm.$el.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.not.equal(null)
    })

    it('hides the Create New button for non-program list', () => {
      const Constructor = Vue.extend(swRunList)
      const propsData = {
        type: 'pies'
      }
      const vm = new Constructor({ propsData }).$mount()
      expect(vm.$el.querySelector('.sw-header > .sw-action-button i[title="New"]'))
        .to.equal(null)
    })
  })

  describe('newProgram', () => {
    it('creates a new program and saves it to the data store', () => {
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor().$mount()

      const count = vm.runs.length
      try {
        const stub = sinon.stub(vm.$services.dataStore, 'save')

        vm.newProgram()
        expect(vm.runs.length).to.equal(count + 1)
        expect(stub.called).to.equal(true)
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('copy', () => {
    it('copies the current run and inserts new after current', () => {
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor().$mount()

      const count = vm.runs.length
      const index = 2
      const original = vm.runs[index]

      try {
        const stub = sinon.stub(vm.$services.dataStore, 'save')
        const copy = vm.copy(original)

        expect(vm.runs.length).to.equal(count + 1)
        expect(vm.runs.indexOf(copy)).to.equal(index + 1)
        expect(vm.runs.indexOf(original)).to.equal(index)
        expect(stub.called).to.equal(true)
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })

    it('sets status of copy of program to "program"', () => {
      const Constructor = Vue.extend(swRunList)
      const propsData = {
        type: 'program',
        filter: r => r.status === 'program'
      }
      const vm = new Constructor({ propsData }).$mount()

      const index = 0
      const original = vm.runs[index]

      try {
        sinon.stub(vm.$services.dataStore, 'save')
        const copy = vm.copy(original)

        expect(copy.status).to.equal('program')
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })

    it('sets status of copy of run to "created"', () => {
      const Constructor = Vue.extend(swRunList)
      const propsData = {
        type: 'running',
        filter: r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
      }
      const vm = new Constructor({ propsData }).$mount()

      const index = 0
      const original = vm.runs[index]

      try {
        sinon.stub(vm.$services.dataStore, 'save')
        const copy = vm.copy(original)

        expect(copy.status).to.equal('created')
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })
  })

  describe('remove', () => {
    it('deletes the selected run and saves the data store', () => {
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor().$mount()

      const count = vm.runs.length
      const index = 2
      const original = vm.runs[index]

      try {
        const stub = sinon.stub(vm.$services.dataStore, 'save')

        vm.remove(original)
        expect(vm.runs.length).to.equal(count - 1)
        expect(vm.runs.indexOf(original)).to.equal(-1)
        expect(stub.called).to.equal(true)
      } finally {
        vm.$services.dataStore.save.restore()
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
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor({ router }).$mount()

      const run = vm.runs[2]
      vm.viewDetails(run)

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
      const Constructor = Vue.extend(swRunList)
      const vm = new Constructor({ router }).$mount()

      const index = 2
      const original = vm.runs[index]

      try {
        const stub = sinon.stub(vm.$services.dataStore, 'save')
        const copy = vm.create(original)

        expect(copy.status).to.equal('running')

        expect(stub.called).to.equal(true)

        expect(spy.firstCall.args[0].name).to.equal('sw-run')
        expect(spy.firstCall.args[0].params.id).to.equal(copy.id)
      } finally {
        vm.$services.dataStore.save.restore()
      }
    })

    afterEach(() => {
      router.push.restore()
    })
  })
})
