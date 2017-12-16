import Vue from 'vue'
import Router from 'vue-router'
import swRun from '@/components/sw-run'
import swRunList from '@/components/sw-run-list'
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
      path: '/runs',
      name: 'sw-run-list',
      component: swRunList,
      props: true
    },
    {
      path: '/run/:id',
      name: 'sw-run',
      component: swRun,
      props: true
    }
  ]
})
