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
import SuperAdminTenantsView from '../views/SuperAdminTenantsView.vue';
import SuperAdminAnalyticsView from '../views/SuperAdminAnalyticsView.vue';
import SuperAdminUsersView from '../views/SuperAdminUsersView.vue';
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
        },
        {
          path: '/admin/tenants',
          name: 'superadmin-tenants',
          component: SuperAdminTenantsView,
        },
        {
          path: '/admin/global-analytics',
          name: 'superadmin-analytics',
          component: SuperAdminAnalyticsView,
        },
        {
          path: '/admin/global-users',
          name: 'superadmin-users',
          component: SuperAdminUsersView,
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
  const publicPages = ['/login', '/register', '/'];
  // Allow order-success as pseudo public if someone shares it
  const isOrderSuccess = to.path.startsWith('/order-success');
  const authRequired = !publicPages.includes(to.path) && !isOrderSuccess;
  const loggedIn = authService.getCurrentUser();

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  if (loggedIn) {
    const role = loggedIn.role ? loggedIn.role.toUpperCase() : '';
    
    // Super User strict routing enforcement
    if (role === 'SUPER_USER') {
      const allowedSuperUserRoutes = ['/admin/tenants', '/admin/global-analytics', '/admin/global-users'];
      // Allow super user to see their own panel, but block from operational routes
      if (!allowedSuperUserRoutes.includes(to.path) && !publicPages.includes(to.path)) {
        return next('/admin/tenants');
      }
    }
    
    // Admin/Employee strict routing enforcement
    if (role === 'ADMIN' && to.path === '/admin/tenants') {
      return next('/cashier');
    }
    
    if (role === 'EMPLOYEE' && to.path.startsWith('/admin')) {
      return next('/cashier');
    }
  }

  next();
});

export default router;
