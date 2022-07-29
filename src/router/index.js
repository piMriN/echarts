import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: () => import('../views/sellerPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
