// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// 1. Định nghĩa danh sách các tuyến đường (Routes)
const routes: Array<RouteRecordRaw> = [
  // ==========================================
  // PHÂN HỆ 1: CUSTOMER STOREFRONT (Trang Khách Hàng)
  // ==========================================
  {
    path: '/',
    name: 'CustomerLayout',
    // Tạm thời dùng component trống, sau này sẽ thay bằng file Layout hoàn chỉnh của Stitch
    component: () => import('../views/customer/HomeView.vue'), // Đổi thành CustomerLayout sau khi có file
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/customer/HomeView.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/customer/LoginView.vue'),
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../views/customer/CartView.vue'),
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('../views/customer/CheckoutView.vue'),
      },
      {
        path: 'order-history',
        name: 'OrderHistory',
        component: () => import('../views/customer/OrderHistoryView.vue'),
      },
    ],
  },

  // ==========================================
  // PHÂN HỆ 2: ADMIN BACK-OFFICE (Trang Quản Trị)
  // ==========================================
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../views/admin/DashboardView.vue'), // Đổi thành AdminLayout sau khi có file
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/DashboardView.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/OrderManagementView.vue'),
      },
    ],
  },

  // ==========================================
  // HỨNG CÁC ROUTE LỖI / KHÔNG TỒN TẠI
  // ==========================================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/customer/NotFoundView.vue'),
  }
];

// 2. Khởi tạo thực thể Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 3. Toàn cục Navigation Guard (Nơi sau này chặn quyền truy cập)
router.beforeEach((to, from, next) => {
  // Logic kiểm tra token và phân quyền (Mục 11, 12) sẽ được viết ở đây
  next();
});

export default router;