import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/login/home.vue'
import Login from '../views/login'
import Welcome from '../views/login/welcome.vue'
import User from '../views/user/users.vue'
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
