const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/images',
        component: () => import('src/views/ViewTestingImages.vue'),
      },
      {
        path: '/transfer',
        component: () => import('src/views/ViewTestHiveTransfer.vue'),
      },
      { path: '/testing', component: () => import('pages/TestingPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      {
        path: '/status',
        component: () => import('src/views/ViewTestingSystemStatus.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
