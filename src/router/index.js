import Vue from 'vue'
import Router from 'vue-router'
import swRun from '@/components/sw-run'
import swRunList from '@/components/sw-run-list'
import swHome from '@/components/sw-home'
import swRunEditor from '@/components/sw-run-editor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'sw-home',
      component: swHome
    },
    {
      path: '/runs/program',
      component: swRunList,
      props: {
        type: 'program',
        title: 'Programs',
        filter: r => r.status === 'program'
      }
    },
    {
      path: '/runs/running',
      component: swRunList,
      props: {
        type: 'running',
        title: 'Current Runs',
        filter: r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
      }
    },
    {
      path: '/runs/history',
      component: swRunList,
      props: {
        type: 'history',
        title: 'History',
        filter: r => ['canceled', 'complete'].indexOf(r.status) >= 0
      }
    },
    {
      path: '/runs',
      name: 'sw-run-list',
      component: swRunList,
      props: true
    },
    {
      path: '/run/edit/:id',
      name: 'sw-run-editor',
      component: swRunEditor,
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
