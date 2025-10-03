import type { Product } from './entity.types.js'

export type Status = 'pending' | 'complete'

export { Customer } from '../database/entity/customer.entity.js'
export { Order } from '../database/entity/order.entity.js'
export { Product } from '../database/entity/product.entity.js'

export interface RawProduct {
    [key: string]: unknown
}

export type ProductFields = Pick<Product, 'title' | 'description' | 'price'>
