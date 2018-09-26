import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import swHome from '@/components/sw-home'
import seedData from '@/stepwatch/models/seedData'
import services from '@/plugins/services'
import DataStore from '@/stepwatch/services/datastore'

const localVue = createLocalVue()
var dataStore = new DataStore()

localVue.use(services, {
  dataStore: dataStore
})

describe('sw-home.vue', () => {
  let wrapper

  beforeEach(() => {
    // Reset the test data
    wrapper = mount(swHome, { localVue })
    wrapper.vm.$services.dataStore.seed(seedData())
    wrapper.destroy()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should render the welcome page', () => {
      wrapper = mount(swHome, { localVue })

      expect(wrapper.element.querySelector('.sw-header').textContent)
        .to.equal('StepWatch')
    })
  })
})
