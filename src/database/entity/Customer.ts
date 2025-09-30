import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { cartService } from '../services/CartService.js'
import { orderService } from '../services/OrderServce.js'

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

    @Column('real')
    balance: number

    @Column('int', { array: true })
    cart: number[]

    @Column('int', { array: true })
    orderIds: number[]

    public constructor(
        name: string,
        hasDiscounts: boolean,
        hasPriority: boolean,
        balance: number,
    ) {
        if (balance < 0 || balance > 100_000) {
            throw new Error('Invalid balance')
        }
        this.name = name
        this.hasDiscounts = hasDiscounts
        this.hasPriority = hasPriority
        this.balance = balance
        this.cart = []
        this.orderIds = []
    }

    async addToCart(productId: number) {
        await cartService.addToCart(productId, this)
    }
    removeFromCart(productId: number) {
        cartService.removeFromCart(productId, this)
    }

    async placeOrder() {
        await orderService.placeOrder(this)
    }

    async payAllOrders() {
        await orderService.payAllOrders(this)
    }
}

@ChildEntity()
class RegularCustomer extends Customer {
    constructor(name: string, balance: number) {
        super(name, false, false, balance)
    }
}

@ChildEntity()
class PremiumCustomer extends Customer {
    constructor(name: string, balance: number) {
        super(name, true, true, balance)
    }
}

export { Customer, RegularCustomer, PremiumCustomer }
