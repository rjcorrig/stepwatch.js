import servicesFn from '@/stepwatch/services'

export default {
  install: function (Vue, options) {
    var _services = servicesFn(options)
    Object.defineProperty(Vue.prototype, '$services', {
      get () { return _services }
    })
  }
}
