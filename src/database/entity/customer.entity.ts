import {
    ChildEntity,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import {
    handleCartOperation,
    type CartOperation,
} from '../services/customer.cart.service.js'
import { handleOrderOperation } from '../services/customer.order.service.js'
import { Order, Product } from '../../types/entity.types.js'
import type { OrderOperation } from '../../types/service.types.js'

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
    private _balance: number

    get balance() {
        return this._balance
    }

    set balance(newBalance: number) {
        if (newBalance < 0) {
            throw new Error('User balance cannot be negative')
        }
        this._balance = newBalance
    }

    @ManyToMany(() => Product, { eager: true })
    @JoinTable()
    cart: Product[]

    @OneToMany(() => Order, (order) => order.owner, {
        eager: true,
    })
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
    }

    async modifyCart(operation: CartOperation, product: Product) {
        await handleCartOperation(operation, this, product)
    }

    async modifyOrder(operation: OrderOperation) {
        await handleOrderOperation(operation, this)
    }

    *[Symbol.iterator]() {
        for (const item of this.cart) {
            yield item
        }
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
