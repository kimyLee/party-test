import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Client from '@/views/Client.vue'
import Game0 from '@/views/game0.vue'
import Game1 from '@/views/game1.vue'
import Game2 from '@/views/game2.vue'
import Game3 from '@/views/game3.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game0',
    name: 'game0',
    component: Game0,
  },
  {
    path: '/game1',
    name: 'game1',
    component: Game1,
  },
  {
    path: '/game2',
    name: 'game2',
    component: Game2,
  },
  {
    path: '/game3',
    name: 'game3',
    component: Game3,
  },
  {
    path: '/game4',
    name: 'game4',
    component: Game0,
  },
  {
    path: '/game5',
    name: 'game5',
    component: Game1,
  },
  {
    path: '/game6',
    name: 'game6',
    component: Game2,
  },
  {
    path: '/client',
    name: 'Client',
    component: Client,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
