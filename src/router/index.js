import Vue from 'vue'
import Router from 'vue-router'
import swRun from '@/components/sw-run'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/run/:id',
      name: 'sw-run',
      component: swRun,
      props: true
    }
  ]
})
