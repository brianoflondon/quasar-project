const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/images', component: () => import('pages/TestingImages.vue') },
      { path: '/testing', component: () => import('pages/TestingPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/calc', component: () => import('components/Calculator.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes;
