import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'CustomerLayout',
    component: () => import('@/components/customer/CustomerLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/customer/HomeView.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/customer/LoginView.vue'),
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('@/views/customer/ProductDetailView.vue'),
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/customer/CartView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/customer/CheckoutView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'order-history',
        name: 'OrderHistory',
        component: () => import('@/views/customer/OrderHistoryView.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/customer/LoginView.vue'),
    meta: { staffLogin: true },
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' },
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/OrderManagementView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/customer/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isLoginRoute = to.name === 'Login' || to.name === 'AdminLogin';

  if (isLoginRoute && authStore.isAuthenticated) {
    return authStore.isAdmin ? { name: 'AdminDashboard' } : { name: 'Home' };
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: to.meta.requiresAdmin ? 'AdminLogin' : 'Login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'Home' };
  }

  return true;
});

export default router;
