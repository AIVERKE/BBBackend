import { createRouter, createWebHistory } from 'vue-router';
import MenuView from '../views/MenuView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import OrderSuccessView from '../views/OrderSuccessView.vue';
import CashierDashboardView from '../views/CashierDashboardView.vue';
import MenuEditorView from '../views/MenuEditorView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';
import StaffManagerView from '../views/StaffManagerView.vue';
import TenantSettingsView from '../views/TenantSettingsView.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import { authService } from '../services/auth.service';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MenuView,
    },
    {
      path: '/order-success/:id',
      name: 'order-success',
      component: OrderSuccessView,
    },
    {
      path: '/dashboard', // Changed from '/cashier' to be a child or a separate entry, creating a layout wrapper logic
      component: AdminLayout,
      children: [
        {
          path: '/cashier',
          name: 'cashier',
          component: CashierDashboardView,
        },
        {
          path: '/admin/menu',
          name: 'admin-menu',
          component: MenuEditorView,
        },
        {
          path: '/admin/analytics',
          name: 'admin-analytics',
          component: AnalyticsView,
        },
        {
          path: '/admin/staff',
          name: 'admin-staff',
          component: StaffManagerView,
        },
        {
          path: '/admin/settings',
          name: 'admin-settings',
          component: TenantSettingsView,
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = authService.getCurrentUser();

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
