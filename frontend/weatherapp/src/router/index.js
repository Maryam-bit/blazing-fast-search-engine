import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/Dashboard.vue";

import Login from "../components/LoginForm.vue";
import Signup from "../components/SignupForm.vue";
import NotFound from "../views/NotFound.vue";
import { userProfile } from '../services/apiService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "login",
          name: "Login",
          component: Login,
        },
        {
          path: "signup",
          name: "Signup",
          component: Signup,
        },
      ],
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      component: NotFound,
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  let user = {}
  if (to.meta.requiresAuth) {
    try {
      let user = await userProfile();
      if (user.status === 200) {
        // User is authenticated, allow navigation to the requested route
        next();
      } else {
        // User is not authenticated, redirect to the login route
        localStorage.removeItem("jwt");
        next({ name: 'Login' });
      }
    } catch (error) {
      // An error occurred, redirect to the login route
      console.log('Error checking authentication:', error);
      localStorage.removeItem("jwt");
      next({ name: 'Login' });
    }
  } else if ((to.name === 'Login' || to.name === 'Signup') && localStorage.getItem('jwt')) {
    // Redirect back to the dashboard
    next({ name: 'dashboard' });
  } else {
    next();
  }
});


export default router;
