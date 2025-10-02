import { ChildEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import {
    handleCartOperation,
    type CartOperation,
} from '../services/CartService.js'
import {
    handleOrderOperation,
    type OrderOperation,
} from '../services/OrderServce.js'
import { Order } from './Order.js'

@Entity()
abstract class Customer {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: false })
    readonly hasDiscounts: boolean

    @Column({ default: false })
    readonly hasPriority: boolean

    @Column({ unique: true })
    email: string

    @Column('real')
    balance: number

    @Column('int', { array: true })
    cart: number[]

    @OneToMany(() => Order, (order) => order.owner, { cascade: true, eager: true })
    orders: Order[]

    public constructor(
        name: string,
        email: string,
        hasDiscounts: boolean,
        hasPriority: boolean,
        balance: number,
    ) {
        if (balance < 0 || balance > 100_000) {
            throw new Error('Invalid balance')
        }
        this.name = name
        this.email = email
        this.hasDiscounts = hasDiscounts
        this.hasPriority = hasPriority
        this.balance = balance
        this.cart = []

    }

    async modifyCart(operation: CartOperation, productId: number) {
        await handleCartOperation(operation, this, productId)
    }

    async modifyOrder(operation: OrderOperation) {
        await handleOrderOperation(operation, this)
    }
}

@ChildEntity()
class RegularCustomer extends Customer {
    constructor(name: string, email: string, balance: number) {
        super(name, email, false, false, balance)
    }
}

@ChildEntity()
class PremiumCustomer extends Customer {
    constructor(name: string, email: string, balance: number) {
        super(name, email, true, true, balance)
    }
}

export { Customer, RegularCustomer, PremiumCustomer }
