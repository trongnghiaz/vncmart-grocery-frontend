// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 1. Định nghĩa danh sách các tuyến đường (Routes)
const routes: Array<RouteRecordRaw> = [
  // ==========================================
  // PHÂN HỆ 1: CUSTOMER STOREFRONT (Trang Khách Hàng)
  // ==========================================
  {
    path: '/',
    name: 'CustomerLayout',
    component: () => import('../components/customer/CustomerLayout.vue'),
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
    component: () => import('../components/admin/AdminLayout.vue'),
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
  },
];

// 2. Khởi tạo thực thể Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 3. Toàn cục Navigation Guard (Nơi sau này chặn quyền truy cập)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Danh sách các đường dẫn yêu cầu phải ĐĂNG NHẬP mới được vào (phía Customer)
  const requireAuthRoutes = ['Cart', 'Checkout', 'OrderHistory'];
  
  // 1. Kiểm tra nếu trang yêu cầu quyền Admin (Tất cả các trang con của AdminLayout)
  // Chúng hanh kiểm tra thông qua thuộc tính 'to.path' bắt đầu bằng '/admin'
  if (to.path.startsWith('/admin')) {
    // Nếu là trang đăng nhập admin (nếu có tách riêng) thì bỏ qua, ở đây ta chặn chung:
    if (!authStore.isAuthenticated) {
      alert('Vui lòng đăng nhập tài khoản quản trị.');
      return next({ name: 'Login' });
    }
    
    if (!authStore.isAdmin) {
      alert('Bạn không có quyền truy cập vào phân hệ quản trị này.');
      return next({ name: 'Home' }); // Đá về trang chủ khách hàng
    }
    
    return next(); // Thỏa mãn điều kiện admin -> Cho qua
  }

  // 2. Kiểm tra nếu trang yêu cầu đăng nhập thông thường (phía Khách hàng)
  if (requireAuthRoutes.includes(to.name as string)) {
    if (!authStore.isAuthenticated) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này.');
      return next({ name: 'Login' }); // Đá về trang đăng nhập
    }
    
    return next();
  }

  // 3. Nếu người dùng ĐÃ ĐĂNG NHẬP rồi mà vẫn cố tình vào lại trang 'Login'
  if (to.name === 'Login' && authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      return next({ name: 'AdminDashboard' }); // Admin thì đẩy vào dashboard
    }
    return next({ name: 'Home' }); // Khách thường thì đẩy về trang chủ
  }

  // Cho phép truy cập đối với các trang công cộng (Trang chủ, các trang không bị chặn)
  next();
});

export default router;
