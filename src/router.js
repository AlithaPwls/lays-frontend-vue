import { createRouter, createWebHistory } from 'vue-router'

import ConfiguratorView from './views/ConfiguratorView.vue'
import DesignsView from './views/DesignsView.vue'

const routes = [
  {
    path: '/',
    name: 'configurator',
    component: ConfiguratorView
  },
  {
    path: '/designs',
    name: 'designs',
    component: DesignsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router