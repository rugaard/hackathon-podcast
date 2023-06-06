import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() { return { top: 0 } },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Index.vue')
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('../views/Article.vue')
    },
    {
      path: '/podcasts',
      name: 'podcasts',
      component: () => import('../views/Podcasts.vue')
    },
    {
      path: '/podcasts/:showId',
      name: 'podcast-show',
      component: () => import('../views/PodcastShow.vue')
    },
    {
      path: '/hackathon',
      name: 'hackathon',
      component: () => import('../views/Hackathon.vue')
    }
  ]
})

export default router
