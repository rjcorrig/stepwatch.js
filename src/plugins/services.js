import servicesFn from '@/stepwatch/services'

var services

export default {
  services: services,
  install: function (Vue, options) {
    services = servicesFn(options)
    console.log('service plugin install: ' + services)
    Object.defineProperty(Vue.prototype, '$services', {
      get () { return services }
    })
  }
}
