import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/layouts/Login.vue'
import Panel from './components/layouts/Panel.vue'
import Read from './components/views/Read.vue'

import Cookies  from 'cookies-js'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        isAuth: true,
        requiredAuth: false
      },
    },
    {
      path: '/panel',
      name: 'panel',
      redirect: '/panel/read',
      meta: {
        requiredAuth: true
      },
      component: Panel,
      children: [
        {
          path: 'read',
          name: 'read',
          component: Read,
          meta: {
            requiredAuth: true
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.meta.requiredAuth) {
    let userId = Cookies.get('userId')
    let isAuthUser = userId != undefined ? true : false
    if (isAuthUser) {
      next()
    } else {
      router.push('/')
    }
  } else {
    next()
  }

  if (to.meta.isAuth) {
    let userId = Cookies.get('userId')
    let isAuthUser = userId != undefined ? true : false
    if (isAuthUser) {
      router.push('/panel')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router


