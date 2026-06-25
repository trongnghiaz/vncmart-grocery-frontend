export type Nullable<T> = T | null
export type IsoDateString = string

export interface ApiResponse<T> {
  isSuccess: boolean
  data: T
  errorMessage?: Nullable<string>
  statusCode: number
}

export interface ErrorResponse {
  success: false
  statusCode: number
  message: string
  detail: string
}

export interface ValidationProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
}

export type ApiErrorPayload = ErrorResponse | ValidationProblemDetails

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export interface PagingRequest {
  pageNumber: number
  pageSize: number
}

export interface SearchPagingRequest extends PagingRequest {
  searchTerm?: string
}

export enum OrderStatusValue {
  PendingConfirmation = 1,
  Processing = 2,
  Delivered = 3,
  Received = 4,
  Cancelled = 5,
}

export enum PaymentMethodValue {
  Cod = 1,
  BankTransfer = 2,
}

export enum PaymentStatusValue {
  Unpaid = 1,
  Paid = 2,
}

export type OrderStatusLabel =
  | 'Chờ xác nhận'
  | 'Đang xử lý'
  | 'Đã giao hàng'
  | 'Đã nhận hàng'
  | 'Đã hủy'

export type PaymentMethodLabel = 'COD' | 'Chuyển khoản'
export type PaymentStatusLabel = 'Chưa thanh toán' | 'Đã thanh toán'

export const ORDER_STATUS_LABELS: Record<OrderStatusValue, OrderStatusLabel> = {
  [OrderStatusValue.PendingConfirmation]: 'Chờ xác nhận',
  [OrderStatusValue.Processing]: 'Đang xử lý',
  [OrderStatusValue.Delivered]: 'Đã giao hàng',
  [OrderStatusValue.Received]: 'Đã nhận hàng',
  [OrderStatusValue.Cancelled]: 'Đã hủy',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodValue, PaymentMethodLabel> = {
  [PaymentMethodValue.Cod]: 'COD',
  [PaymentMethodValue.BankTransfer]: 'Chuyển khoản',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatusValue, PaymentStatusLabel> = {
  [PaymentStatusValue.Unpaid]: 'Chưa thanh toán',
  [PaymentStatusValue.Paid]: 'Đã thanh toán',
}

export interface AuthResultDto {
  id: number
  account: string
  fullName: string
  role: string
  isStaff: boolean
  token: string
}

export interface RegisterRequest {
  phoneNumber: string
  password: string
  fullName?: Nullable<string>
  email?: Nullable<string>
}

export interface LoginRequest {
  account: string
  password: string
}

export interface ProductDto {
  productId: number
  productCode: string
  productName: string
  slug: string
  price: number
  originalPrice?: Nullable<number>
  thumbnailUrl?: Nullable<string>
  stockQuantity: number
  ratingAverage: number
  isAvailable: boolean
  categoryName: string
}

export interface ProductDetailDto extends ProductDto {
  description?: Nullable<string>
}

export interface GetProductsRequest extends SearchPagingRequest {}

export interface CreateProductRequest {
  productCode: string
  productName: string
  slug: string
  categoryId: number
  price: number
  originalPrice?: Nullable<number>
  description?: Nullable<string>
  thumbnailUrl?: Nullable<string>
  stockQuantity: number
}

export interface UpdateProductRequest extends CreateProductRequest {
  isVisible: boolean
}

export interface CategoryDto {
  categoryId: number
  categoryName: string
  slug: string
  displayOrder: number
  isVisible: boolean
  description?: Nullable<string>
}

export interface CreateCategoryRequest {
  categoryName: string
  slug: string
  displayOrder: number
  isVisible: boolean
  description?: Nullable<string>
}

export type UpdateCategoryRequest = CreateCategoryRequest

export interface CartDto {
  cartId: number
  customerId: number
  updatedAt: IsoDateString
  items: CartItemDto[]
  totalQuantity: number
  subTotal: number
}

export interface CartItemDto {
  cartItemId: number
  productId: number
  productName: string
  thumbnailUrl?: Nullable<string>
  price: number
  quantity: number
  totalPrice: number
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemRequest {
  productId: number
  quantity: number
}

export interface CreateOrderDto {
  receiverName: string
  receiverPhone: string
  shippingAddress: string
  paymentMethod: PaymentMethodLabel
  note?: Nullable<string>
  items: CreateOrderItemDto[]
}

export interface CreateOrderItemDto {
  productId: number
  quantity: number
}

export interface QrPaymentResultDto {
  qrCodeUrl: string
  qrDataString: string
  orderCode: string
  totalAmount: number
}

export interface DashboardSummaryDto {
  totalRevenue: number
  totalOrders: number
  todayOrders: number
  pendingOrders: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
}

export interface RevenueChartDto {
  date: IsoDateString
  revenue: number
  orderCount: number
}

export interface TopProductDto {
  productId: number
  productName: string
  thumbnailUrl?: Nullable<string>
  totalQuantitySold: number
  totalRevenue: number
}

export interface RecentOrderDto {
  orderId: number
  orderCode: string
  customerId: number
  customerName?: Nullable<string>
  orderDate: IsoDateString
  orderStatus: OrderStatusLabel | string
  paymentStatus: PaymentStatusLabel | string
  totalPayAmount: number
}

export interface AdminOrderDto {
  orderId: number
  orderCode: string
  customerId: number
  customerName?: Nullable<string>
  orderDate: IsoDateString
  orderStatus: OrderStatusLabel | string
  paymentMethod: PaymentMethodLabel | string
  paymentStatus: PaymentStatusLabel | string
  totalOriginalAmount: number
  discountAmount: number
  shippingFee: number
  totalPayAmount: number
}

export interface AdminOrderDetailDto extends AdminOrderDto {
  receiverName: string
  receiverPhone: string
  shippingAddress: string
  note?: Nullable<string>
  items: AdminOrderItemDto[]
}

export interface AdminOrderItemDto {
  orderItemId: number
  productId: number
  productName: string
  price: number
  quantity: number
  amount: number
}

export interface GetAdminOrdersRequest extends SearchPagingRequest {
  orderStatusValue?: OrderStatusValue
  paymentStatusValue?: PaymentStatusValue
  fromDate?: IsoDateString
  toDate?: IsoDateString
}

export interface AdminCustomerDto {
  customerId: number
  phoneNumber: string
  fullName?: Nullable<string>
  email?: Nullable<string>
  isActive: boolean
  createdAt: IsoDateString
  totalOrders: number
  totalSpent: number
}

export interface AdminCustomerDetailDto extends AdminCustomerDto {
  gender?: Nullable<string>
  dateOfBirth?: Nullable<IsoDateString>
  zaloId?: Nullable<string>
  addresses: AdminCustomerAddressDto[]
}

export interface AdminCustomerAddressDto {
  customerAddressId: number
  receiverName: string
  receiverPhone: string
  fullAddress: string
  isDefault: boolean
}

export interface GetAdminCustomersRequest extends SearchPagingRequest {
  isActive?: boolean
}

export interface AdminStaffDto {
  staffId: number
  fullName: string
  email: string
  isActive: boolean
  createdAt: IsoDateString
  roleId: number
  roleName: string
}

export interface DashboardRevenueRequest {
  fromDate?: IsoDateString
  toDate?: IsoDateString
}

export interface DashboardTopProductsRequest {
  top?: number
}

export interface DashboardRecentOrdersRequest {
  take?: number
}

export interface DashboardSummaryRequest {
  lowStockThreshold?: number
}
