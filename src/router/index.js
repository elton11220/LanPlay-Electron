import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      component: require('@/components/mainWindow').default,
      children: [
        {
          path: '',
          component:require('@/components/MainWindow/subWindow/serverList').default
        },
        {
          path: 'serverList',
          component: require('@/components/MainWindow/subWindow/serverList').default
        },
        {
          path: 'myFavour',
          component: require('@/components/MainWindow/subWindow/myFavour').default
        },
        {
          path: 'settings',
          component: require('@/components/MainWindow/subWindow/settings').default
        },
        {
          path: 'connection',
          component: require('@/components/MainWindow/subWindow/connection').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
