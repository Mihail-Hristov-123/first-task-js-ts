import type { Customer } from '../database/entity/customer.entity.js'
import type { Order } from '../database/entity/order.entity.js'
import type { Product } from '../database/entity/product.entity.js'
import type { OrderService } from '../database/services/customer.order.service.js'

type CustomerSummary = Pick<Customer, 'id' | 'name'>
type ProductSummary = Omit<Product, 'description'>
type OrderSummary = Pick<Order, 'id' | 'status' | 'total'> & {
    owner: CustomerSummary
    products: ProductSummary[]
}
type OrderOperation = Omit<keyof OrderService, 'getSummary'>

export type { OrderSummary, ProductSummary, OrderOperation, CustomerSummary }
