import Vue from 'vue'
import swRunCategory from '@/components/sw-run-category'
import seedData from '@/stepwatch/models/seedData'
import servicePlugin from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

// Rig up and use the mock dataStore
var dataStore = new DataStore()
Vue.use(servicePlugin, {
  dataStore: dataStore
})

describe('sw-run-category.vue', () => {
  before(() => {
    // Set up the test data
    dataStore.seed(seedData)
  })

  it('should summarize all runs if no props passed', () => {
    const Constructor = Vue.extend(swRunCategory)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.sw-run-category-text').textContent)
      .to.equal('All runs and programs')
    expect(vm.$el.querySelector('.sw-run-category-count').textContent)
    .to.equal(dataStore.getRuns().length.toString())
  })

  it('should count number of filtered runs if filter was passed', () => {
    const Constructor = Vue.extend(swRunCategory)
    const propsData = {
      title: 'pie',
      filter: r => r.name.indexOf('pie') >= 0
    }
    const vm = new Constructor({ propsData }).$mount()
    expect(vm.$el.querySelector('.sw-run-category-text').textContent)
      .to.equal(propsData.title)
    expect(vm.$el.querySelector('.sw-run-category-count').textContent)
    .to.equal(dataStore.getRuns(propsData.filter).length.toString())
  })
})
