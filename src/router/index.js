import { createRouter, createWebHistory } from 'vue-router'
import ConfiguratorView from '../views/ConfiguratorView.vue'
import DesignsView from '../views/DesignsView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', component: ConfiguratorView },
  { path: '/designs', component: DesignsView },
  { path: '/login', component: LoginView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router