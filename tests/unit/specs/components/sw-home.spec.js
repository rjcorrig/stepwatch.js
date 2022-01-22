import Vuex from 'vuex'
import { expect } from 'chai'
import { createLocalVue, mount } from '@vue/test-utils'
import swHome from '@/components/sw-home'
import seedData from '@/stepwatch/models/seedData'
import createStore from '@/store'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('sw-home.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Reset the test data
    store = createStore({ runs: seedData() })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('constructor', () => {
    it('should render the welcome page', () => {
      wrapper = mount(swHome, { localVue, store })

      expect(wrapper.element.querySelector('.sw-header').textContent)
        .to.equal('StepWatch')
    })
  })
})
