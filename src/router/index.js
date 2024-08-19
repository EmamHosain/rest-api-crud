import { createRouter, createWebHistory } from 'vue-router'
import GuestLayout from '../layouts/GuestLayout.vue';

// start 
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
// end

import authRouteHelper from '@/helpers/authRouteHelper';
const {
  checkIfUserIsLoggedIn,
  checkIfUserIsNotLoggedIn,
  registerNavigationAttempt,
  loginNavigationAttempt,
  ifNotSelectProduct,
  userPageLoadBeforeGetUserData,
  userProductPageLoadBeforeGetProducts
} = authRouteHelper();




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home-page',
          component: ECommerceView,
          beforeEnter: [checkIfUserIsNotLoggedIn]
        },

        {
          path: '/products',
          name: 'view-products-page',
          component: () => import('../views/Product/ProductView.vue'),
          meta: {
            title: 'Products'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn, userProductPageLoadBeforeGetProducts]
        },

        // user route start here
        {
          path: '/users',
          name: 'all-users-page',
          component: () => import('../views/User/UsersView.vue'),
          meta: {
            title: 'All users'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn, userPageLoadBeforeGetUserData]
        },
        // user route end here






        {
          path: '/calendar',
          name: 'calendar',
          component: CalendarView,
          meta: {
            title: 'Calendar'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },




        {
          path: '/profile',
          name: 'profile',
          component: ProfileView,
          meta: {
            title: 'Profile'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/forms/form-elements',
          name: 'formElements',
          component: FormElementsView,
          meta: {
            title: 'Form Elements'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/forms/form-layout',
          name: 'formLayout',
          component: FormLayoutView,
          meta: {
            title: 'Form Layout'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/tables',
          name: 'tables',
          component: TablesView,
          meta: {
            title: 'Tables'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/pages/settings',
          name: 'settings',
          component: SettingsView,
          meta: {
            title: 'Settings'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/charts/basic-chart',
          name: 'basicChart',
          component: BasicChartView,
          meta: {
            title: 'Basic Chart'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/ui-elements/alerts',
          name: 'alerts',
          component: AlertsView,
          meta: {
            title: 'Alerts'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },
        {
          path: '/ui-elements/buttons',
          name: 'buttons',
          component: ButtonsView,
          meta: {
            title: 'Buttons'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]

        },

      ]
    },
    {
      path: '/login',
      component: GuestLayout,
      children: [

        {
          path: '',
          name: 'login-page',
          component: () => import('../views/auth/LoginView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn, loginNavigationAttempt],
        },
        {
          path: '/register',
          name: 'register-page',
          component: () => import('../views/auth/RegisterView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn, registerNavigationAttempt],

        },
        {
          path: '/forget-password',
          name: 'forget-password-page',
          component: () => import('../views/auth/ForgetPasswordView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn],

        },

        {
          path: '/api/reset-password/:token',
          name: 'reset-password-page',
          component: () => import('../views/auth/ResetPasswordView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn],

        },



      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },

})

export default router
