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
} from '../services/CartService.js'
import {
    handleOrderOperation,
    type OrderOperation,
} from '../services/OrderServce.js'
import { Order } from './Order.js'
import { Product } from './Product.js'

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
