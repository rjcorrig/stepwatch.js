import Vue from 'vue'
import swRun from '@/components/sw-run'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'
import router from '@/router'

// Rig up and use the mock dataStore
var dataStore = new DataStore(sessionStorage)
dataStore.seed(seedData)
dataStore.save()

Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run.vue', () => {
  var program

  beforeEach(() => {
    // Set up the test data
    dataStore.load()
    program = dataStore.getRun('foo')
  })

  describe('constructor', () => {
    it('should render run name in header if run found', () => {
      const Constructor = Vue.extend(swRun)
      const vm = new Constructor({
        propsData: { id: 'foo' }
      }).$mount()
      expect(vm.$el.querySelector('.sw-run h1').textContent)
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

      const saveStub = sinon.spy(vm.$services.dataStore, 'save')
      vm.suspend()
      let called = saveStub.called
      vm.$services.dataStore.save.restore()

      expect(vm.run.status).to.equal('paused')
      expect(called).to.equal(true)
    })
  })
})
