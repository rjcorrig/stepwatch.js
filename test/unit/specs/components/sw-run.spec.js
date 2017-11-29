import Vue from 'vue'
import swRun from '@/components/sw-run'

describe('sw-run.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(swRun)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.sw-runner h1').textContent)
      .to.equal('New Program')
  })
})
