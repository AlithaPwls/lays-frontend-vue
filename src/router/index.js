import { createRouter, createWebHistory } from 'vue-router'

import ConfiguratorView from '../views/ConfiguratorView.vue'
import DesignsView from '../views/DesignsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  {
    path: '/',
    redirect: '/configurator'
  },
  {
    path: '/configurator',
    name: 'configurator',
    component: ConfiguratorView
  },
  {
    path: '/designs',
    name: 'designs',
    component: DesignsView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router