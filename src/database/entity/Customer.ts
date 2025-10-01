import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { handleCartOperation, type CartOperation } from '../services/CartService.js'
import { handleOrderOperation, type OrderOperation } from '../services/OrderServce.js'

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

    async modifyCart(operation: CartOperation, productId: number) {
        await handleCartOperation(operation, this, productId)
    }

    async modifyOrder(operation: OrderOperation) {
        await handleOrderOperation(operation, this)
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
