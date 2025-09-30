import { ChildEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { customerRepo, orderRepo, productRepo } from '../../index.js'
import { Order } from './Order.js'
import { simulatePayment } from '../../utils/simulatePayment.js'
import { completeOrders } from '../../utils/completeOrders.js'

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

    async placeOrder() {
        const newOrder = new Order(this.cart, this.id)
        try {
            const result = await orderRepo.save(newOrder)
            this.orderIds.push(result.id)
            customerRepo.save(this)
            console.log('Order placed')
        } catch (error) {
            console.log(`Order placement failed: ${error}`)
        }
    }

    async payAllOrders() {
        try {
            const [allUserOrders, orderCount] = await orderRepo.findAndCountBy({
                ownerId: this.id,
            })
            if (!orderCount) {
                console.log(
                    `User ${this.name} has no active orders at this moment`,
                )
                return
            }

            const ordersTotal = allUserOrders.reduce(
                (sum: number, order) => (sum += order.total),
                0,
            )

            console.log(await simulatePayment(this.balance, ordersTotal))
            this.balance -= ordersTotal
            await completeOrders(allUserOrders)
            customerRepo.save(this)
            console.log(`User ${this.name} has paid for all their orders`)
        } catch (error) {
            console.error(`Error occurred during payment: ${error}`)
        }
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
