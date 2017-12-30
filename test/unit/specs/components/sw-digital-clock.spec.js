import Vue from 'vue'
import swDigitalClock from '@/components/sw-digital-clock'

describe('sw-digital-clock.vue', () => {
  it('displays mm:ss time for times less than an hour', () => {
    const Constructor = Vue.extend(swDigitalClock)
    const vm = new Constructor({
      propsData: { seconds: 3599 }
    }).$mount()
    expect(vm.$el.textContent)
      .to.match(/[0-9][0-9]:[0-9][0-9]/)
  })

  it('displays hh:mm:ss time for times equal to over an hour', () => {
    const Constructor = Vue.extend(swDigitalClock)
    const vm = new Constructor({
      propsData: { seconds: 3600 }
    }).$mount()
    expect(vm.$el.textContent)
      .to.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/)
  })
})
