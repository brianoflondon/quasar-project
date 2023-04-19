import MainLayout from 'layouts/MainLayout.vue'
import ViewTestingImages from 'src/views/ViewTestingImages.vue'
import ViewTestHiveTransfer from 'src/views/ViewTestHiveTransfer.vue'
import TestingPage from 'pages/TestingPage.vue'
import LoginPage from 'pages/LoginPage.vue'
import ViewTestingSystemStatusVue from 'src/views/ViewTestingSystemStatus.vue'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/images',
        component: ViewTestingImages,
      },
      {
        path: '/transfer',
        component: ViewTestHiveTransfer,
      },
      { path: '/testing', component: TestingPage },
      { path: '/login', component: LoginPage },
      {
        path: '/status',
        component: ViewTestingSystemStatusVue,
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
