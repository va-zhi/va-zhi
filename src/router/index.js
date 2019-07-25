import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/login/home.vue'
import Login from '../views/login'
import Welcome from '../views/login/welcome.vue'
import User from '../views/user/users.vue'
import Right from '../views/power/rights'
import Roles from '../views/power/roles'
import Cate from '../views/goods/Cate.vue'
import Params from '../views/goods/Params.vue'
import List from '../views/goods/List.vue'
import Add from '../views/goods/Add.vue'
import Orders from '../views/orders'
import Reports from '../views/reports'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        {
          path: '/home/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Right
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Orders
        },
        {
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('login')
  next()
})
export default router
