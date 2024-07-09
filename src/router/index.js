import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../layouts/DefaultLayout.vue'
import AboutView from '../views/AboutView.vue'
import GuestLayout from '../layouts/GuestLayout.vue';
import { useAuthStore } from '@/stores/useAuthStore';

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





const checkIfUserIsLoggedIn = (to, from, next) => {
  const store = useAuthStore();
  if (store.access_token) {
    next('/');
  } else {
    next();
  }
}

const checkIfUserIsNotLoggedIn = (to, from, next) => {
  const store = useAuthStore();
  if (!store.access_token) {
    store.setClearResetPassPageSeeLogic();
    next('/login');
  } else {
    next();
  }
}

const checkUserCanSeeEmailVerifyPage = (to, from, next) => {
  const store = useAuthStore();
  if (!store.canSeeEmailVerifyPage || store.canSeeEmailVerifyPage === 'false') {
    store.setClearResetPassPageSeeLogic();
    next('/login');
  } else {
    next();
  }
}

const checkUserCanSeeResetPassPage = (to, from, next) => {
  const store = useAuthStore();
  if (!store.canSeeResetPassPage || store.canSeeResetPassPage === 'false') {
    store.setClearResetPassPageSeeLogic();
    next('/login');
  } else {
    next();
  }
}



const registerNavigationAttempt = (to, from, next) => {
  const store = useAuthStore();
  store.errors = null
  next();
}



const loginNavigationAttempt = (to, from, next) => {
  const store = useAuthStore();
  store.errors = null
  store.setClearResetPassPageSeeLogic();
  next();
}


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
          name: 'products',
          component: () => import('../views/Product/ProductView.vue'),
          meta: {
            title: 'Products'
          },
          beforeEnter: [checkIfUserIsNotLoggedIn]
        },

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
          path: '/otp-verify',
          name: 'otp-verify-page',
          component: () => import('../views/auth/OTPVerificationView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn, checkUserCanSeeEmailVerifyPage],

        },
        {
          path: '/reset-password',
          name: 'reset-password-page',
          component: () => import('../views/auth/ResetPasswordView.vue'),
          beforeEnter: [checkIfUserIsLoggedIn, checkUserCanSeeResetPassPage],

        },



      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {

    if (savedPosition) {
      return { top: 0 }
    }
    return {
      // could also be
      el: document.getElementById('product'),
      el: '#product',
      // 10px above the element
      top: 0,
    }

  },
})

export default router
