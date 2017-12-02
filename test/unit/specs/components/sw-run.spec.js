import Vue from 'vue'
import swRun from '@/components/sw-run'
import models from '@/stepwatch/models'
import services from '@/plugins/services'

Vue.use(services)

describe('sw-run.vue', () => {
  var run

  beforeEach(() => {
    run = new models.Run()
    run.name = 'Sprint'
    run.id = 'foo'
    var step1 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })
    var step2 = new models.Step({ name: 'Run for 15 seconds', totalSeconds: 15 })
    var step3 = new models.Step({ name: 'Walk for 5 seconds', totalSeconds: 5 })

    run.steps = [ step1, step2, step3 ]
    run.steps.forEach(function (step, i) {
      step.id = i
    })
  })

  it('should render not found message if no run found', () => {
    const Constructor = Vue.extend(swRun)
    const vm = new Constructor({
      propsData: { id: 'foo' }
    }).$mount()
    expect(vm.$el.querySelector('.sw-run h1').textContent)
      .to.equal('Run not found')
  })
})
