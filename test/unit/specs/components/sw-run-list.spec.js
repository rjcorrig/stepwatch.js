import Vue from 'vue'
import swRunList from '@/components/sw-run-list'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore()
Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run-list.vue', () => {
  before(() => {
    // Set up the test data
    dataStore.seed(seedData)
  })

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
    expect(vm.$el.querySelector('.sw-header > .sw-action-button'))
      .to.not.equal(null)
  })

  it('hides the Create New button for non-program list', () => {
    const Constructor = Vue.extend(swRunList)
    const propsData = {
      type: 'pies'
    }
    const vm = new Constructor({ propsData }).$mount()
    expect(vm.$el.querySelector('.sw-header > .sw-action-button'))
      .to.equal(null)
  })
})
