import Vue from 'vue'
import swRunCategory from '@/components/sw-run-category'
import seedData from '@/stepwatch/models/seedData'
import VueRouter from 'vue-router'
import sinon from 'sinon'

describe('sw-run-category.vue', () => {
  const Constructor = Vue.extend(swRunCategory)
  let vm

  beforeEach(() => {
    // Reset the test data
    vm = new Constructor().$mount()
    vm.$services.dataStore.seed(seedData())
    vm.$destroy()
  })

  afterEach(() => {
    vm.$destroy()
  })

  describe('constructor', () => {
    it('should summarize all runs if no props passed', () => {
      vm = new Constructor().$mount()
      expect(vm.$el.querySelector('.sw-run-category-text').textContent)
        .to.equal('All runs and programs')
      expect(vm.$el.querySelector('.sw-run-category-count').textContent)
        .to.equal(vm.$services.dataStore.getRuns().length.toString())
    })

    it('should count number of filtered runs if filter was passed', () => {
      const propsData = {
        title: 'pie',
        filter: r => r.name.indexOf('pie') >= 0
      }
      vm = new Constructor({ propsData }).$mount()
      expect(vm.$el.querySelector('.sw-run-category-text').textContent)
        .to.equal(propsData.title)
      expect(vm.$el.querySelector('.sw-run-category-count').textContent)
        .to.equal(vm.$services.dataStore.getRuns(propsData.filter).length.toString())
    })
  })

  describe('listRuns', () => {
    var router, spy

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
      vm = new Constructor({
        router,
        propsData
      }).$mount()

      const stub = sinon.stub(vm, 'listRuns')
      vm.listRuns = stub

      const click = document.createEvent('MouseEvent')
      click.initEvent('click', true, true)
      vm.$el.querySelector('.sw-run-category').dispatchEvent(click)

      expect(stub.called).to.equal(true)
    })

    it('should route to /runs/{{ this.type }}', () => {
      const propsData = {
        title: 'pie',
        type: 'pies',
        filter: r => r.name.indexOf('pie') >= 0
      }
      vm = new Constructor({
        router,
        propsData
      }).$mount()

      vm.listRuns()
      expect(spy.firstCall.args[0].path).to.equal('/runs/pies')
    })
  })
})
