import servicesFn from '@/stepwatch/services'

var services

export default {
  services: services,
  install: function (Vue, options) {
    services = servicesFn(options)
    Object.defineProperty(Vue.prototype, '$services', {
      get () { return services }
    })
  }
}
