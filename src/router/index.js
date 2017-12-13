import Vue from 'vue'
import Router from 'vue-router'
import swRun from '@/components/sw-run'
import swHome from '@/components/sw-home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'sw-home',
      component: swHome
    },
    {
      path: '/run/:id',
      name: 'sw-run',
      component: swRun,
      props: true
    }
  ]
})
