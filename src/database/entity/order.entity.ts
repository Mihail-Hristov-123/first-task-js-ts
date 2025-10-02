import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { Customer } from './customer.entity.js'
import { Product } from './product.entity.js'

type Status = 'pending' | 'complete'

type ProductSummary = Pick<Product, 'id' | 'name'>

type CustomerSummary = Pick<Customer, 'id' | 'name'>

type OrderSummary = Pick<Order, 'id' | 'status' | 'total'> & {
    products: ProductSummary[]
    owner: CustomerSummary
}
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]

    @Column({ type: 'enum', enum: ['pending', 'complete'], default: 'pending' })
    status: Status

    @Column('real', { nullable: true })
    total: number

    @ManyToOne(() => Customer, (customer) => customer.orders)
    owner: Customer

    getSummary(order: Order): OrderSummary {
        return {
            id: order.id,
            status: order.status,
            total: order.total,
            products: order.products.map((p) => ({
                id: p.id,
                name: p.name,
            })),
            owner: {
                id: order.owner.id,
                name: order.owner.name,
            },
        }
    }

    constructor(owner: Customer) {
        this.owner = owner
    }
}
