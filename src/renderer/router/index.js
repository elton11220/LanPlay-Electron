import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainWindow',
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
          path: 'customConn',
          component: require('@/components/MainWindow/subWindow/customConn').default
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
})
