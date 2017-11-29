import Vue from 'vue'
import Router from 'vue-router'
import swRun from '@/components/sw-run'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'sw-run',
      component: swRun
    }
  ]
})
