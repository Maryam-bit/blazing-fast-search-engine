import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DashboardView from "../views/Dashboard.vue";

import Login from "../components/LoginForm.vue";
import Signup from "../components/SignupForm.vue";

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
    },
  ],
});

export default router;
