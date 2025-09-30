import {
    ChildEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { orderRepo, productRepo } from '../../index.js'
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

    @Column('real')
    private balance: number

    @Column('int', { array: true })
    private cart: number[]

    async addToCart(productId: number) {
        try {
            const productExists = await productRepo.findOneBy({ id: productId })
            if (!productExists)
                throw new Error(`Product with ID ${productId} was not found`)
            this.cart.push(productId)
            console.log(
                `Product with ID ${productId} was added to ${this.name}'s cart`,
            )
        } catch (error) {
            console.error(
                `Error occurred while adding product to cart: ${error}`,
            )
        }
    }
    removeFromCart(productId: number) {
        const productIndex = this.cart.indexOf(productId)
        if (productIndex === -1) {
            console.log(
                `Product with id ${productId} was not in ${this.name}'s cart`,
            )
        }
        this.cart.splice(productIndex, 1)
        console.log(
            `Product with id ${productId} was successfully removed from ${this.name}'s cart`,
        )
    }

    @OneToMany(() => Order, (order) => order.owner)
    orders: Order[]

    async placeOrder() {
        const newOrder = new Order(this.cart, this.id)
        try {
            await orderRepo.save(newOrder)
            console.log('Order placed')
        } catch (error) {
            console.log(`Order placement failed: ${error}`)
        }
    }

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
